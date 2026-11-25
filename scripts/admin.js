/**
 * CLINIC PORTAL & OPERATIONS CONSOLE
 * Server-Authenticated • SQLite-Backed • Integration Readiness Monitor
 * Advance Dermatology & Laser Medical Center — Dr. Nita Patel, MD
 */

(function () {
  'use strict';

  const AdminState = window.AdminState = {
    activeTab: 'overview', // 'overview', 'appointments', 'inquiries', 'ai-audit', 'integrations'
    token: sessionStorage.getItem('clinic_admin_token') || '',
    configStatus: null,
    overviewData: null,
    loading: false,
    error: ''
  };

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  window.renderAdminDashboard = function (container) {
    if (!container) return;

    async function loadConfigAndData() {
      AdminState.loading = true;
      AdminState.error = '';
      render();

      try {
        const cfgRes = await fetch('/api/admin/config-status');
        AdminState.configStatus = await cfgRes.json();

        if (AdminState.token) {
          const ovRes = await fetch('/api/admin/overview', {
            headers: { Authorization: `Bearer ${AdminState.token}` }
          });
          if (ovRes.status === 401) {
            AdminState.token = '';
            sessionStorage.removeItem('clinic_admin_token');
            AdminState.overviewData = null;
          } else if (ovRes.ok) {
            AdminState.overviewData = await ovRes.json();
          } else {
            AdminState.error = 'Unable to load clinic records.';
          }
        }
      } catch (err) {
        AdminState.error = 'Cannot connect to clinic backend server.';
      } finally {
        AdminState.loading = false;
        render();
      }
    }

    function renderLoginScreen() {
      const cfg = AdminState.configStatus;
      const authReady = cfg && cfg.adminAuthConfigured;

      container.innerHTML = `
        <section class="admin-shell" style="display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
          <div class="admin-card" style="max-width: 460px; width: 100%; padding: 36px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
              <div style="width:42px; height:42px; border-radius:8px; background:linear-gradient(135deg, var(--gold-500), var(--teal-600)); display:flex; align-items:center; justify-content:center; font-weight:bold; color:#0B1521;">AD</div>
              <div>
                <h1 style="color:#FFF; font-size:1.35rem; margin:0;">Clinic Portal Sign In</h1>
                <span style="font-size:0.78rem; color:var(--gold-400);">Advance Dermatology &bull; Protected Access</span>
              </div>
            </div>

            ${!authReady && cfg ? `
              <div style="background:rgba(245, 158, 11, 0.14); border:1px solid rgba(245, 158, 11, 0.4); border-radius:var(--radius-md); padding:14px; font-size:0.84rem; color:#FDE68A; margin-bottom:20px; line-height:1.5;">
                <strong>Server Configuration Required:</strong> Set <code>ADMIN_PASSWORD</code> in your server environment or <code>.env</code> file and restart <code>server.py</code> to enable portal sign-in.
              </div>
            ` : ''}

            ${AdminState.error ? `
              <div role="alert" style="background:rgba(239,68,68,0.16); border:1px solid #F87171; color:#FECACA; padding:10px 14px; border-radius:var(--radius-sm); font-size:0.84rem; margin-bottom:16px;">
                ${escapeHtml(AdminState.error)}
              </div>
            ` : ''}

            <form onsubmit="window.submitAdminLogin(event);">
              <label for="admin-password-input" style="display:block; font-size:0.82rem; color:#CBD5E1; margin-bottom:8px;">Administrator Password</label>
              <input type="password" id="admin-password-input" required ${!authReady && cfg ? 'disabled' : ''}
                     placeholder="Enter server ADMIN_PASSWORD"
                     style="width:100%; padding:12px 14px; border-radius:var(--radius-sm); background:#0B1521; color:#FFF; border:1px solid rgba(255,255,255,0.2); margin-bottom:18px;" />
              <button type="submit" class="btn btn-gold" style="width:100%;" ${!authReady && cfg ? 'disabled' : ''}>
                Unlock Clinic Portal
              </button>
            </form>

            <div style="margin-top:20px; text-align:center;">
              <a href="#home" style="font-size:0.82rem; color:#94A3B8; text-decoration:underline;">&larr; Return to Public Website</a>
            </div>
          </div>
        </section>
      `;
    }

    function render() {
      if (!AdminState.token) {
        renderLoginScreen();
        return;
      }

      const ov = AdminState.overviewData || {
        counts: { appointmentRequests: 0, contactInquiries: 0, aiAuditEvents: 0 },
        appointmentRequests: [],
        contactInquiries: [],
        aiAuditLogs: [],
        configStatus: AdminState.configStatus || {}
      };

      container.innerHTML = `
        <div class="admin-shell" style="display: flex; min-height: 100vh;">
          <aside class="admin-sidebar">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px; padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: linear-gradient(135deg, var(--gold-500) 0%, var(--teal-600) 100%); display: flex; align-items: center; justify-content: center; font-weight: bold; color: #0B1521;">
                AD
              </div>
              <div>
                <strong style="color: #FFF; font-size: 0.95rem; display: block;">Clinic Portal</strong>
                <span style="font-size: 0.72rem; color: var(--gold-400);">SQLite Operations</span>
              </div>
            </div>

            <nav style="display: flex; flex-direction: column; gap: 4px; flex: 1;">
              ${[
                { id: 'overview', label: 'Overview & Metrics' },
                { id: 'appointments', label: 'Appointment Requests' },
                { id: 'inquiries', label: 'Contact Inquiries' },
                { id: 'ai-audit', label: 'AI Safety & Audit Log' },
                { id: 'integrations', label: 'Integration Readiness', highlight: true }
              ].map(tab => {
                const isActive = AdminState.activeTab === tab.id;
                return `
                  <button type="button"
                          class="btn btn-sm ${isActive ? 'btn-primary' : ''}"
                          onclick="window.switchAdminTab('${tab.id}');"
                          style="justify-content: flex-start; background: ${isActive ? '#182E4B' : 'transparent'}; border: none; border-left: 3px solid ${isActive ? 'var(--gold-500)' : 'transparent'}; border-radius: 6px; color: ${tab.highlight ? 'var(--gold-400)' : '#FFF'}; text-align: left; font-weight: ${tab.highlight || isActive ? '700' : '500'}; cursor: pointer; width: 100%; padding: 10px 14px;">
                    ${tab.label}
                  </button>
                `;
              }).join('')}
            </nav>

            <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-top: auto; display:flex; flex-direction:column; gap:8px;">
              <button type="button" onclick="window.adminLogout();" class="btn btn-sm btn-secondary" style="width:100%; background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.18); color:#FFF;">
                Sign Out
              </button>
              <a href="#home" class="btn btn-sm btn-gold" style="width: 100%;">
                &larr; Public Website
              </a>
            </div>
          </aside>

          <main class="admin-main">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 28px;">
              <div>
                <h1 style="color: #FFF; font-size: 1.75rem; margin-bottom: 4px;">Advance Dermatology Operations Portal</h1>
                <span style="font-size: 0.8125rem; color: #94A3B8;">Live SQLite Records &bull; Server-Authenticated Session</span>
              </div>
              <button type="button" onclick="window.refreshAdminData();" class="btn btn-sm btn-secondary" style="background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #FFF;">
                ${AdminState.loading ? 'Refreshing...' : 'Refresh Records'}
              </button>
            </div>

            ${renderTabContent(ov)}
          </main>
        </div>
      `;
    }

    function renderTabContent(ov) {
      switch (AdminState.activeTab) {
        case 'appointments':
          return renderAppointmentsTab(ov.appointmentRequests);
        case 'inquiries':
          return renderInquiriesTab(ov.contactInquiries);
        case 'ai-audit':
          return renderAiAuditTab(ov.aiAuditLogs);
        case 'integrations':
          return renderIntegrationsTab(ov.configStatus);
        case 'overview':
        default:
          return renderOverviewTab(ov);
      }
    }

    function renderOverviewTab(ov) {
      const cfg = ov.configStatus || {};
      return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 20px; margin-bottom: 28px;">
          <div class="admin-card">
            <span style="font-size: 0.75rem; text-transform: uppercase; color: #94A3B8; font-weight: 600;">Appointment Requests</span>
            <div style="font-size: 2.2rem; font-weight: 700; color: var(--gold-400); margin: 8px 0; font-family: var(--font-serif);">${ov.counts.appointmentRequests}</div>
            <span style="color: #CBD5E1; font-size: 0.8rem;">Stored in SQLite (data/clinic.db)</span>
          </div>

          <div class="admin-card">
            <span style="font-size: 0.75rem; text-transform: uppercase; color: #94A3B8; font-weight: 600;">Contact Inquiries</span>
            <div style="font-size: 2.2rem; font-weight: 700; color: #38BDF8; margin: 8px 0; font-family: var(--font-serif);">${ov.counts.contactInquiries}</div>
            <span style="color: #CBD5E1; font-size: 0.8rem;">Front-desk inquiry queue</span>
          </div>

          <div class="admin-card">
            <span style="font-size: 0.75rem; text-transform: uppercase; color: #94A3B8; font-weight: 600;">AI Audit Events</span>
            <div style="font-size: 2.2rem; font-weight: 700; color: #10B981; margin: 8px 0; font-family: var(--font-serif);">${ov.counts.aiAuditEvents}</div>
            <span style="color: #CBD5E1; font-size: 0.8rem;">Metadata-only safety logs</span>
          </div>

          <div class="admin-card">
            <span style="font-size: 0.75rem; text-transform: uppercase; color: #94A3B8; font-weight: 600;">External Integrations</span>
            <div style="font-size: 1.15rem; font-weight: 700; color: ${cfg.aiProviderConfigured ? '#10B981' : '#FCD34D'}; margin: 12px 0;">
              AI: ${cfg.aiProviderConfigured ? 'Configured' : 'Awaiting API Key'}
            </div>
            <span style="color: #CBD5E1; font-size: 0.8rem;">EHR Calendar: ${cfg.calendarIntegrationConfigured ? 'Connected' : 'Request Mode'}</span>
          </div>
        </div>

        <div class="admin-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="color:#FFF; font-size:1.15rem;">Latest Appointment Requests</h3>
            <button type="button" class="btn btn-sm btn-secondary" onclick="window.switchAdminTab('appointments');" style="color:#FFF; background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2);">View All</button>
          </div>
          ${ov.appointmentRequests.length === 0
            ? '<p style="color:#94A3B8; font-size:0.9rem;">No appointment requests submitted yet. Test submitting a request on the Booking page.</p>'
            : `<table class="admin-table">
                <thead><tr><th>Ref</th><th>Patient</th><th>Treatment</th><th>Preferred Window</th><th>Status</th></tr></thead>
                <tbody>
                  ${ov.appointmentRequests.slice(0, 5).map(r => `
                    <tr>
                      <td><strong style="color:var(--gold-400); font-family:monospace;">${escapeHtml(r.reference_code)}</strong></td>
                      <td>${escapeHtml(r.full_name)}</td>
                      <td>${escapeHtml(r.treatment_name)}</td>
                      <td>${escapeHtml(r.preferred_date)} &bull; ${escapeHtml(r.preferred_window)}</td>
                      <td><span class="status-badge status-PENDING_VERIFICATION">${escapeHtml(r.status.replace(/_/g, ' '))}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>`}
        </div>
      `;
    }

    function renderAppointmentsTab(list) {
      return `
        <div class="admin-card">
          <h2 style="color: #FFF; font-size: 1.35rem; margin-bottom: 6px;">Appointment Requests (SQLite)</h2>
          <p style="color: #94A3B8; font-size: 0.85rem; margin-bottom: 20px;">Manage incoming patient consultation requests.</p>
          ${list.length === 0
            ? '<p style="color:#94A3B8;">No appointment requests recorded yet.</p>'
            : `<table class="admin-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Contact</th>
                    <th>Treatment</th>
                    <th>Date &amp; Window</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.map(r => `
                    <tr>
                      <td><strong style="color:var(--gold-400); font-family:monospace;">${escapeHtml(r.reference_code)}</strong></td>
                      <td>
                        <strong>${escapeHtml(r.full_name)}</strong><br />
                        <span style="font-size:0.75rem; color:#94A3B8;">${escapeHtml(r.email)} &bull; ${escapeHtml(r.phone)}</span>
                      </td>
                      <td>${escapeHtml(r.treatment_name)}</td>
                      <td>${escapeHtml(r.preferred_date)}<br /><span style="font-size:0.78rem; color:var(--teal-500);">${escapeHtml(r.preferred_window)}</span></td>
                      <td><span class="status-badge status-${r.status === 'CLINIC_CONFIRMED' || r.status === 'COMPLETED' ? 'VERIFIED' : 'PENDING_VERIFICATION'}">${escapeHtml(r.status.replace(/_/g, ' '))}</span></td>
                      <td>
                        <select onchange="window.updateAppointmentStatus('${escapeHtml(r.reference_code)}', this.value)"
                                style="background:#0B1521; color:#FFF; border:1px solid rgba(255,255,255,0.2); border-radius:4px; padding:4px 8px; font-size:0.76rem;">
                          ${['PENDING_CLINIC_CONFIRMATION', 'CLINIC_CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => `<option value="${s}" ${r.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                        </select>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>`}
        </div>
      `;
    }

    function renderInquiriesTab(list) {
      return `
        <div class="admin-card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
            <div>
              <h2 style="color: #FFF; font-size: 1.35rem; margin-bottom: 4px;">Contact Inquiries (SQLite)</h2>
              <p style="color: #94A3B8; font-size: 0.85rem;">Messages submitted through the clinic contact form.</p>
            </div>
            <button type="button" onclick="window.exportInquiriesCsv();" class="btn btn-sm btn-secondary" style="color:#FFF; background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2);">Export CSV</button>
          </div>
          ${list.length === 0
            ? '<p style="color:#94A3B8;">No contact inquiries submitted yet.</p>'
            : `<table class="admin-table">
                <thead><tr><th>Reference</th><th>Contact</th><th>Interest</th><th>Message</th><th>Received</th></tr></thead>
                <tbody>
                  ${list.map(i => `
                    <tr>
                      <td><strong style="color:#38BDF8; font-family:monospace;">${escapeHtml(i.reference_code)}</strong></td>
                      <td><strong>${escapeHtml(i.full_name)}</strong><br /><span style="font-size:0.75rem; color:#94A3B8;">${escapeHtml(i.email)}</span></td>
                      <td>${escapeHtml(i.interest)}</td>
                      <td style="max-width:280px; font-size:0.82rem; color:#CBD5E1;">${escapeHtml(i.message)}</td>
                      <td style="font-size:0.75rem; color:#94A3B8;">${escapeHtml(i.created_at.slice(0, 16))}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>`}
        </div>
      `;
    }

    function renderAiAuditTab(logs) {
      return `
        <div class="admin-card">
          <h2 style="color: #FFF; font-size: 1.35rem; margin-bottom: 6px;">Privacy-Aware AI Safety &amp; Audit Metadata</h2>
          <p style="color: #94A3B8; font-size: 0.85rem; margin-bottom: 20px;">Logs guardrail status, latency, and provider mode without persisting private patient query text.</p>
          ${logs.length === 0
            ? '<p style="color:#94A3B8;">No AI events logged yet.</p>'
            : `<table class="admin-table">
                <thead><tr><th>Timestamp (UTC)</th><th>Query Length</th><th>Safety Status</th><th>Provider Mode</th><th>Latency</th></tr></thead>
                <tbody>
                  ${logs.map(l => `
                    <tr>
                      <td style="font-size:0.78rem; color:#94A3B8;">${escapeHtml(l.timestamp.slice(0, 19))}</td>
                      <td>${l.query_length} chars</td>
                      <td><span class="status-badge status-VERIFIED">${escapeHtml(l.safety_status)}</span></td>
                      <td>${escapeHtml(l.provider_mode)}</td>
                      <td>${l.latency_ms} ms</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>`}
        </div>
      `;
    }

    function renderIntegrationsTab(cfg) {
      const rows = [
        { name: 'SQLite Persistent Database (data/clinic.db)', ok: true, req: 'Built-in active' },
        { name: 'Clinic Portal Password Auth (ADMIN_PASSWORD)', ok: !!cfg.adminAuthConfigured, req: 'Set ADMIN_PASSWORD env var' },
        { name: 'Live AI Concierge (GEMINI_API_KEY / OPENAI_API_KEY)', ok: !!cfg.aiProviderConfigured, req: 'Set GEMINI_API_KEY or OPENAI_API_KEY on server' },
        { name: 'Live EHR Calendar Availability (CALENDAR_API_URL + KEY)', ok: !!cfg.calendarIntegrationConfigured, req: 'Set CALENDAR_API_URL & CALENDAR_API_KEY' },
        { name: 'Scheduling Webhook Sync (CALENDAR_WEBHOOK_URL)', ok: !!cfg.calendarWebhookConfigured, req: 'Optional webhook endpoint for front-desk alerts' },
        { name: 'Production HIPAA Compliance & BAA Verification', ok: false, req: 'Requires TLS/HTTPS proxy, signed BAA with cloud/AI/EHR vendors, and operational audit' }
      ];

      return `
        <div class="admin-card">
          <h2 style="color: #FFF; font-size: 1.35rem; margin-bottom: 6px;">System &amp; Third-Party Integration Readiness</h2>
          <p style="color: #94A3B8; font-size: 0.85rem; margin-bottom: 20px;">Exact configuration state reported directly by <code>server.py</code>.</p>
          <table class="admin-table">
            <thead><tr><th>Subsystem</th><th>Status</th><th>Configuration Requirement</th></tr></thead>
            <tbody>
              ${rows.map(r => `
                <tr>
                  <td><strong>${r.name}</strong></td>
                  <td><span class="status-badge ${r.ok ? 'status-VERIFIED' : 'status-PENDING_VERIFICATION'}">${r.ok ? 'CONFIGURED' : 'NOT CONFIGURED'}</span></td>
                  <td style="font-size:0.82rem; color:#CBD5E1;">${r.req}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    window.switchAdminTab = function (tabId) {
      AdminState.activeTab = tabId;
      render();
    };

    window.refreshAdminData = loadConfigAndData;

    window.submitAdminLogin = async function (e) {
      e.preventDefault();
      const input = document.getElementById('admin-password-input');
      const pw = input ? input.value : '';
      AdminState.error = '';

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pw })
        });
        const data = await res.json();
        if (!res.ok || !data.token) {
          AdminState.error = data.message || data.error || 'Login failed.';
          render();
          return;
        }
        AdminState.token = data.token;
        sessionStorage.setItem('clinic_admin_token', data.token);
        await loadConfigAndData();
      } catch (err) {
        AdminState.error = 'Unable to reach authentication endpoint.';
        render();
      }
    };

    window.adminLogout = async function () {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${AdminState.token}` }
        });
      } catch (e) {}
      AdminState.token = '';
      AdminState.overviewData = null;
      sessionStorage.removeItem('clinic_admin_token');
      render();
    };

    window.updateAppointmentStatus = async function (referenceCode, newStatus) {
      try {
        const res = await fetch('/api/admin/appointments', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AdminState.token}`
          },
          body: JSON.stringify({ referenceCode, status: newStatus })
        });
        if (res.ok) {
          window.showToast(`Updated ${referenceCode} to ${newStatus}`, 'success');
          await loadConfigAndData();
        } else {
          window.showToast('Status update failed', 'warning');
        }
      } catch (e) {
        window.showToast('Network error updating status', 'warning');
      }
    };

    window.exportInquiriesCsv = function () {
      const list = (AdminState.overviewData && AdminState.overviewData.contactInquiries) || [];
      let csv = 'Reference,Name,Email,Interest,Message,Created\n';
      list.forEach(i => {
        csv += `"${i.reference_code}","${(i.full_name || '').replace(/"/g, '""')}","${i.email}","${i.interest}","${(i.message || '').replace(/"/g, '""')}","${i.created_at}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'clinic_inquiries.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    loadConfigAndData();
  };

})();
