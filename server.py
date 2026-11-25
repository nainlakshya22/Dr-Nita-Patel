#!/usr/bin/env python3
"""
Dr. Nita Patel — Advance Dermatology & Laser Medical Center
Marina del Rey, California
Production-Structured Web, SQLite Storage, AI Concierge & Scheduling API Server
"""

import hashlib
import hmac
import http.server
import json
import os
import re
import secrets
import sqlite3
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(DIRECTORY, "data")
DB_PATH = os.path.join(DATA_DIR, "clinic.db")
os.makedirs(DATA_DIR, exist_ok=True)


def load_dotenv():
    """Load optional .env file into os.environ without overwriting existing vars."""
    env_path = os.path.join(DIRECTORY, ".env")
    if not os.path.isfile(env_path):
        return
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for raw in f:
                line = raw.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k and k not in os.environ:
                    os.environ[k] = v
    except OSError:
        pass


load_dotenv()

PORT = int(os.environ.get("PORT", "8080"))

# In-memory sliding-window rate limiter and duplicate-submission guard
_RATE_LOCK = threading.Lock()
_RATE_BUCKETS = {}
_RECENT_SUBMISSIONS = {}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

VERIFIED_CLINIC_SYSTEM_PROMPT = """You are NITA AI, an informational clinic navigation assistant for Dr. Nita Patel, MD — Advance Dermatology & Laser Medical Center in Marina del Rey, California.

VERIFIED CLINIC INFORMATION:
- Practice: Advance Dermatology & Laser Medical Center
- Physician: Dr. Nita Patel, MD (Board-Certified Dermatologist & Medical Director)
- Location: 4640 Admiralty Way, Suite 500, Marina del Rey, CA 90292
- Phone: (310) 822-1200
- Hours: Monday–Friday, 8:30 AM – 5:30 PM (Saturday by appointment)
- Service Categories:
  1. Medical Dermatology (#medical-dermatology): Skin cancer screenings & dermoscopy, acne protocols, rosacea & vascular care, eczema & psoriasis.
  2. Cosmetic Dermatology (#cosmetic-dermatology): Botox/Dysport neuromodulators, hyaluronic acid dermal fillers, RF microneedling.
  3. Laser & Light Therapies (#laser-treatments): Sciton Halo hybrid fractional laser, Sciton BBL HERO photofacial, Candela GentleMax Pro.
  4. Skin Rejuvenation (#skin-rejuvenation): PRP regenerative facial, HydraFacial MD.
- Site Routes: #home, #about-doctor, #about-clinic, #services, #technology, #gallery, #patient-resources, #new-patients, #faq, #location, #contact, #booking.

STRICT MEDICAL & TRUTHFULNESS RULES:
1. NEVER diagnose skin conditions, prescribe medications, recommend dosages, interpret personal symptoms/photos, or determine medical eligibility.
2. NEVER guarantee treatment outcomes, invent prices, invent appointment slot availability, or fabricate credentials/reviews.
3. If asked for something unavailable or outside verified clinic info, state clearly that it is unavailable and recommend calling (310) 822-1200 or scheduling an in-clinic evaluation (#booking).
4. For urgent or severe medical symptoms (e.g., chest pain, trouble breathing, severe bleeding, anaphylaxis), instruct the user to call 911 or seek immediate emergency care.
5. Keep responses concise, warm, medically professional, and suggest a single relevant website section route when helpful."""


def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS appointment_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reference_code TEXT UNIQUE NOT NULL,
                interest_category TEXT NOT NULL,
                treatment_name TEXT NOT NULL,
                provider_preference TEXT NOT NULL,
                preferred_date TEXT NOT NULL,
                preferred_window TEXT NOT NULL,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                notes_summary TEXT DEFAULT '',
                status TEXT NOT NULL DEFAULT 'PENDING_CLINIC_CONFIRMATION',
                external_sync TEXT NOT NULL DEFAULT 'NOT_CONFIGURED',
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS contact_inquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reference_code TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                interest TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'RECEIVED',
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS ai_audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                query_length INTEGER NOT NULL,
                safety_status TEXT NOT NULL,
                provider_mode TEXT NOT NULL,
                latency_ms INTEGER NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS admin_sessions (
                token_hash TEXT PRIMARY KEY,
                created_at INTEGER NOT NULL,
                expires_at INTEGER NOT NULL
            )
            """
        )
        conn.commit()


def check_rate_limit(client_ip, bucket, limit, window_sec=60):
    now = time.time()
    key = f"{client_ip}:{bucket}"
    with _RATE_LOCK:
        stamps = [t for t in _RATE_BUCKETS.get(key, []) if now - t < window_sec]
        if len(stamps) >= limit:
            _RATE_BUCKETS[key] = stamps
            return False
        stamps.append(now)
        _RATE_BUCKETS[key] = stamps
        return True


def is_duplicate_submission(fingerprint, ttl_sec=30):
    now = time.time()
    with _RATE_LOCK:
        # Prune expired
        expired = [k for k, ts in _RECENT_SUBMISSIONS.items() if now - ts > ttl_sec]
        for k in expired:
            del _RECENT_SUBMISSIONS[k]
        if fingerprint in _RECENT_SUBMISSIONS:
            return True
        _RECENT_SUBMISSIONS[fingerprint] = now
        return False


def hash_token(raw_token):
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def verify_admin_token(auth_header):
    if not auth_header or not auth_header.startswith("Bearer "):
        return False
    raw = auth_header[7:].strip()
    if not raw:
        return False
    now = int(time.time())
    t_hash = hash_token(raw)
    with get_db() as conn:
        row = conn.execute(
            "SELECT expires_at FROM admin_sessions WHERE token_hash = ?", (t_hash,)
        ).fetchone()
        if not row:
            return False
        if row["expires_at"] < now:
            conn.execute("DELETE FROM admin_sessions WHERE token_hash = ?", (t_hash,))
            conn.commit()
            return False
        return True


def get_config_status():
    return {
        "aiProviderConfigured": bool(
            os.environ.get("GEMINI_API_KEY") or os.environ.get("OPENAI_API_KEY")
        ),
        "geminiConfigured": bool(os.environ.get("GEMINI_API_KEY")),
        "openaiConfigured": bool(os.environ.get("OPENAI_API_KEY")),
        "calendarIntegrationConfigured": bool(
            os.environ.get("CALENDAR_API_URL") and os.environ.get("CALENDAR_API_KEY")
        ),
        "calendarWebhookConfigured": bool(os.environ.get("CALENDAR_WEBHOOK_URL")),
        "adminAuthConfigured": bool(os.environ.get("ADMIN_PASSWORD")),
        "databaseEngine": "sqlite3",
        "hipaaClaimed": False,
    }


def check_ai_safety(query_text):
    q = query_text.lower()
    if any(
        term in q
        for term in (
            "chest pain",
            "can't breathe",
            "cannot breathe",
            "bleeding severely",
            "anaphylaxis",
            "emergency",
        )
    ):
        return (
            False,
            "EMERGENCY_INTERCEPT",
            "If you are experiencing acute severe symptoms, chest pain, breathing difficulty, or uncontrolled bleeding, please call 911 or go to the nearest emergency department immediately.",
        )
    if any(
        term in q
        for term in (
            "diagnose",
            "what disease",
            "prescribe",
            "dosage",
            "is this cancer",
            "do i have melanoma",
        )
    ):
        return (
            False,
            "CLINICAL_BOUNDARY_DEFLECTED",
            "I am an informational clinic navigation assistant and cannot diagnose skin conditions, evaluate symptoms, or prescribe medications. Please schedule an in-clinic evaluation with Dr. Nita Patel (#booking) or call (310) 822-1200.",
        )
    return (True, "GUARDRAIL_CLEARED", None)


def call_gemini(query_text, history):
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash").strip()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={urllib.parse.quote(api_key)}"

    contents = []
    for item in (history or [])[-6:]:
        role = "user" if item.get("sender") == "user" else "model"
        text = str(item.get("text", ""))[:500]
        if text:
            contents.append({"role": role, "parts": [{"text": text}]})
    contents.append({"role": "user", "parts": [{"text": query_text}]})

    payload = {
        "systemInstruction": {"parts": [{"text": VERIFIED_CLINIC_SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {"temperature": 0.3, "maxOutputTokens": 400},
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        body = json.loads(resp.read().decode("utf-8"))
        candidates = body.get("candidates") or []
        if not candidates:
            raise RuntimeError("Empty response from Gemini API")
        parts = candidates[0].get("content", {}).get("parts") or []
        return "".join(p.get("text", "") for p in parts).strip()


def call_openai(query_text, history):
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini").strip()
    url = "https://api.openai.com/v1/chat/completions"

    messages = [{"role": "system", "content": VERIFIED_CLINIC_SYSTEM_PROMPT}]
    for item in (history or [])[-6:]:
        role = "user" if item.get("sender") == "user" else "assistant"
        text = str(item.get("text", ""))[:500]
        if text:
            messages.append({"role": role, "content": text})
    messages.append({"role": "user", "content": query_text})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 400,
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        body = json.loads(resp.read().decode("utf-8"))
        choices = body.get("choices") or []
        if not choices:
            raise RuntimeError("Empty response from OpenAI API")
        return choices[0].get("message", {}).get("content", "").strip()


def infer_navigation_action(text):
    low = text.lower()
    if "#booking" in low or "schedule" in low or "appointment" in low:
        return {"text": "Go to Appointment Request", "href": "#booking"}
    if "#treatment/halo-laser" in low or "halo" in low:
        return {"text": "View Halo™ Protocol", "href": "#treatment/halo-laser"}
    if "#treatment/bbl-hero" in low or "bbl" in low:
        return {"text": "View BBL® HERO™", "href": "#treatment/bbl-hero"}
    if "#medical-dermatology" in low or "skin cancer" in low or "acne" in low:
        return {"text": "Medical Dermatology", "href": "#medical-dermatology"}
    if "#cosmetic-dermatology" in low or "botox" in low or "filler" in low:
        return {"text": "Cosmetic Dermatology", "href": "#cosmetic-dermatology"}
    if "#laser-treatments" in low or "laser" in low:
        return {"text": "Laser & Light Therapies", "href": "#laser-treatments"}
    if "#skin-rejuvenation" in low or "hydrafacial" in low or "prp" in low:
        return {"text": "Skin Rejuvenation", "href": "#skin-rejuvenation"}
    if "#location" in low or "admiralty" in low or "parking" in low or "hours" in low:
        return {"text": "Location & Directions", "href": "#location"}
    if "#about-doctor" in low or "nita patel" in low:
        return {"text": "Meet Dr. Nita Patel", "href": "#about-doctor"}
    if "#faq" in low or "insurance" in low:
        return {"text": "Patient FAQs", "href": "#faq"}
    if "#services" in low:
        return {"text": "Explore Services", "href": "#services"}
    return None


class DermatologyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Privacy-aware HTTP log (method, path, status only — no query payloads)
        sys.stderr.write(
            "[%s] %s\n" % (self.log_date_time_string(), format % args)
        )

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self, max_bytes=32768):
        try:
            length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            return None, "Invalid Content-Length header"
        if length <= 0 or length > max_bytes:
            return None, "Request payload size out of bounds"
        raw = self.rfile.read(length)
        try:
            return json.loads(raw.decode("utf-8")), None
        except Exception:
            return None, "Malformed JSON payload"

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        path = url.path

        # Block sensitive server/database files from static file serving
        forbidden_prefixes = ("/data", "/.env", "/.git", "/server.py", "/generate_assets.py")
        if any(path.lower().startswith(p) for p in forbidden_prefixes):
            self.send_json(403, {"error": "Access forbidden"})
            return

        if path == "/api/health":
            cfg = get_config_status()
            self.send_json(
                200,
                {
                    "status": "UP",
                    "system": "Advance Dermatology Clinical Platform",
                    "clinic": "Dr. Nita Patel — Advance Dermatology & Laser Medical Center",
                    "location": "Marina del Rey, CA",
                    "integrations": cfg,
                },
            )
            return

        if path == "/api/booking/availability":
            params = urllib.parse.parse_qs(url.query)
            date_str = (params.get("date") or [""])[0].strip()
            cal_url = os.environ.get("CALENDAR_API_URL", "").strip()
            cal_key = os.environ.get("CALENDAR_API_KEY", "").strip()

            if cal_url and cal_key:
                try:
                    req = urllib.request.Request(
                        f"{cal_url.rstrip('/')}?date={urllib.parse.quote(date_str)}",
                        headers={"Authorization": f"Bearer {cal_key}"},
                        method="GET",
                    )
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        ext = json.loads(resp.read().decode("utf-8"))
                        self.send_json(
                            200,
                            {
                                "connected": True,
                                "mode": "LIVE_CALENDAR",
                                "date": date_str,
                                "slots": ext.get("slots", []),
                            },
                        )
                        return
                except Exception as exc:
                    self.send_json(
                        502,
                        {
                            "connected": True,
                            "mode": "PROVIDER_ERROR",
                            "error": "Unable to reach external clinic scheduling provider.",
                            "detail": str(exc)[:120],
                        },
                    )
                    return

            # No live external scheduling connected — never fabricate available slots
            self.send_json(
                200,
                {
                    "connected": False,
                    "mode": "REQUEST_WINDOW_ONLY",
                    "date": date_str,
                    "windows": [
                        "Morning Preference (8:30 AM – 12:00 PM)",
                        "Afternoon Preference (1:00 PM – 5:00 PM)",
                    ],
                    "requiredConfig": ["CALENDAR_API_URL", "CALENDAR_API_KEY"],
                    "notice": "Real-time EHR calendar sync is not connected. Select a general time preference to submit an appointment request for clinic confirmation.",
                },
            )
            return

        if path == "/api/admin/config-status":
            self.send_json(200, get_config_status())
            return

        if path == "/api/admin/overview":
            if not verify_admin_token(self.headers.get("Authorization", "")):
                self.send_json(401, {"error": "Unauthorized. Please sign in to the Clinic Portal."})
                return

            with get_db() as conn:
                appts = [
                    dict(r)
                    for r in conn.execute(
                        "SELECT * FROM appointment_requests ORDER BY id DESC LIMIT 100"
                    ).fetchall()
                ]
                inquiries = [
                    dict(r)
                    for r in conn.execute(
                        "SELECT * FROM contact_inquiries ORDER BY id DESC LIMIT 100"
                    ).fetchall()
                ]
                ai_logs = [
                    dict(r)
                    for r in conn.execute(
                        "SELECT * FROM ai_audit_logs ORDER BY id DESC LIMIT 50"
                    ).fetchall()
                ]

            self.send_json(
                200,
                {
                    "counts": {
                        "appointmentRequests": len(appts),
                        "contactInquiries": len(inquiries),
                        "aiAuditEvents": len(ai_logs),
                    },
                    "appointmentRequests": appts,
                    "contactInquiries": inquiries,
                    "aiAuditLogs": ai_logs,
                    "configStatus": get_config_status(),
                },
            )
            return

        return super().do_GET()

    def do_POST(self):
        url = urllib.parse.urlparse(self.path)
        path = url.path
        client_ip = self.client_address[0] if self.client_address else "unknown"

        if path == "/api/appointments":
            if not check_rate_limit(client_ip, "appointments", 15, 60):
                self.send_json(429, {"error": "Too many submission attempts. Please wait a minute."})
                return

            data, err = self.read_json_body()
            if err:
                self.send_json(400, {"error": err})
                return

            full_name = str(data.get("fullName", "")).strip()
            email = str(data.get("email", "")).strip()
            phone = str(data.get("phone", "")).strip()
            interest_cat = str(data.get("category", "")).strip()
            treatment_name = str(data.get("treatmentName", "")).strip()
            provider_pref = str(data.get("provider", "Dr. Nita Patel, MD")).strip()
            pref_date = str(data.get("selectedDate", "")).strip()
            pref_window = str(data.get("preferredWindow", "")).strip()
            notes_summary = str(data.get("notes", "")).strip()[:400]

            if len(full_name) < 2 or len(full_name) > 100:
                self.send_json(400, {"error": "Please enter a valid full name."})
                return
            if not EMAIL_RE.match(email) or len(email) > 120:
                self.send_json(400, {"error": "Please enter a valid email address."})
                return
            if len(re.sub(r"\D", "", phone)) < 10:
                self.send_json(400, {"error": "Please enter a valid 10-digit phone number."})
                return
            if not DATE_RE.match(pref_date):
                self.send_json(400, {"error": "Please select a valid preferred date (YYYY-MM-DD)."})
                return
            if not treatment_name or not pref_window:
                self.send_json(400, {"error": "Treatment interest and preferred time window are required."})
                return

            fp = hash_token(f"appt:{email.lower()}:{treatment_name}:{pref_date}:{pref_window}")
            if is_duplicate_submission(fp, 30):
                self.send_json(409, {"error": "Duplicate appointment request detected. Please allow 30 seconds before resubmitting."})
                return

            ref_code = "REQ-" + datetime.now(timezone.utc).strftime("%Y") + "-" + secrets.token_hex(2).upper()
            created_at = datetime.now(timezone.utc).isoformat()
            status = "PENDING_CLINIC_CONFIRMATION"
            external_sync = "NOT_CONFIGURED"

            webhook_url = os.environ.get("CALENDAR_WEBHOOK_URL", "").strip()
            if webhook_url:
                try:
                    wh_req = urllib.request.Request(
                        webhook_url,
                        data=json.dumps({
                            "referenceCode": ref_code,
                            "treatmentName": treatment_name,
                            "preferredDate": pref_date,
                            "preferredWindow": pref_window,
                            "fullName": full_name,
                            "email": email,
                            "phone": phone,
                        }).encode("utf-8"),
                        headers={"Content-Type": "application/json"},
                        method="POST",
                    )
                    with urllib.request.urlopen(wh_req, timeout=8) as wh_resp:
                        if 200 <= wh_resp.status < 300:
                            external_sync = "FORWARDED_TO_CLINIC_ADAPTER"
                except Exception:
                    external_sync = "WEBHOOK_DELIVERY_FAILED"

            with get_db() as conn:
                conn.execute(
                    """
                    INSERT INTO appointment_requests (
                        reference_code, interest_category, treatment_name,
                        provider_preference, preferred_date, preferred_window,
                        full_name, email, phone, notes_summary,
                        status, external_sync, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        ref_code, interest_cat, treatment_name, provider_pref,
                        pref_date, pref_window, full_name, email, phone,
                        notes_summary, status, external_sync, created_at,
                    ),
                )
                conn.commit()

            self.send_json(
                201,
                {
                    "success": True,
                    "request": {
                        "referenceCode": ref_code,
                        "category": interest_cat,
                        "treatmentName": treatment_name,
                        "provider": provider_pref,
                        "preferredDate": pref_date,
                        "preferredWindow": pref_window,
                        "fullName": full_name,
                        "email": email,
                        "phone": phone,
                        "status": status,
                        "externalSync": external_sync,
                        "createdAt": created_at,
                    },
                },
            )
            return

        if path == "/api/inquiries":
            if not check_rate_limit(client_ip, "inquiries", 15, 60):
                self.send_json(429, {"error": "Too many inquiry submissions. Please wait a minute."})
                return

            data, err = self.read_json_body()
            if err:
                self.send_json(400, {"error": err})
                return

            full_name = str(data.get("name", "")).strip()
            email = str(data.get("email", "")).strip()
            interest = str(data.get("interest", "")).strip()
            message = str(data.get("message", "")).strip()[:1000]

            if len(full_name) < 2 or not EMAIL_RE.match(email) or len(message) < 5:
                self.send_json(400, {"error": "Please provide a valid name, email address, and message."})
                return

            fp = hash_token(f"inq:{email.lower()}:{message[:60]}")
            if is_duplicate_submission(fp, 30):
                self.send_json(409, {"error": "Duplicate inquiry detected. Please wait a moment before sending again."})
                return

            ref_code = "INQ-" + secrets.token_hex(3).upper()
            created_at = datetime.now(timezone.utc).isoformat()
            with get_db() as conn:
                conn.execute(
                    """
                    INSERT INTO contact_inquiries (
                        reference_code, full_name, email, interest, message, status, created_at
                    ) VALUES (?, ?, ?, ?, ?, 'RECEIVED', ?)
                    """,
                    (ref_code, full_name, email, interest, message, created_at),
                )
                conn.commit()

            self.send_json(
                201,
                {
                    "success": True,
                    "referenceCode": ref_code,
                    "status": "RECEIVED",
                    "createdAt": created_at,
                },
            )
            return

        if path == "/api/ai-chat":
            if not check_rate_limit(client_ip, "ai_chat", 30, 60):
                self.send_json(429, {"error": "Rate limit exceeded. Please wait briefly before sending another message."})
                return

            data, err = self.read_json_body()
            if err:
                self.send_json(400, {"error": err})
                return

            query_text = str(data.get("query", "")).strip()
            history = data.get("history", [])
            if not query_text or len(query_text) > 600:
                self.send_json(400, {"error": "Please enter a question between 1 and 600 characters."})
                return

            t0 = time.time()
            is_safe, safety_status, safety_msg = check_ai_safety(query_text)
            if not is_safe:
                latency = int((time.time() - t0) * 1000)
                with get_db() as conn:
                    conn.execute(
                        "INSERT INTO ai_audit_logs (timestamp, query_length, safety_status, provider_mode, latency_ms) VALUES (?, ?, ?, ?, ?)",
                        (datetime.now(timezone.utc).isoformat(), len(query_text), safety_status, "SAFETY_FILTER", latency),
                    )
                    conn.commit()
                self.send_json(
                    200,
                    {
                        "configured": True,
                        "provider": "safety_guardrail",
                        "safety": safety_status,
                        "response": safety_msg,
                        "action": {"text": "Schedule Clinical Evaluation", "href": "#booking"} if safety_status != "EMERGENCY_INTERCEPT" else None,
                    },
                )
                return

            gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()
            openai_key = os.environ.get("OPENAI_API_KEY", "").strip()

            if not gemini_key and not openai_key:
                latency = int((time.time() - t0) * 1000)
                with get_db() as conn:
                    conn.execute(
                        "INSERT INTO ai_audit_logs (timestamp, query_length, safety_status, provider_mode, latency_ms) VALUES (?, ?, ?, ?, ?)",
                        (datetime.now(timezone.utc).isoformat(), len(query_text), "PROVIDER_UNCONFIGURED", "UNCONFIGURED", latency),
                    )
                    conn.commit()
                self.send_json(
                    200,
                    {
                        "configured": False,
                        "error": "AI_PROVIDER_NOT_CONFIGURED",
                        "requiredEnv": ["GEMINI_API_KEY", "OPENAI_API_KEY"],
                        "action": infer_navigation_action(query_text),
                    },
                )
                return

            try:
                if gemini_key:
                    provider_name = "gemini"
                    reply = call_gemini(query_text, history)
                else:
                    provider_name = "openai"
                    reply = call_openai(query_text, history)

                latency = int((time.time() - t0) * 1000)
                with get_db() as conn:
                    conn.execute(
                        "INSERT INTO ai_audit_logs (timestamp, query_length, safety_status, provider_mode, latency_ms) VALUES (?, ?, ?, ?, ?)",
                        (datetime.now(timezone.utc).isoformat(), len(query_text), "GUARDRAIL_CLEARED", provider_name.upper(), latency),
                    )
                    conn.commit()

                self.send_json(
                    200,
                    {
                        "configured": True,
                        "provider": provider_name,
                        "safety": "GUARDRAIL_CLEARED",
                        "response": reply,
                        "action": infer_navigation_action(reply + " " + query_text),
                    },
                )
            except urllib.error.HTTPError as exc:
                self.send_json(502, {"configured": True, "error": f"Upstream AI provider returned HTTP {exc.code}."})
            except Exception:
                self.send_json(502, {"configured": True, "error": "Unable to reach AI provider at this time."})
            return

        if path == "/api/admin/login":
            if not check_rate_limit(client_ip, "admin_login", 10, 60):
                self.send_json(429, {"error": "Too many login attempts. Please wait one minute."})
                return

            expected_pw = os.environ.get("ADMIN_PASSWORD", "")
            if not expected_pw:
                self.send_json(
                    503,
                    {
                        "error": "ADMIN_AUTH_NOT_CONFIGURED",
                        "message": "Set ADMIN_PASSWORD on the server (or in .env) to enable Clinic Portal authentication.",
                    },
                )
                return

            data, err = self.read_json_body()
            if err:
                self.send_json(400, {"error": err})
                return

            supplied = str(data.get("password", ""))
            if not hmac.compare_digest(supplied.encode("utf-8"), expected_pw.encode("utf-8")):
                self.send_json(401, {"error": "Invalid portal credentials."})
                return

            raw_token = secrets.token_urlsafe(32)
            now = int(time.time())
            expires = now + 3600 * 8  # 8 hours
            with get_db() as conn:
                conn.execute(
                    "INSERT INTO admin_sessions (token_hash, created_at, expires_at) VALUES (?, ?, ?)",
                    (hash_token(raw_token), now, expires),
                )
                conn.commit()

            self.send_json(200, {"success": True, "token": raw_token, "expiresInSeconds": 28800})
            return

        if path == "/api/admin/logout":
            auth = self.headers.get("Authorization", "")
            if auth.startswith("Bearer "):
                t_hash = hash_token(auth[7:].strip())
                with get_db() as conn:
                    conn.execute("DELETE FROM admin_sessions WHERE token_hash = ?", (t_hash,))
                    conn.commit()
            self.send_json(200, {"success": True})
            return

        self.send_json(404, {"error": "Endpoint not found"})

    def do_PATCH(self):
        url = urllib.parse.urlparse(self.path)
        if url.path == "/api/admin/appointments":
            if not verify_admin_token(self.headers.get("Authorization", "")):
                self.send_json(401, {"error": "Unauthorized"})
                return
            data, err = self.read_json_body()
            if err:
                self.send_json(400, {"error": err})
                return
            ref_code = str(data.get("referenceCode", "")).strip()
            new_status = str(data.get("status", "")).strip()
            allowed = {
                "PENDING_CLINIC_CONFIRMATION",
                "CLINIC_CONFIRMED",
                "COMPLETED",
                "CANCELLED",
            }
            if not ref_code or new_status not in allowed:
                self.send_json(400, {"error": "Valid referenceCode and allowed status required."})
                return
            with get_db() as conn:
                cur = conn.execute(
                    "UPDATE appointment_requests SET status = ? WHERE reference_code = ?",
                    (new_status, ref_code),
                )
                conn.commit()
                if cur.rowcount == 0:
                    self.send_json(404, {"error": "Appointment request not found."})
                    return
            self.send_json(200, {"success": True, "referenceCode": ref_code, "status": new_status})
            return

        self.send_json(404, {"error": "Endpoint not found"})


def run_server():
    init_db()
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(("", PORT), DermatologyRequestHandler) as httpd:
        cfg = get_config_status()
        print("=" * 70)
        print("  ADVANCE DERMATOLOGY & LASER MEDICAL CENTER")
        print("  Dr. Nita Patel, MD — Marina del Rey, California")
        print("=" * 70)
        print(f"  HTTP Server:        http://localhost:{PORT}/#home")
        print(f"  Clinic Portal:      http://localhost:{PORT}/#admin")
        print(f"  Booking Flow:       http://localhost:{PORT}/#booking")
        print(f"  Health Check:       http://localhost:{PORT}/api/health")
        print(f"  SQLite DB:          {DB_PATH}")
        print(f"  AI Configured:      {cfg['aiProviderConfigured']}")
        print(f"  Calendar Sync:      {cfg['calendarIntegrationConfigured']}")
        print(f"  Admin Auth Set:     {cfg['adminAuthConfigured']}")
        print("=" * 70)
        httpd.serve_forever()


if __name__ == "__main__":
    run_server()
