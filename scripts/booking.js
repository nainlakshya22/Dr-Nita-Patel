/**
 * ADVANCE DERMATOLOGY & LASER MEDICAL CENTER
 * APPOINTMENT REQUEST & SCHEDULING ENGINE (5-STEP FLOW)
 * Integrates with /api/booking/availability & /api/appointments
 * Dr. Nita Patel, MD — Marina del Rey, California
 */

(function () {
  'use strict';

  function getDefaultDate() {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }

  const BookingState = window.BookingState = {
    step: 1, // 1: Interest, 2: Date & Preference/Availability, 3: Contact Info, 4: Review, 5: Submitted Status
    category: 'medical',
    treatmentId: 'skin-cancer-screening',
    provider: 'Dr. Nita Patel, MD',
    selectedDate: getDefaultDate(),
    preferredWindow: 'Morning Preference (8:30 AM – 12:00 PM)',
    availabilityInfo: null,
    availabilityLoading: false,
    fullName: '',
    email: '',
    phone: '',
    notes: '',
    isSubmitting: false,
    errorMessage: '',
    submittedRequest: null
  };

  window.renderBookingWizard = function (container, prefilledTreatmentId) {
    if (!container) return;

    if (prefilledTreatmentId) {
      const matched = window.CLINIC_DATA.treatments.find(t => t.id === prefilledTreatmentId);
      if (matched) {
        BookingState.treatmentId = matched.id;
        BookingState.category = matched.dept;
      }
    }

    async function loadAvailability(dateStr) {
      BookingState.availabilityLoading = true;
      render();
      try {
        const res = await fetch(`/api/booking/availability?date=${encodeURIComponent(dateStr)}`);
        const data = await res.json();
        BookingState.availabilityInfo = data;
        if (data.connected && Array.isArray(data.slots) && data.slots.length > 0) {
          if (!data.slots.includes(BookingState.preferredWindow)) {
            BookingState.preferredWindow = data.slots[0];
          }
        } else if (Array.isArray(data.windows) && data.windows.length > 0) {
          if (!data.windows.includes(BookingState.preferredWindow)) {
            BookingState.preferredWindow = data.windows[0];
          }
        }
      } catch (err) {
        BookingState.availabilityInfo = {
          connected: false,
          mode: 'REQUEST_WINDOW_ONLY',
          windows: ['Morning Preference (8:30 AM – 12:00 PM)', 'Afternoon Preference (1:00 PM – 5:00 PM)'],
          notice: 'Could not reach availability service. Select a general time preference to submit an appointment request.'
        };
      } finally {
        BookingState.availabilityLoading = false;
        render();
      }
    }

    function render() {
      const steps = ['1. Interest', '2. Date & Preference', '3. Contact Info', '4. Review', '5. Status'];
      container.innerHTML = `
        <section class="section" style="background: var(--bg-secondary); min-height: 80vh;">
          <div class="container">
            <div class="booking-wizard-card">
              <div style="background: #F8FAFC; border-bottom: 1px solid var(--border-light); padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 0.8125rem; color: var(--navy-900);">
                <span><strong>APPOINTMENT REQUEST PORTAL:</strong> Submit a consultation request for confirmation by Dr. Patel's team.</span>
                <span class="badge badge-teal" style="white-space:nowrap; flex-shrink:0;">Marina del Rey &bull; (310) 822-1200</span>
              </div>

              <div class="booking-progress-bar">
                ${steps.map((label, idx) => {
                  const num = idx + 1;
                  const cls = BookingState.step === num ? 'active' : BookingState.step > num ? 'completed' : '';
                  return `<div class="booking-step-tab ${cls}">${label}</div>`;
                }).join('')}
              </div>

              <div class="booking-content-pane">
                <div class="booking-step-enter">
                  ${BookingState.errorMessage ? `
                    <div role="alert" style="background:#FEE2E2; border:1px solid #FCA5A5; color:#991B1B; padding:12px 16px; border-radius:var(--radius-md); margin-bottom:20px; font-size:0.875rem;">
                      ${BookingState.errorMessage}
                    </div>
                  ` : ''}
                  ${renderStepContent()}
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    function renderStepContent() {
      const data = window.CLINIC_DATA;
      const availableTreatments = data.treatments.filter(t => t.dept === BookingState.category);
      if (!availableTreatments.some(t => t.id === BookingState.treatmentId) && availableTreatments.length > 0) {
        BookingState.treatmentId = availableTreatments[0].id;
      }

      // STEP 1: APPOINTMENT INTEREST
      if (BookingState.step === 1) {
        return `
          <div>
            <h2 style="font-size: 1.75rem; margin-bottom: 8px;">Select Appointment Interest</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">Choose a clinical department and specific consultation topic.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 26px;">
              ${data.departments.map(d => `
                <button type="button" class="concern-choice-card ${BookingState.category === d.id ? 'selected' : ''}"
                     onclick="BookingState.category='${d.id}'; BookingState.errorMessage=''; window.updateBookingStep();" style="text-align: left;">
                  <strong style="font-size: 1.02rem; color: var(--navy-900); display:block;">${d.name}</strong>
                  <span style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; display:block;">${d.desc}</span>
                </button>
              `).join('')}
            </div>

            <label for="booking-treatment-select" style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 8px;">Consultation Focus</label>
            <select id="booking-treatment-select" onchange="BookingState.treatmentId=this.value;"
                    style="width: 100%; padding: 12px 14px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.95rem; margin-bottom: 28px;">
              ${availableTreatments.map(t => `<option value="${t.id}" ${t.id === BookingState.treatmentId ? 'selected' : ''}>${t.title}</option>`).join('')}
            </select>

            <div style="display: flex; justify-content: flex-end;">
              <button type="button" class="btn btn-gold btn-lg" onclick="window.goToBookingStep2();">
                Choose Date &amp; Preference &rarr;
              </button>
            </div>
          </div>
        `;
      }

      // STEP 2: DATE & REAL AVAILABILITY / PREFERENCE WINDOW
      if (BookingState.step === 2) {
        const av = BookingState.availabilityInfo;
        const isLive = av && av.connected && Array.isArray(av.slots) && av.slots.length > 0;
        const options = isLive
          ? av.slots
          : (av && Array.isArray(av.windows) ? av.windows : ['Morning Preference (8:30 AM – 12:00 PM)', 'Afternoon Preference (1:00 PM – 5:00 PM)']);

        return `
          <div>
            <h2 style="font-size: 1.75rem; margin-bottom: 8px;">Preferred Date &amp; Availability</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">Select your preferred consultation date (timezone: Pacific Time, Marina del Rey).</p>

            <div style="background: ${isLive ? '#F0FDF4' : '#FFFBEB'}; border: 1px solid ${isLive ? '#BBF7D0' : '#FCD34D'}; color: ${isLive ? '#166534' : '#92400E'}; padding: 12px 16px; border-radius: var(--radius-md); font-size: 0.82rem; margin-bottom: 20px;">
              ${BookingState.availabilityLoading
                ? 'Checking clinic scheduling adapter...'
                : (av && av.notice ? av.notice : 'Real-time EHR calendar sync is not connected. Select a general time preference to submit a request for staff confirmation.')}
            </div>

            <div style="max-width: 360px; margin-bottom: 24px;">
              <label for="booking-date-picker" style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 8px;">Preferred Date *</label>
              <input type="date" id="booking-date-picker" value="${BookingState.selectedDate}" min="${new Date().toISOString().split('T')[0]}"
                     onchange="window.onBookingDateChange(this.value);"
                     style="width: 100%; padding: 12px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.95rem;" />
            </div>

            <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 10px;">
              ${isLive ? 'Available Clinic Times (PT)' : 'Preferred Consultation Window (Subject to Clinic Confirmation)'}
            </label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 28px;">
              ${options.map(opt => `
                <button type="button" class="btn ${BookingState.preferredWindow === opt ? 'btn-primary' : 'btn-secondary'}"
                        onclick="BookingState.preferredWindow='${opt}'; window.updateBookingStep();" style="white-space: normal; padding: 12px 16px;">
                  ${opt}
                </button>
              `).join('')}
            </div>

            <div style="display: flex; justify-content: space-between;">
              <button type="button" class="btn btn-secondary" onclick="BookingState.step=1; BookingState.errorMessage=''; window.updateBookingStep();">&larr; Back</button>
              <button type="button" class="btn btn-gold btn-lg" onclick="BookingState.step=3; BookingState.errorMessage=''; window.updateBookingStep();">Contact Details &rarr;</button>
            </div>
          </div>
        `;
      }

      // STEP 3: CONTACT DETAILS (DATA MINIMIZATION)
      if (BookingState.step === 3) {
        return `
          <div>
            <h2 style="font-size: 1.75rem; margin-bottom: 8px;">Your Contact Information</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">Enter only your contact details so our Marina del Rey scheduling coordinator can confirm your visit.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-bottom: 20px;">
              <div>
                <label for="p-name" style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px;">Full Name *</label>
                <input type="text" id="p-name" required placeholder="Full Name" value="${BookingState.fullName}"
                       oninput="BookingState.fullName=this.value;"
                       style="width: 100%; padding: 12px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);" />
              </div>
              <div>
                <label for="p-email" style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px;">Email Address *</label>
                <input type="email" id="p-email" required placeholder="name@example.com" value="${BookingState.email}"
                       oninput="BookingState.email=this.value;"
                       style="width: 100%; padding: 12px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);" />
              </div>
              <div style="grid-column: 1 / -1;">
                <label for="p-phone" style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px;">Telephone Number *</label>
                <input type="tel" id="p-phone" required placeholder="(310) 555-0199" value="${BookingState.phone}"
                       oninput="BookingState.phone=this.value;"
                       style="width: 100%; padding: 12px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);" />
              </div>
              <div style="grid-column: 1 / -1;">
                <label for="p-notes" style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px;">Optional Scheduling Preference Note (Do not include sensitive medical records)</label>
                <textarea id="p-notes" rows="2" maxlength="400" placeholder="e.g., Prefer Tuesday/Thursday mornings or follow-up call preference..."
                          oninput="BookingState.notes=this.value;"
                          style="width: 100%; padding: 12px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">${BookingState.notes}</textarea>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
              <button type="button" class="btn btn-secondary" onclick="BookingState.step=2; BookingState.errorMessage=''; window.updateBookingStep();">&larr; Back</button>
              <button type="button" class="btn btn-gold btn-lg" onclick="window.validateBookingContact();">Review Request &rarr;</button>
            </div>
          </div>
        `;
      }

      // STEP 4: REVIEW REQUEST
      if (BookingState.step === 4) {
        const t = data.treatments.find(item => item.id === BookingState.treatmentId) || data.treatments[0];
        return `
          <div>
            <h2 style="font-size: 1.75rem; margin-bottom: 8px;">Review Appointment Request</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">Verify your request details below before submitting to the clinic coordinator.</p>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 22px; margin-bottom: 24px; font-size: 0.9rem;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
                <div><strong>Consultation Focus:</strong> ${t.title}</div>
                <div><strong>Physician:</strong> ${BookingState.provider}</div>
                <div><strong>Preferred Date:</strong> ${BookingState.selectedDate}</div>
                <div><strong>Preferred Window:</strong> ${BookingState.preferredWindow}</div>
                <div><strong>Patient Name:</strong> ${BookingState.fullName}</div>
                <div><strong>Email:</strong> ${BookingState.email}</div>
                <div><strong>Telephone:</strong> ${BookingState.phone}</div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between;">
              <button type="button" class="btn btn-secondary" onclick="BookingState.step=3; BookingState.errorMessage=''; window.updateBookingStep();">&larr; Edit Details</button>
              <button type="button" class="btn btn-gold btn-lg" ${BookingState.isSubmitting ? 'disabled' : ''} onclick="window.submitAppointmentRequest();">
                ${BookingState.isSubmitting ? 'Submitting Request...' : 'Submit Appointment Request &rarr;'}
              </button>
            </div>
          </div>
        `;
      }

      // STEP 5: SUBMITTED STATUS (HONEST NON-CONFIRMED REQUEST STATE UNLESS PROVIDER CONFIRMED)
      if (BookingState.step === 5) {
        const req = BookingState.submittedRequest;
        return `
          <div style="text-align: center; padding: 16px 0;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #FEF3C7; color: #92400E; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; font-size: 1.75rem;">
              &#10003;
            </div>
            <span class="badge badge-gold" style="margin-bottom: 10px;">Request Recorded &bull; Pending Clinic Confirmation</span>
            <h2 style="font-size: 2rem; margin-bottom: 12px;">Appointment Request Submitted</h2>
            <p style="color: var(--text-secondary); max-width: 580px; margin: 0 auto 24px; font-size: 0.96rem; line-height: 1.6;">
              Your request has been saved securely to our clinic queue. Your appointment is <strong>not confirmed</strong> until a coordinator from Dr. Nita Patel's office verifies availability and reaches out to you.
            </p>

            <div style="background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 24px; max-width: 560px; margin: 0 auto 28px; text-align: left;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 12px; margin-bottom: 14px;">
                <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Request Reference</span>
                <span style="font-weight: 700; font-family: monospace; font-size: 1.05rem; color: var(--navy-900);">${req.referenceCode}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem;">
                <div><strong>Status:</strong> ${req.status.replace(/_/g, ' ')}</div>
                <div><strong>Consultation:</strong> ${req.treatmentName}</div>
                <div><strong>Preferred Date &amp; Window:</strong> ${req.preferredDate} &bull; ${req.preferredWindow}</div>
                <div><strong>Clinic Telephone:</strong> (310) 822-1200</div>
              </div>
            </div>

            <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
              <button type="button" class="btn btn-gold" onclick="BookingState.step=1; BookingState.submittedRequest=null; window.updateBookingStep();">
                Submit Another Request
              </button>
              <a href="#home" class="btn btn-secondary">Return Home</a>
            </div>
          </div>
        `;
      }
    }

    window.updateBookingStep = function () {
      render();
    };

    window.goToBookingStep2 = function () {
      BookingState.step = 2;
      BookingState.errorMessage = '';
      loadAvailability(BookingState.selectedDate);
    };

    window.onBookingDateChange = function (dateVal) {
      BookingState.selectedDate = dateVal;
      loadAvailability(dateVal);
    };

    window.validateBookingContact = function () {
      const name = BookingState.fullName.trim();
      const email = BookingState.email.trim();
      const phoneDigits = BookingState.phone.replace(/\D/g, '');

      if (name.length < 2) {
        BookingState.errorMessage = 'Please enter your full name.';
        render();
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        BookingState.errorMessage = 'Please enter a valid email address.';
        render();
        return;
      }
      if (phoneDigits.length < 10) {
        BookingState.errorMessage = 'Please enter a valid 10-digit telephone number.';
        render();
        return;
      }
      BookingState.errorMessage = '';
      BookingState.step = 4;
      render();
    };

    window.submitAppointmentRequest = async function () {
      if (BookingState.isSubmitting) return;
      BookingState.isSubmitting = true;
      BookingState.errorMessage = '';
      render();

      const treatment = window.CLINIC_DATA.treatments.find(t => t.id === BookingState.treatmentId) || window.CLINIC_DATA.treatments[0];
      const dept = window.CLINIC_DATA.departments.find(d => d.id === BookingState.category);

      try {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: dept ? dept.name : BookingState.category,
            treatmentName: treatment.title,
            provider: BookingState.provider,
            selectedDate: BookingState.selectedDate,
            preferredWindow: BookingState.preferredWindow,
            fullName: BookingState.fullName.trim(),
            email: BookingState.email.trim(),
            phone: BookingState.phone.trim(),
            notes: BookingState.notes.trim()
          })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          BookingState.errorMessage = data.error || 'Unable to submit appointment request.';
        } else {
          BookingState.submittedRequest = data.request;
          BookingState.step = 5;
          window.showToast(`Request ${data.request.referenceCode} saved`, 'success');
        }
      } catch (err) {
        BookingState.errorMessage = 'Network error: Unable to reach the clinic scheduling endpoint.';
      } finally {
        BookingState.isSubmitting = false;
        render();
      }
    };

    render();
  };

})();
