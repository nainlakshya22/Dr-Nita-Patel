/**
 * ADVANCE DERMATOLOGY & LASER MEDICAL CENTER
 * MASTER CLIENT APPLICATION & ROUTING ENGINE
 * Dr. Nita Patel, MD — Board-Certified Dermatologist
 * Marina del Rey, California
 */

(function () {
  'use strict';

  // State Management
  const AppState = {
    currentPage: 'home',
    currentTreatmentId: null,
    mobileMenuOpen: false,
    selectedCategoryFilter: 'all',
    activeFaqFilter: 'all'
  };

  // DOM Elements
  const DOM = {
    mainContent: document.getElementById('app-main'),
    mobileDrawer: document.getElementById('mobile-drawer'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    closeMobileBtn: document.getElementById('close-mobile-btn'),
    navLinks: document.querySelectorAll('.nav-link, .dropdown-link'),
    toastContainer: document.getElementById('toast-container')
  };

  // Toast Notification System
  window.showToast = function (message, type = 'info') {
    if (!DOM.toastContainer) {
      const tc = document.createElement('div');
      tc.id = 'toast-container';
      tc.style.cssText = 'position:fixed;top:24px;right:24px;z-index:10000;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
      document.body.appendChild(tc);
      DOM.toastContainer = tc;
    }

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;
    toast.style.cssText = `
      background: ${type === 'success' ? '#0F766E' : type === 'warning' ? '#B45309' : '#0F2038'};
      color: #FFF;
      padding: 14px 20px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      border-left: 4px solid ${type === 'success' ? '#14B8A6' : '#C5A880'};
      pointer-events: auto;
      transform: translateX(50px);
      opacity: 0;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 380px;
    `;

    toast.innerHTML = `<span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  // Client Router
  function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const parts = hash.split('/');
    const page = parts[0];
    const param = parts[1];

    AppState.currentPage = page;
    AppState.currentTreatmentId = param || null;

    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === `#${page}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile drawer if open
    closeMobileDrawer();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render corresponding view
    renderPage(page, param);
  }

  function renderPage(page, param) {
    if (!DOM.mainContent) return;

    // Clean up previous route WebGL renderers and ScrollTriggers before re-rendering
    if (window.disposeSkin3DExperience) window.disposeSkin3DExperience();
    if (window.disposeVisualUpgrades) window.disposeVisualUpgrades();

    if (page === 'admin') {
      if (window.renderAdminDashboard) {
        window.renderAdminDashboard(DOM.mainContent);
      }
      return;
    }

    switch (page) {
      case 'home':
        renderHome();
        break;
      case 'about-doctor':
        renderAboutDoctor();
        break;
      case 'about-clinic':
        renderAboutClinic();
        break;
      case 'services':
        renderServicesOverview();
        break;
      case 'medical-dermatology':
        renderDepartmentPage('medical');
        break;
      case 'cosmetic-dermatology':
        renderDepartmentPage('cosmetic');
        break;
      case 'laser-treatments':
        renderDepartmentPage('lasers');
        break;
      case 'skin-rejuvenation':
        renderDepartmentPage('rejuvenation');
        break;
      case 'treatment':
        renderTreatmentDetail(param);
        break;
      case 'technology':
        renderTechnology();
        break;
      case 'patient-resources':
        renderPatientResources();
        break;
      case 'new-patients':
        renderNewPatients();
        break;
      case 'faq':
        renderFaqPage();
        break;
      case 'gallery':
        renderGalleryPage();
        break;
      case 'reviews':
        renderReviewsPage();
        break;
      case 'contact':
        renderContactPage();
        break;
      case 'location':
        renderLocationPage();
        break;
      case 'booking':
        if (window.renderBookingWizard) {
          window.renderBookingWizard(DOM.mainContent, param);
        }
        break;
      case 'privacy':
        renderPrivacyPage();
        break;
      case 'terms':
        renderTermsPage();
        break;
      case 'accessibility':
        renderAccessibilityPage();
        break;
      case 'clinical-standards':
      case 'concept-info':
        renderConceptInfoPage();
        break;
      default:
        renderHome();
        break;
    }

    // Re-apply 3D tilt, magnetic buttons, and GSAP reveals on every route switch
    if (window.applyVisualUpgrades) {
      setTimeout(() => window.applyVisualUpgrades(), 80);
    }
  }

  // Helper: Hero component for subpages
  function subpageHero(title, subtitle, categoryBadge = "Dr. Nita Patel • Marina del Rey") {
    return `
      <section class="section" style="background: linear-gradient(135deg, #0B1521 0%, #152E4B 100%); color: #FFF; padding: 60px 0 70px; border-bottom: 1px solid rgba(197,168,128,0.25);">
        <div class="container">
          <div style="max-width: 800px;">
            <div class="badge badge-gold" style="margin-bottom: 14px;">${categoryBadge}</div>
            <h1 style="color: #FFF; font-size: 2.75rem; margin-bottom: 16px;">${title}</h1>
            <p style="color: #CBD5E1; font-size: 1.125rem; line-height: 1.6;">${subtitle}</p>
          </div>
        </div>
      </section>
    `;
  }

  // 1. HOME PAGE
  function renderHome() {
    const data = window.CLINIC_DATA;
    DOM.mainContent.innerHTML = `
      <!-- Hero Section with 3D Cellular Mesh -->
      <section class="hero-section" style="position: relative; overflow: hidden;">
        <div id="hero-3d-canvas-container" style="position: absolute; inset: 0; pointer-events: none; z-index: 1;"></div>
        <div class="hero-bg-overlay" style="z-index: 0;"></div>
        <div class="container hero-grid" style="position: relative; z-index: 2;">
          <div class="hero-content">
            <div class="badge badge-gold">Board-Certified Dermatology • Marina del Rey, CA</div>
            <h1>Excellence in <span class="gold-gradient">Medical & Aesthetic</span> Dermatology</h1>
            <p class="hero-desc">
              Led by Dr. Nita Patel, Advance Dermatology & Laser Medical Center combines rigorous clinical acumen with state-of-the-art hybrid laser science in a serene, patient-first coastal sanctuary.
            </p>
            <div class="hero-actions">
              <a href="#booking" class="btn btn-gold btn-lg">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Book Consultation
              </a>
              <a href="#services" class="btn btn-secondary btn-lg" style="color: #fff; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2);">
                Explore Clinical Services
              </a>
              <button onclick="window.launchNitaAssistant('How do I book a consultation?')" class="btn btn-teal btn-lg">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Ask NITA AI
              </button>
            </div>
            <div class="hero-trust-row">
              <div class="trust-item">
                <span class="trust-number">20+</span>
                <span class="trust-label">Years Clinical Rigor</span>
              </div>
              <div class="trust-item">
                <span class="trust-number">100%</span>
                <span class="trust-label">Physician-Led Care</span>
              </div>
              <div class="trust-item">
                <span class="trust-number">Gold-Std</span>
                <span class="trust-label">Laser Platforms</span>
              </div>
            </div>
          </div>

          <div class="hero-visual-frame">
            <div class="hero-visual-card">
              <img src="assets/doctor-concept.jpg" alt="Abstract Translucent Cellular Skin Science Visual" />
              <div class="hero-glass-hud">
                <span class="hero-hud-dot"></span>
                <div>
                  <strong style="display:block; font-size:0.75rem; color:#FFF;">Marina del Rey Sanctuary</strong>
                  <span style="font-size:0.68rem; color:var(--gold-300);">Medical &amp; Laser Dermatology</span>
                </div>
              </div>
              <div class="hero-floating-badge">
                <div>
                  <strong style="display:block; font-size: 0.95rem;">Dr. Nita Patel, MD</strong>
                  <span style="font-size: 0.78rem; color: #CBD5E1;">Medical Director &bull; Dermatologist</span>
                </div>
                <span class="badge badge-demo">Illustrative Visual</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Bar -->
      <section style="background: #FFF; border-bottom: 1px solid var(--border-light); padding: 24px 0;">
        <div class="container" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px;">
          <div style="display:flex; align-items:center; gap: 12px;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--gold-100); display:flex; align-items:center; justify-content:center; color:var(--gold-700);">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <strong style="font-size:0.875rem; display:block;">Board-Certified Expertise</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Specialized dermatology diagnostics</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap: 12px;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--teal-50); display:flex; align-items:center; justify-content:center; color:var(--teal-700);">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <div>
              <strong style="font-size:0.875rem; display:block;">Sciton® & Candela® Tech</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Halo™, BBL HERO™, GentleMax Pro</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap: 12px;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--navy-50); display:flex; align-items:center; justify-content:center; color:var(--navy-900);">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div>
              <strong style="font-size:0.875rem; display:block;">Marina del Rey Sanctuary</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Calm, private coastal suites</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap: 12px;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--gold-100); display:flex; align-items:center; justify-content:center; color:var(--gold-700);">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <strong style="font-size:0.875rem; display:block;">Sample Credential Display</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Illustrative concept preview</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Clinic & Doctor Introduction -->
      <section class="section doctor-cinematic-section" style="background: var(--bg-secondary);">
        <div class="container">
          <div class="split-grid">
            <div>
              <div class="badge badge-teal" style="margin-bottom: 12px;">Physician Leadership</div>
              <h2 style="font-size: 2.25rem; margin-bottom: 20px;">Compassionate Medical Dermatology Balanced with Natural Aesthetic Harmony</h2>
              <p class="doctor-bio-para" style="color: var(--text-secondary); margin-bottom: 16px; font-size: 1.05rem; line-height: 1.7;">
                At Advance Dermatology & Laser Medical Center, Dr. Nita Patel approaches every patient through an integrated clinical lens. Whether conducting an early melanoma dermoscopy or administering high-precision laser resurfacing, patient safety, dignity, and natural anatomical proportions remain paramount.
              </p>
              <p class="doctor-bio-para" style="color: var(--text-secondary); margin-bottom: 28px; line-height: 1.7;">
                We reject overdone, artificial aesthetics in favor of cellular restoration. Our Marina del Rey practice is equipped with gold-standard technologies to treat medical conditions from acne and eczema to complex sun damage and skin laxity.
              </p>
              <div class="doctor-cta-row" style="display: flex; gap: 16px; flex-wrap: wrap;">
                <a href="#about-doctor" class="btn btn-primary">Learn About Dr. Patel</a>
                <a href="#about-clinic" class="btn btn-secondary">Explore Clinic Facilities</a>
              </div>
            </div>
            <div class="parallax-media morph-mask-frame" style="position: relative; overflow: hidden; box-shadow: var(--shadow-xl); border: 1px solid var(--border-light);">
              <img src="assets/clinic-reception.jpg" alt="Illustrative Modern Dermatology Clinic Interior" style="width: 100%; height: 420px; object-fit: cover; display: block;" />
              <div style="position: absolute; bottom: 20px; right: 20px;" class="badge badge-demo">
                Illustrative Clinic Visual
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Visual Treatment Explorer (Interactive Split-Screen Architecture) -->
      <section class="section" id="treatment-explorer-section">
        <div class="container">
          <div class="section-header">
            <div class="badge badge-gold">Visual Treatment Explorer</div>
            <h2>Explore Care by Clinical Discipline</h2>
            <p>Select a dermatological discipline to explore verified clinic protocols, consultation workflows, and direct educational pathways.</p>
          </div>

          <div class="explorer-shell">
            <div class="explorer-sidebar" role="tablist" aria-label="Dermatology Categories">
              ${data.departments.map((dept, idx) => `
                <button type="button" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}"
                        class="explorer-tab ${idx === 0 ? 'active' : ''}" data-dept="${dept.id}"
                        onclick="window.selectExplorerCategory('${dept.id}')">
                  <div class="explorer-tab-icon">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      ${dept.icon === 'shield-alert' ? '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>' : ''}
                      ${dept.icon === 'sparkles' ? '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>' : ''}
                      ${dept.icon === 'zap' ? '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>' : ''}
                      ${dept.icon === 'droplets' ? '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>' : ''}
                    </svg>
                  </div>
                  <div>
                    <span style="font-size:0.68rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--gold-500); font-weight:700; display:block; margin-bottom:2px;">${dept.badge}</span>
                    <h3 style="font-size:1.1rem; margin-bottom:4px;">${dept.name}</h3>
                    <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.45; margin:0;">${dept.desc}</p>
                  </div>
                </button>
              `).join('')}
            </div>

            <div class="explorer-stage" id="home-explorer-stage" role="tabpanel">
              <!-- Populated dynamically by window.selectExplorerCategory -->
            </div>
          </div>
        </div>
      </section>

      <!-- Morphing Organic Wave Transition into 3D Skin World -->
      <div class="morph-divider" style="background: var(--bg-primary); margin-bottom: -1px;" aria-hidden="true">
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path d="M0,24 C320,52 680,0 1080,26 C1260,38 1380,24 1440,16 L1440,48 L0,48 Z" fill="#0B1521"></path>
        </svg>
      </div>

      <!-- Interactive 3D Skin Science Experience (Three.js WebGL) -->
      <section class="section" id="skin-3d-section" style="background: linear-gradient(180deg, #0B1521 0%, #102136 100%); color: #FFF; position: relative; overflow: hidden; border-top: 1px solid rgba(197,168,128,0.25); border-bottom: 1px solid rgba(197,168,128,0.25);">
        <div class="container">
          <div class="section-header">
            <div class="badge badge-gold">Interactive 3D Dermatological Science</div>
            <h2 style="color: #FFF; font-size: 2.35rem; margin-top: 14px;">Explore Cellular Skin Layers in 3D</h2>
            <p style="color: #CBD5E1;">Drag to rotate, scroll or tap to zoom, and click directly on any anatomical layer to inspect tissue architecture and calibrated laser depths.</p>
            
            <!-- Layer Control Buttons -->
            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 24px; flex-wrap: wrap;">
              <button type="button" class="btn btn-sm skin-layer-btn active" data-layer="all" onclick="window.select3DSkinLayer('all')">
                Complete Model
              </button>
              <button type="button" class="btn btn-sm skin-layer-btn" data-layer="epidermis" onclick="window.select3DSkinLayer('epidermis')">
                01. Epidermis
              </button>
              <button type="button" class="btn btn-sm skin-layer-btn" data-layer="dermis" onclick="window.select3DSkinLayer('dermis')">
                02. Dermis
              </button>
              <button type="button" class="btn btn-sm skin-layer-btn" data-layer="hypodermis" onclick="window.select3DSkinLayer('hypodermis')">
                03. Hypodermis
              </button>
            </div>
          </div>

          <div class="split-grid-asym">
            <!-- 3D Canvas Box -->
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(197,168,128,0.3); border-radius: var(--radius-xl); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); position: relative;">
              <div class="skin-3d-controls-bar" aria-label="3D Camera Controls">
                <button type="button" class="skin-3d-ctrl-btn" onclick="window.zoomSkin3D(-0.55)" title="Zoom In" aria-label="Zoom In">+ Zoom</button>
                <button type="button" class="skin-3d-ctrl-btn" onclick="window.zoomSkin3D(0.55)" title="Zoom Out" aria-label="Zoom Out">&minus;</button>
                <button type="button" class="skin-3d-ctrl-btn" onclick="window.resetSkin3DView()" title="Reset 3D View" aria-label="Reset View">&#8634; Reset</button>
              </div>
              <div id="skin-3d-canvas-container" style="width: 100%; height: 460px; cursor: grab;"></div>
              <div style="position: absolute; bottom: 16px; left: 20px; font-size: 0.75rem; color: #94A3B8; pointer-events: none; display: flex; align-items: center; gap: 6px;">
                Drag to rotate &bull; Click layer to focus &bull; Scroll to zoom
              </div>
              <div style="position: absolute; top: 16px; right: 20px; pointer-events: none;">
                <span class="badge badge-demo" style="font-size: 0.68rem;">Interactive 3D Bio-Model</span>
              </div>
            </div>

            <!-- Dynamic Info Card -->
            <div style="background: #142842; border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-xl); padding: 32px; box-shadow: var(--shadow-xl);" id="skin-3d-info-card">
              <!-- Populated dynamically by window.select3DSkinLayer -->
            </div>
          </div>

          <!-- Educational Non-Diagnostic Notice -->
          <div style="text-align: center; margin-top: 28px;">
            <span style="font-size: 0.78rem; color: #94A3B8; font-style: italic;">
              Educational Notice: This 3D anatomical visualization demonstrates cellular skin layers for patient learning and laser depth understanding. It is non-diagnostic. Clinical parameters are determined during physical examination.
            </span>
          </div>
        </div>
      </section>

      <!-- Embedded AI Skin Concern Navigator Teaser -->
      <section class="section" style="background: linear-gradient(135deg, #0B1521 0%, #17324F 100%); color: #FFF;">
        <div class="container" style="text-align: center;">
          <div class="badge badge-demo" style="margin-bottom: 14px;">Interactive Diagnostic Education</div>
          <h2 style="color: #FFF; font-size: 2.375rem; margin-bottom: 16px;">AI Skin Concern Navigator</h2>
          <p style="color: #CBD5E1; max-width: 680px; margin: 0 auto 36px; font-size: 1.0625rem;">
            Explore customized clinical pathways for sun damage, active breakouts, redness, or textural aging. Receive educational guidance prior to your physician consultation.
          </p>
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(197,168,128,0.3); border-radius: var(--radius-xl); padding: 36px; max-width: 900px; margin: 0 auto; text-align: left;">
            <div id="home-skin-navigator-container"></div>
          </div>
        </div>
      </section>

      <!-- Interactive Before and After Comparison -->
      <section class="section" style="background: var(--bg-secondary);">
        <div class="container">
          <div class="section-header">
            <div class="badge badge-demo">Illustrative Preview Gallery</div>
            <h2>Cellular Texture & Tone Restoration Visualization</h2>
            <p>Experience our interactive comparison interface demonstrating illustrative epidermal tone refinement following hybrid fractional photothermolysis.</p>
          </div>

          <div class="ba-container" id="ba-home-slider">
            <img src="assets/before-texture.jpg" class="ba-image" alt="Illustrative Baseline Texture Visualization" />
            <div class="ba-after-wrapper" id="ba-home-after">
              <img src="assets/after-texture.jpg" class="ba-image" alt="Illustrative Post-Treatment Texture Visualization" />
            </div>
            <button type="button" class="ba-fullscreen-btn" onclick="window.openBAFullscreen('assets/before-texture.jpg', 'assets/after-texture.jpg', 'Cellular Texture &amp; Tone Concept Visualization')" aria-label="Open fullscreen comparison view">
              &#x26F6; Fullscreen
            </button>
            <div class="ba-handle" id="ba-home-handle" tabindex="0" role="slider" aria-label="Before and after comparison slider. Use left and right arrow keys to adjust." aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <span class="ba-badge ba-badge-before">Illustrative Baseline</span>
            <span class="ba-badge ba-badge-after">Illustrative Post-Care Concept</span>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <span style="font-size: 0.8125rem; color: var(--text-muted); font-style: italic;">
              Demonstration Visualizer: Illustrative graphic simulation. Does not represent actual patient outcomes or clinical guarantees. Real patient photos require signed consent and verification.
            </span>
          </div>
        </div>
      </section>

      <!-- Technology Suite Showcase with Interactive Callout Points -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <div class="badge badge-teal">Clinical Equipment</div>
            <h2>Gold-Standard Medical Laser Systems</h2>
            <p>Precision-calibrated wavelengths tailored to your Fitzpatrick skin type and aesthetic objectives. Select any callout point to inspect device capabilities.</p>
          </div>

          <div class="split-grid">
            <div class="tech-showcase-stage parallax-media">
              <div style="position: relative;">
                <img src="assets/laser-suite.jpg" alt="Illustrative Laser Treatment Suite" style="height: 360px; object-fit: cover;" />
                <button type="button" class="tech-hotspot active" data-hotspot="halo" onclick="window.selectTechHotspot('halo')" style="top: 34%; left: 56%;" aria-label="Inspect Hybrid Laser Arm">1</button>
                <button type="button" class="tech-hotspot" data-hotspot="bbl" onclick="window.selectTechHotspot('bbl')" style="top: 52%; left: 72%;" aria-label="Inspect BBL Broadband Phototherapy">2</button>
                <button type="button" class="tech-hotspot" data-hotspot="cooling" onclick="window.selectTechHotspot('cooling')" style="top: 64%; left: 32%;" aria-label="Inspect Integrated Cryogenic Comfort">3</button>
                <span class="badge badge-demo" style="position: absolute; top: 14px; left: 14px; font-size: 0.68rem;">Illustrative Suite Visual</span>
              </div>
              <div class="tech-callout-box" id="home-tech-callout">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;">
                  <strong style="color:var(--gold-400); font-size:0.95rem;">1. Sciton Halo™ Hybrid Optical Arm (1470nm / 2940nm)</strong>
                  <a href="#treatment/halo-laser" style="color:#FFF; font-size:0.78rem; text-decoration:underline;">View Protocol &rarr;</a>
                </div>
                <p style="color:#CBD5E1; font-size:0.82rem; line-height:1.5;">Synchronizes non-ablative dermal coagulation with targeted epidermal resurfacing for calibrated recovery.</p>
              </div>
            </div>
            <div>
              <h3 style="font-size: 1.75rem; margin-bottom: 16px;">Sciton Halo™ &amp; BBL® HERO™</h3>
              <p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.7;">
                Our laser treatment suite features Sciton's hybrid technology alongside Candela GentleMax Pro, allowing Dr. Patel to address pigment, vascular redness, fine lines, and textural laxity across diverse skin tones.
              </p>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                <li style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem;">
                  <span style="color: var(--teal-600);">&check;</span> Dual-wavelength customizable clinical recovery
                </li>
                <li style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem;">
                  <span style="color: var(--teal-600);">&check;</span> Candela GentleMax Pro for Fitzpatrick types I&ndash;VI
                </li>
                <li style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem;">
                  <span style="color: var(--teal-600);">&check;</span> Integrated optical &amp; sapphire chill-tip thermal safety
                </li>
              </ul>
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="#technology" class="btn btn-secondary cta-arrow-animated">Explore Technology Specifications <span>&rarr;</span></a>
                <a href="#treatment/halo-laser" class="btn btn-gold">Halo™ Details</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive 5-Step Patient Journey -->
      <section class="section" style="background: var(--bg-secondary);">
        <div class="container journey-container">
          <div class="section-header">
            <div class="badge badge-gold">Patient Experience</div>
            <h2>Your Journey at Advance Dermatology</h2>
            <p>A structured, unhurried, physician-centered pathway from discovery to ongoing skin health. Select any milestone below to explore what to expect.</p>
          </div>

          <div class="journey-track-line" aria-hidden="true">
            <div class="journey-track-progress" id="journey-progress-bar"></div>
          </div>

          <div class="journey-grid">
            ${[
              { num: '01', title: 'Explore', icon: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>', desc: 'Review medical & aesthetic protocols at your own pace.' },
              { num: '02', title: 'Understand', icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>', desc: 'Use the 3D Skin Model & Navigator for educational clarity.' },
              { num: '03', title: 'Connect', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', desc: 'Ask NITA AI logistical questions or reserve a visit window.' },
              { num: '04', title: 'Consultation', icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>', desc: 'Comprehensive dermoscopy & evaluation with Dr. Patel.' },
              { num: '05', title: 'Follow-Up', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>', desc: 'Structured recovery check-ins and barrier maintenance.' }
            ].map((st, idx) => `
              <button type="button" class="journey-step-card ${idx === 0 ? 'active' : ''}" data-step="${idx}" onclick="window.selectJourneyStep(${idx})">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                  <div class="journey-step-icon">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${st.icon}</svg>
                  </div>
                  <span style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--gold-500); font-weight: 700;">${st.num}</span>
                </div>
                <h4 style="font-size: 1.12rem; margin-bottom: 6px; color: var(--navy-900);">${st.title}</h4>
                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${st.desc}</p>
              </button>
            `).join('')}
          </div>

          <div id="journey-step-detail" style="margin-top: 24px; background: #FFF; border: 1px solid var(--border-light); border-left: 4px solid var(--gold-500); border-radius: var(--radius-md); padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; box-shadow: var(--shadow-sm);">
            <div>
              <strong style="color: var(--navy-900); font-size: 1rem;">Step 01 &bull; Explore Clinical Pathways</strong>
              <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">Browse medical, cosmetic, and laser dermatology protocols transparently without pressure before scheduling.</p>
            </div>
            <a href="#services" class="btn btn-sm btn-primary">Explore Services &rarr;</a>
          </div>
        </div>
      </section>

      <!-- Patient Care & Clinical Transparency Standards -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <div class="badge badge-teal">Patient-First Practice Standards</div>
            <h2>Why Patients Choose Advance Dermatology</h2>
            <p>Committed to ethical dermatological practice, unhurried clinical evaluations, and evidence-based care in Marina del Rey.</p>
          </div>

          <div class="three-col-grid">
            <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-sm);">
              <span class="badge badge-gold" style="margin-bottom: 12px;">Physician-Led</span>
              <h3 style="font-size: 1.2rem; margin-bottom: 10px;">Direct Specialist Evaluation</h3>
              <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.65;">
                Every diagnostic and procedural plan is centered on clinical examination and tailored discussion with Dr. Nita Patel, MD.
              </p>
            </div>
            <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-sm);">
              <span class="badge badge-teal" style="margin-bottom: 12px;">Transparent Care</span>
              <h3 style="font-size: 1.2rem; margin-bottom: 10px;">Clear Expectations &amp; Safety</h3>
              <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.65;">
                Patients receive straightforward guidance on procedure preparation, realistic recovery considerations, and insurance vs. elective care.
              </p>
            </div>
            <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-sm);">
              <span class="badge badge-navy" style="margin-bottom: 12px;">Privacy-Aware</span>
              <h3 style="font-size: 1.2rem; margin-bottom: 10px;">Protected Patient Inquiries</h3>
              <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.65;">
                Digital consultation requests collect only minimal scheduling details and never perform automated diagnosis or medical triage.
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="#clinical-standards" class="btn btn-secondary">Read Clinical Standards &rarr;</a>
          </div>
        </div>
      </section>

      <!-- Final Booking CTA Banner -->
      <section class="section" style="background: linear-gradient(135deg, var(--navy-900) 0%, #152E4B 100%); color: #FFF; text-align: center;">
        <div class="container">
          <div style="max-width: 720px; margin: 0 auto;">
            <div class="badge badge-gold" style="margin-bottom: 14px;">Advance Dermatology & Laser Medical Center</div>
            <h2 style="color: #FFF; font-size: 2.5rem; margin-bottom: 18px;">Begin Your Path to Optimal Skin Health</h2>
            <p style="color: #CBD5E1; font-size: 1.125rem; line-height: 1.7; margin-bottom: 36px;">
              Schedule an in-depth clinical consultation with Dr. Nita Patel at our Marina del Rey office. We are dedicated to providing ethical, science-backed dermatological care.
            </p>
            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
              <a href="#booking" class="btn btn-gold btn-lg">Book Demo Consultation</a>
              <a href="#contact" class="btn btn-secondary btn-lg" style="color:#FFF; background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2);">Contact Clinic Concierge</a>
            </div>
          </div>
        </div>
      </section>
    `;

    // Initialize interactive before/after comparison
    initBeforeAfterSlider('ba-home-slider', 'ba-home-after', 'ba-home-handle');

    // Mount Visual Treatment Explorer default category
    if (window.selectExplorerCategory) {
      window.selectExplorerCategory('medical');
    }

    // Mount AI Skin Concern Navigator in Home
    if (window.renderSkinConcernNavigator) {
      window.renderSkinConcernNavigator(document.getElementById('home-skin-navigator-container'));
    }

    // Mount Interactive 3D Skin Science Experience
    if (window.initSkin3DExperience) {
      setTimeout(() => window.initSkin3DExperience('skin-3d-canvas-container'), 80);
    }
  }

  // 2. ABOUT DOCTOR (EDITORIAL CINEMATIC UPGRADE)
  function renderAboutDoctor() {
    DOM.mainContent.innerHTML = `
      ${subpageHero("Dr. Nita Patel, MD", "Medical Director & Board-Certified Dermatologist • Marina del Rey, CA", "Physician Profile")}
      <section class="section doctor-cinematic-section">
        <div class="container">
          <div class="split-grid-doctor" style="margin-bottom: 50px;">
            <div>
              <div class="hero-visual-card">
                <img src="assets/doctor-concept.jpg" alt="Abstract Medical Visual Representing Dermatology Precision" />
                <div class="hero-floating-badge">
                  <span>Dr. Nita Patel, MD</span>
                  <span class="badge badge-demo">Illustrative Visual</span>
                </div>
              </div>

              <!-- Editorial Quote Card -->
              <div class="quote-card-editorial" style="background: linear-gradient(135deg, #0B1521 0%, #17324F 100%); border: 1px solid rgba(197,168,128,0.35); border-radius: var(--radius-lg); padding: 24px; margin-top: 24px; color: #FFF; position: relative;">
                <span style="font-family: var(--font-serif); font-size: 3rem; color: var(--gold-500); line-height: 1; display: block; margin-bottom: -10px;">“</span>
                <p style="font-family: var(--font-serif); font-size: 1.05rem; font-style: italic; color: #DFCDAE; line-height: 1.6; margin-bottom: 12px;">
                  True dermatology is the union of microscopic cellular precision and natural artistic restraint. We never distort; we heal, restore, and protect.
                </p>
                <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8;">— Clinical Philosophy &bull; Advance Dermatology</span>
              </div>

              <div style="background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 24px; margin-top: 24px;">
                <h4 style="font-size: 1.05rem; margin-bottom: 12px; color: var(--navy-900);">Clinical Focus Areas</h4>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.875rem; color: var(--text-secondary);">
                  <li>&bull; Comprehensive Dermoscopic Skin Cancer Screening</li>
                  <li>&bull; Advanced Hybrid Laser Resurfacing (Halo™ &amp; BBL)</li>
                  <li>&bull; Cystic &amp; Refractory Acne Clinical Protocols</li>
                  <li>&bull; Facial Harmony &amp; Subtle Neuromodulator Precision</li>
                  <li>&bull; Rosacea &amp; Vascular Spider Capillary Management</li>
                </ul>
              </div>
            </div>

            <div>
              <div class="badge badge-gold" style="margin-bottom: 12px;">Physician Philosophy</div>
              <h2 style="font-size: 2.15rem; margin-bottom: 20px;">Dedicated to Science, Anatomical Respect, and Long-Term Skin Health</h2>
              <p class="doctor-bio-para" style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 18px;">
                With over two decades of clinical experience in Southern California, Dr. Nita Patel has earned a reputation for combining meticulous diagnostic discipline with an artistic eye for facial harmony.
              </p>
              <p class="doctor-bio-para" style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 18px;">
                At Advance Dermatology &amp; Laser Medical Center, skin is treated as a communicative biological organ reflecting internal health, environmental exposures, and cellular resilience. Care is centered on healing, restoring, and protecting dermal integrity.
              </p>
              <p class="doctor-bio-para" style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px;">
                Patients receive personalized, unhurried time with Dr. Patel. Every procedural plan is preceded by a thorough medical evaluation to verify that aesthetic goals never compromise skin health.
              </p>

              <!-- Editorial Professional Timeline -->
              <h3 style="font-size: 1.25rem; margin-bottom: 18px; color: var(--navy-900);">Professional Pathway &amp; Milestones</h3>
              <div class="doctor-timeline">
                <div class="doctor-timeline-track"><div class="doctor-timeline-fill"></div></div>
                <div class="timeline-milestone">
                  <strong style="color: var(--navy-900); font-size: 0.95rem;">Medical Education &amp; Clinical Foundation</strong>
                  <span style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-top: 2px;">Formal medical doctorate and foundational training in cutaneous science.</span>
                </div>
                <div class="timeline-milestone">
                  <strong style="color: var(--navy-900); font-size: 0.95rem;">Dermatology Residency &amp; Specialized Training</strong>
                  <span style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-top: 2px;">Focused clinical practice in dermoscopy, cutaneous surgery, and laser safety.</span>
                </div>
                <div class="timeline-milestone">
                  <strong style="color: var(--navy-900); font-size: 0.95rem;">Advance Dermatology (Marina del Rey)</strong>
                  <span style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-top: 2px;">Conceived as a tranquil coastal sanctuary delivering physician-administered care.</span>
                </div>
                <div class="timeline-milestone">
                  <strong style="color: var(--navy-900); font-size: 0.95rem;">Modern Hybrid Laser &amp; Regenerative Practice</strong>
                  <span style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-top: 2px;">Integrating Sciton Halo™, BBL HERO™, and Candela GentleMax Pro platforms.</span>
                </div>
              </div>

              <!-- Sample Credentials Display with required safeguards -->
              <div style="background: #FFF; border: 1px dashed var(--gold-500); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 28px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
                  <strong style="color: var(--navy-900); font-size: 0.95rem;">Sample Credential Display — Illustrative Only</strong>
                  <span class="badge badge-demo">Pending Clinic Verification</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 0.85rem; color: var(--text-secondary);">
                  <div style="border-left: 2px solid var(--gold-500); padding-left: 10px;">
                    <strong>Medical Doctorate</strong><br />Accredited School of Medicine
                  </div>
                  <div style="border-left: 2px solid var(--gold-500); padding-left: 10px;">
                    <strong>Dermatology Residency</strong><br />University Medical Center
                  </div>
                  <div style="border-left: 2px solid var(--gold-500); padding-left: 10px;">
                    <strong>Board Certification</strong><br />American Board of Dermatology
                  </div>
                  <div style="border-left: 2px solid var(--gold-500); padding-left: 10px;">
                    <strong>Professional Societies</strong><br />Dermatology &amp; Laser Associations
                  </div>
                </div>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 12px; font-style: italic;">
                  Note: Official board registration numbers and verified academic institutions will be populated upon authorized clinic review.
                </p>
              </div>

              <div class="doctor-cta-row" style="display: flex; gap: 16px; flex-wrap: wrap;">
                <a href="#booking" class="btn btn-primary">Schedule Consultation with Dr. Patel</a>
                <a href="#contact" class="btn btn-secondary">Inquire with Clinic</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 3. ABOUT CLINIC
  function renderAboutClinic() {
    DOM.mainContent.innerHTML = `
      ${subpageHero("Advance Dermatology & Laser Medical Center", "A state-of-the-art dermatological sanctuary in Marina del Rey, California", "Clinic Facilities")}
      <section class="section">
        <div class="container">
          <div class="split-grid" style="margin-bottom: 60px;">
            <div>
              <div class="badge badge-teal" style="margin-bottom: 12px;">Coastal Medical Sanctuary</div>
              <h2 style="font-size: 2.15rem; margin-bottom: 20px;">Designed for Privacy, Serenity, and Clinical Rigor</h2>
              <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px;">
                Located along the scenic marina in Marina del Rey, California, Advance Dermatology & Laser Medical Center was specifically conceived to eliminate the sterile, intimidating atmosphere often associated with medical practices.
              </p>
              <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px;">
                Our treatment suites are bathed in calming, natural ocean light while maintaining rigorous surgical sterility and cutting-edge laser containment standards. Each room features medical-grade air filtration and integrated cryogenic cooling for procedure comfort.
              </p>
              <a href="#booking" class="btn btn-primary">Book an In-Person Visit</a>
            </div>
            <div class="parallax-media" style="position: relative;">
              <img src="assets/clinic-reception.jpg" alt="Illustrative Clinic Reception Sanctuary" style="border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); border: 1px solid var(--border-light); width: 100%; height: 400px; object-fit: cover;" />
              <span class="badge badge-demo" style="position: absolute; bottom: 16px; right: 16px;">Illustrative Clinic Visual</span>
            </div>
          </div>

          <div class="three-col-grid">
            <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: 28px; border: 1px solid var(--border-light);">
              <h3 style="font-size: 1.25rem; margin-bottom: 12px;">Private Consultation Suites</h3>
              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                Dedicated spaces for in-depth photographic skin analysis, digital dermoscopy mole mapping, and candid physician discussions without rushing.
              </p>
            </div>
            <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: 28px; border: 1px solid var(--border-light);">
              <h3 style="font-size: 1.25rem; margin-bottom: 12px;">Advanced Laser Suite</h3>
              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                Equipped with Sciton Halo™, BBL HERO™, Candela GentleMax Pro, and dedicated optical eye-protection systems for optimal wavelength safety.
              </p>
            </div>
            <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: 28px; border: 1px solid var(--border-light);">
              <h3 style="font-size: 1.25rem; margin-bottom: 12px;">Regenerative Facial Lounges</h3>
              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                Comfortable ergonomic procedure recliners for HydraFacial MD vortex infusions, PRP growth factor micro-treatments, and gentle medical barrier restorations.
              </p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 4. SERVICES OVERVIEW
  function renderServicesOverview() {
    const data = window.CLINIC_DATA;
    DOM.mainContent.innerHTML = `
      ${subpageHero("Comprehensive Dermatology Services", "Expert medical diagnosis, gold-standard laser resurfacing, and natural cosmetic enhancements.", "Service Directory")}
      <section class="section">
        <div class="container">
          <!-- Filter Tabs -->
          <div style="display: flex; gap: 12px; margin-bottom: 40px; flex-wrap: wrap; justify-content: center;">
            <button class="btn btn-sm ${AppState.selectedCategoryFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="window.filterServices('all')">All Services</button>
            <button class="btn btn-sm ${AppState.selectedCategoryFilter === 'medical' ? 'btn-primary' : 'btn-secondary'}" onclick="window.filterServices('medical')">Medical Dermatology</button>
            <button class="btn btn-sm ${AppState.selectedCategoryFilter === 'cosmetic' ? 'btn-primary' : 'btn-secondary'}" onclick="window.filterServices('cosmetic')">Cosmetic Dermatology</button>
            <button class="btn btn-sm ${AppState.selectedCategoryFilter === 'lasers' ? 'btn-primary' : 'btn-secondary'}" onclick="window.filterServices('lasers')">Laser & Light</button>
            <button class="btn btn-sm ${AppState.selectedCategoryFilter === 'rejuvenation' ? 'btn-primary' : 'btn-secondary'}" onclick="window.filterServices('rejuvenation')">Skin Rejuvenation</button>
          </div>

          <div class="services-grid" id="services-list-container">
            ${renderTreatmentCards(AppState.selectedCategoryFilter)}
          </div>
        </div>
      </section>
    `;
  }

  function renderTreatmentCards(category) {
    const list = category === 'all' 
      ? window.CLINIC_DATA.treatments 
      : window.CLINIC_DATA.treatments.filter(t => t.dept === category);

    return list.map(t => {
      const visualImg = t.dept === 'lasers' ? 'assets/laser-suite.jpg'
        : t.dept === 'cosmetic' ? 'assets/doctor-concept.jpg'
        : t.dept === 'rejuvenation' ? 'assets/clinic-reception.jpg'
        : 'assets/hero-bg.jpg';
      return `
      <div class="service-card service-card--${t.dept}" style="display: flex; flex-direction: column; justify-content: space-between; position: relative;">
        <div>
          <div class="service-card-visual" style="height: 86px;">
            <div class="service-card-visual-bg" style="background-image: url('${visualImg}');"></div>
            <div class="service-card-mask"></div>
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; position: relative; z-index: 2;">
              <span class="badge ${t.dept === 'medical' ? 'badge-teal' : t.dept === 'lasers' ? 'badge-gold' : 'badge-navy'}">
                ${t.dept.toUpperCase()}
              </span>
              <span style="font-size: 0.72rem; color: #FFF; font-weight: 600;">${t.duration}</span>
            </div>
          </div>
          <h3 style="font-size: 1.22rem; margin-bottom: 10px; line-height: 1.35;">${t.title}</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 16px;">${t.desc}</p>
        </div>

        <div>
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-light); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 0.78rem; color: var(--text-muted);">
            <div><strong>Downtime:</strong> ${t.downtime}</div>
            <div style="margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><strong>Target:</strong> ${t.candidacy.split(';')[0]}</div>
          </div>
          <div class="service-card-meta">
            <a href="#treatment/${t.id}" class="cta-arrow-animated" style="color: var(--navy-900); font-weight: 600; font-size: 0.85rem;">
              Protocol Details <span>&rarr;</span>
            </a>
            <a href="#booking/${t.id}" class="btn btn-sm btn-gold">Schedule</a>
          </div>
        </div>
      </div>
      `;
    }).join('');
  }

  window.filterServices = function (cat) {
    AppState.selectedCategoryFilter = cat;
    renderServicesOverview();
    if (window.init3DTiltCards) window.init3DTiltCards();
    if (window.initMagneticButtons) window.initMagneticButtons();
  };

  // 5, 6, 7, 8. DEPARTMENT PAGES
  function renderDepartmentPage(deptId) {
    const dept = window.CLINIC_DATA.departments.find(d => d.id === deptId);
    const treatments = window.CLINIC_DATA.treatments.filter(t => t.dept === deptId);
    const visualImg = deptId === 'lasers' ? 'assets/laser-suite.jpg'
      : deptId === 'cosmetic' ? 'assets/doctor-concept.jpg'
      : deptId === 'rejuvenation' ? 'assets/clinic-reception.jpg'
      : 'assets/hero-bg.jpg';

    DOM.mainContent.innerHTML = `
      ${subpageHero(dept.name, dept.desc, `Department • ${dept.badge}`)}
      <section class="section">
        <div class="container">
          <div class="services-grid">
            ${treatments.map(t => `
              <div class="service-card service-card--${deptId}">
                <div class="service-card-visual" style="height: 82px;">
                  <div class="service-card-visual-bg" style="background-image: url('${visualImg}');"></div>
                  <div class="service-card-mask"></div>
                  <span class="badge badge-gold" style="position: relative; z-index: 2; font-size: 0.68rem;">${t.duration}</span>
                </div>
                <h3>${t.title}</h3>
                <p>${t.desc}</p>
                <div style="background: var(--bg-secondary); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 0.8125rem;">
                  <div><strong>Ideal For:</strong> ${t.candidacy}</div>
                  <div style="margin-top: 6px;"><strong>Downtime:</strong> ${t.downtime}</div>
                </div>
                <div class="service-card-meta">
                  <a href="#treatment/${t.id}" class="cta-arrow-animated" style="color: var(--navy-900); font-weight: 600;">Clinical Protocol <span>&rarr;</span></a>
                  <a href="#booking/${t.id}" class="btn btn-sm btn-primary">Schedule</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // 9. TREATMENT DETAIL PAGE
  function renderTreatmentDetail(treatmentId) {
    const t = window.CLINIC_DATA.treatments.find(item => item.id === treatmentId) || window.CLINIC_DATA.treatments[0];

    DOM.mainContent.innerHTML = `
      ${subpageHero(t.title, t.headline, `Clinical Protocol • ${t.dept.toUpperCase()}`)}
      <section class="section">
        <div class="container">
          <div class="split-grid-asym" style="align-items: start;">
            <div>
              <div class="badge badge-teal" style="margin-bottom: 12px;">Overview & Clinical Indications</div>
              <h2 style="font-size: 2.15rem; margin-bottom: 18px;">${t.title}</h2>
              <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; margin-bottom: 24px;">
                ${t.desc}
              </p>

              <h3 style="font-size: 1.35rem; margin-bottom: 14px;">Key Clinical Benefits</h3>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;">
                ${t.benefits.map(b => `
                  <li style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: var(--text-secondary);">
                    <span style="color: var(--teal-600); font-weight: bold;">&check;</span> ${b}
                  </li>
                `).join('')}
              </ul>

              <h3 style="font-size: 1.35rem; margin-bottom: 14px;">Scientific Diagram & Mechanism</h3>
              <div style="border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-light); margin-bottom: 30px;">
                <img src="assets/skin-layers-diagram.jpg" alt="Dermal Mechanism Diagram" />
              </div>

              <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--border-light);">
                <h4 style="font-size: 1.05rem; margin-bottom: 10px;">Pre-Procedure Preparation Guidance</h4>
                <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">
                  Avoid active retinoids (tretinoin, Retin-A), salicylic acid peels, and extensive direct sun exposure for 7 days prior. Inform Dr. Patel during your initial evaluation of any active cold sores or anticoagulant therapies.
                </p>
              </div>
            </div>

            <!-- Treatment Sidebar Card -->
            <div>
              <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 32px; box-shadow: var(--shadow-xl); position: sticky; top: 100px;">
                <h3 style="font-size: 1.35rem; margin-bottom: 20px; border-bottom: 1px solid var(--border-light); padding-bottom: 14px;">Treatment Specifications</h3>

                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px; font-size: 0.9rem;">
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Duration</span>
                    <strong>${t.duration}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Expected Downtime</span>
                    <strong>${t.downtime}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Recommended Sessions</span>
                    <strong>${t.sessions}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Comfort / Anesthesia</span>
                    <strong>${t.anesthesia}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Consultation &amp; Insurance</span>
                    <strong style="color: var(--navy-900);">${t.costEstimate}</strong>
                  </div>
                </div>

                <a href="#booking/${t.id}" class="btn btn-gold btn-lg" style="width: 100%; text-align: center; margin-bottom: 12px;">
                  Schedule This Treatment
                </a>
                <button onclick="window.launchNitaAssistant('Tell me more about candidacy for ${t.title}')" class="btn btn-secondary" style="width: 100%;">
                  Ask NITA AI About This
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 10. TECHNOLOGY AND EQUIPMENT (EXPANDABLE SHOWCASE)
  function renderTechnology() {
    const techs = window.CLINIC_DATA.technologies;
    DOM.mainContent.innerHTML = `
      ${subpageHero("Technology & Clinical Equipment", "Gold-standard aesthetic and surgical platforms engineered for safety and clinical precision.", "Equipment Showcase")}
      <section class="section">
        <div class="container">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px;">
            ${techs.map((tech, idx) => `
              <div class="tech-card-expandable" id="tech-card-${idx}" style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 30px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
                <span class="badge badge-teal" style="align-self: flex-start; margin-bottom: 12px;">${tech.category}</span>
                <h3 style="font-size: 1.35rem; margin-bottom: 8px;">${tech.name}</h3>
                <span style="font-size: 0.8125rem; color: var(--gold-600); font-weight: 600; margin-bottom: 14px;">${tech.specs}</span>
                <p style="color: var(--text-secondary); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 16px; flex: 1;">
                  ${tech.description}
                </p>

                <div class="tech-details-drawer">
                  <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border-light); font-size: 0.82rem; color: var(--text-secondary);">
                    <strong style="display: block; color: var(--navy-900); margin-bottom: 6px;">Safety &amp; Clinical Notes:</strong>
                    Parameters are calibrated in-clinic by Dr. Patel according to Fitzpatrick skin type, target tissue depth, and individual dermal history.
                  </div>
                </div>

                <div style="border-top: 1px solid var(--border-light); padding-top: 14px; margin-top: 16px;">
                  <strong style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 8px;">Target Indications:</strong>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
                    ${tech.indications.map(ind => `<span class="badge badge-navy" style="font-size: 0.7rem;">${ind}</span>`).join('')}
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                    <button type="button" class="btn btn-sm btn-secondary" onclick="window.toggleTechExpand(${idx})">
                      <span id="tech-toggle-label-${idx}">Clinical Details +</span>
                    </button>
                    <a href="#services" class="cta-arrow-animated" style="font-size: 0.82rem; font-weight: 600; color: var(--navy-900);">
                      Related Protocols <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // 11. PATIENT RESOURCES
  function renderPatientResources() {
    DOM.mainContent.innerHTML = `
      ${subpageHero("Patient Resources & Care Guides", "Comprehensive preparatory checklists, post-procedure instructions, and digital clinic materials.", "Resources")}
      <section class="section">
        <div class="container">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px;">
            <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-sm);">
              <h3 style="font-size: 1.25rem; margin-bottom: 12px;">New Patient Intake Packet</h3>
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 18px;">
                Complete your demographic information, medical history questionnaire, and consent forms prior to your first appointment.
              </p>
              <button onclick="window.showToast('Demo PDF: Sample Patient Intake Form Downloaded', 'success')" class="btn btn-secondary btn-sm">Download Intake PDF (Sample)</button>
            </div>
            <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-sm);">
              <h3 style="font-size: 1.25rem; margin-bottom: 12px;">Laser Resurfacing Post-Care</h3>
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 18px;">
                Day-by-day healing roadmap for Halo™ and BBL photofacial treatments, including recommended barrier balms and UV protocols.
              </p>
              <button onclick="window.showToast('Demo PDF: Laser Post-Care Guide Downloaded', 'success')" class="btn btn-secondary btn-sm">Download Post-Care Guide (Sample)</button>
            </div>
            <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-sm);">
              <h3 style="font-size: 1.25rem; margin-bottom: 12px;">Injectable Pre & Post Instructions</h3>
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 18px;">
                Essential guidance regarding arnica, avoiding NSAIDs, and activity guidelines after neuromodulator or dermal filler treatments.
              </p>
              <button onclick="window.showToast('Demo PDF: Injectables Protocol Downloaded', 'success')" class="btn btn-secondary btn-sm">Download Instructions (Sample)</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 12. NEW PATIENT INFORMATION
  function renderNewPatients() {
    DOM.mainContent.innerHTML = `
      ${subpageHero("New Patient Information", "Everything you need to know for a seamless, tranquil first visit to our Marina del Rey office.", "First Visit Guide")}
      <section class="section">
        <div class="container" style="max-width: 900px;">
          <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow-md);">
            <h2 style="font-size: 1.85rem; margin-bottom: 18px;">What to Expect at Your First Consultation</h2>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px;">
              Your first visit with Dr. Nita Patel is dedicated to understanding your comprehensive dermatological history, lifestyle factors, and specific clinical or cosmetic goals. We do not rush patients through high-volume conveyor-belt appointments.
            </p>

            <h3 style="font-size: 1.25rem; margin-bottom: 12px;">Checklist for Your Appointment:</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; font-size: 0.95rem; color: var(--text-secondary);">
              <li>&check; <strong>Government-Issued Photo Identification</strong> (Driver's License or Passport)</li>
              <li>&check; <strong>Insurance Card</strong> (For medical dermatology appointments billable to PPO insurance)</li>
              <li>&check; <strong>Current Skincare Products</strong> (Names or photos of current topicals, cleansers, and SPF)</li>
              <li>&check; <strong>Medication & Allergy List</strong> (Including systemic prescriptions and over-the-counter supplements)</li>
            </ul>

            <h3 style="font-size: 1.25rem; margin-bottom: 12px;">Arrival & Parking Information:</h3>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px;">
              Our office is located at <strong>4640 Admiralty Way, Suite 500, Marina del Rey, CA 90292</strong>. Ample covered garage parking is available adjacent to the building with direct elevator access to the 5th floor. We validate visitor parking for all scheduled consultations.
            </p>

            <a href="#booking" class="btn btn-gold btn-lg">Schedule Your New Patient Visit</a>
          </div>
        </div>
      </section>
    `;
  }

  // 13. FREQUENTLY ASKED QUESTIONS
  function renderFaqPage() {
    const faqs = window.CLINIC_DATA.faqs;
    DOM.mainContent.innerHTML = `
      ${subpageHero("Frequently Asked Questions", "Clear, transparent answers regarding consultations, laser recovery, and insurance.", "Patient Inquiries")}
      <section class="section">
        <div class="container" style="max-width: 860px;">
          <div style="margin-bottom: 30px;">
            <input type="text" id="faq-search-input" placeholder="Search questions (e.g., insurance, Halo, recovery)..." 
                   style="width: 100%; padding: 14px 20px; border: 1px solid var(--border-subtle); border-radius: var(--radius-full); font-size: 1rem; outline: none;" />
          </div>

          <div id="faq-accordion-list" style="display: flex; flex-direction: column; gap: 16px;">
            ${faqs.map((f, idx) => `
              <div class="faq-item" id="faq-item-${idx}" style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);">
                <button type="button" onclick="window.toggleFaq(${idx})" style="width: 100%; text-align: left; padding: 20px 24px; background: none; border: none; font-size: 1.05rem; font-weight: 600; color: var(--navy-900); display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                  <span>${f.q}</span>
                  <span id="faq-icon-${idx}" style="color: var(--gold-600); font-size: 1.2rem; transition: transform 0.25s ease;">+</span>
                </button>
                <div id="faq-ans-${idx}" class="faq-ans-panel">
                  <div style="padding: 14px 24px 20px; color: var(--text-secondary); font-size: 0.9375rem; line-height: 1.7; border-top: 1px solid var(--border-light);">
                    <span class="badge badge-teal" style="margin-bottom: 8px; font-size: 0.65rem;">${f.category}</span>
                    <p>${f.a}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;

    document.getElementById('faq-search-input').addEventListener('input', function (e) {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(q) ? 'block' : 'none';
      });
    });
  }

  window.toggleFaq = function (idx) {
    const item = document.getElementById(`faq-item-${idx}`);
    const icon = document.getElementById(`faq-icon-${idx}`);
    if (!item || !icon) return;
    const isOpen = item.classList.toggle('open');
    icon.innerText = isOpen ? '−' : '+';
    icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  };

  // 14. GALLERY (BEFORE & AFTER)
  function renderGalleryPage() {
    DOM.mainContent.innerHTML = `
      ${subpageHero("Clinical Results & Gallery Interface", "Interactive before-and-after demonstration visualizer with authentic safeguards.", "Demonstration Gallery")}
      <section class="section">
        <div class="container">
          <!-- Clinical Photography Disclaimer -->
          <div class="preview-legal-box" style="margin-top: 0; margin-bottom: 40px; background: #FFFBEB; border-color: #FCD34D; color: #92400E;">
            <strong>CLINICAL PHOTOGRAPHY NOTICE:</strong> Treatment outcomes depend on individual anatomy, tissue condition, and adherence to pre- and post-procedure protocols. An individualized consultation with Dr. Nita Patel, MD is required prior to any clinical or laser treatment.
          </div>

          <div class="split-grid" style="margin-bottom: 60px;">
            <div>
              <span class="badge badge-demo" style="margin-bottom: 12px;">Case Study Demo: Photorejuvenation</span>
              <h2 style="font-size: 2rem; margin-bottom: 16px;">Hybrid Fractional Laser & Pigment Clearance</h2>
              <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px;">
                Drag the interactive slider to inspect simulated textural smoothing and reduction of actinic pigmentation following a combined Halo™ and BBL HERO™ treatment protocol.
              </p>
              <div style="background: var(--bg-secondary); padding: 18px; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-secondary);">
                <div><strong>Protocol:</strong> Halo 1470nm (250µm) + 2940nm (20µm)</div>
                <div><strong>Timeframe:</strong> Simulated 6-Week Follow-up</div>
                <div><strong>Anatomical Region:</strong> Malar Eminence & Cheek</div>
              </div>
            </div>

            <div>
              <div class="ba-container" id="ba-gallery-slider">
                <img src="assets/before-texture.jpg" class="ba-image" alt="Illustrative Baseline Condition" />
                <div class="ba-after-wrapper" id="ba-gallery-after">
                  <img src="assets/after-texture.jpg" class="ba-image" alt="Illustrative Post-Treatment Concept" />
                </div>
                <button type="button" class="ba-fullscreen-btn" onclick="window.openBAFullscreen('assets/before-texture.jpg', 'assets/after-texture.jpg', 'Photorejuvenation Concept Comparison')" aria-label="Open fullscreen comparison view">
                  &#x26F6; Fullscreen
                </button>
                <div class="ba-handle" id="ba-gallery-handle" tabindex="0" role="slider" aria-label="Before and after comparison slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
                  <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <span class="ba-badge ba-badge-before">Illustrative Baseline</span>
                <span class="ba-badge ba-badge-after">Illustrative Post-Care Concept</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    initBeforeAfterSlider('ba-gallery-slider', 'ba-gallery-after', 'ba-gallery-handle');
  }

  // 15. REVIEWS & VERIFIED FEEDBACK POLICY
  function renderReviewsPage() {
    DOM.mainContent.innerHTML = `
      ${subpageHero("Patient Feedback & Verification Policy", "How Advance Dermatology publishes authorized patient reviews.", "Patient Feedback")}
      <section class="section">
        <div class="container" style="max-width: 860px;">
          <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow-md);">
            <span class="badge badge-gold" style="margin-bottom: 14px;">Authenticity Safeguard</span>
            <h2 style="font-size: 1.85rem; margin-bottom: 16px;">Verified Clinic Reviews Only</h2>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 18px;">
              Advance Dermatology &amp; Laser Medical Center does not publish synthetic, unverified, or fabricated patient testimonials. Individual dermatological outcomes vary by anatomy, condition, and medical history.
            </p>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px;">
              Verified patient reviews with signed consent can be connected directly through the Clinic Portal once authorized by Dr. Nita Patel's practice management team.
            </p>
            <div style="display: flex; gap: 14px; flex-wrap: wrap;">
              <a href="#booking" class="btn btn-gold">Request a Consultation</a>
              <a href="#about-doctor" class="btn btn-secondary">Meet Dr. Nita Patel, MD</a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 16. CONTACT PAGE
  function renderContactPage() {
    const brand = window.CLINIC_DATA.brand;
    DOM.mainContent.innerHTML = `
      ${subpageHero("Contact Our Clinical Concierge", "Reach our Marina del Rey office for appointment inquiries, referrals, and directions.", "Concierge")}
      <section class="section">
        <div class="container">
          <div class="split-grid" style="align-items: start;">
            <div>
              <div class="badge badge-gold" style="margin-bottom: 12px;">Direct Inquiries</div>
              <h2 style="font-size: 2.15rem; margin-bottom: 20px;">We Are Here to Assist Your Dermatological Care</h2>
              <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px;">
                Have questions regarding a specific laser procedure or looking to book a comprehensive skin evaluation? Complete the inquiry form or connect with our concierge team.
              </p>

              <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 36px;">
                <div style="display: flex; gap: 14px; align-items: start;">
                  <div style="color: var(--teal-600);"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                  <div>
                    <strong style="display: block;">Clinic Location</strong>
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">${brand.location}</span>
                  </div>
                </div>
                <div style="display: flex; gap: 14px; align-items: start;">
                  <div style="color: var(--teal-600);"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                  <div>
                    <strong style="display: block;">Telephone</strong>
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">${brand.demoPhone}</span>
                  </div>
                </div>
                <div style="display: flex; gap: 14px; align-items: start;">
                  <div style="color: var(--teal-600);"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                  <div>
                    <strong style="display: block;">Office Hours</strong>
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">${brand.hours}</span>
                  </div>
                </div>
              </div>

              <div class="preview-legal-box" style="margin-top: 0;">
                <strong>Medical Emergency Notice:</strong> If you are experiencing a medical emergency, acute allergic anaphylaxis, or sudden severe bleeding, please dial 911 or visit the nearest hospital emergency department immediately.
              </div>
            </div>

            <!-- Contact Form -->
            <div>
              <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 36px; box-shadow: var(--shadow-lg);">
                <h3 style="font-size: 1.35rem; margin-bottom: 16px;">Send a Clinic Inquiry</h3>
                <div id="contact-form-feedback" style="display:none; margin-bottom:16px; padding:12px 14px; border-radius:var(--radius-md); font-size:0.875rem;"></div>
                <form id="demo-contact-form" onsubmit="window.handleContactSubmit(event)">
                  <div style="margin-bottom: 16px;">
                    <label for="contact-name" style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 6px;">Your Full Name *</label>
                    <input type="text" id="contact-name" required minlength="2" maxlength="100" placeholder="Full Name" style="width: 100%; padding: 12px 16px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); outline: none;" />
                  </div>
                  <div style="margin-bottom: 16px;">
                    <label for="contact-email" style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 6px;">Email Address *</label>
                    <input type="email" id="contact-email" required maxlength="120" placeholder="name@example.com" style="width: 100%; padding: 12px 16px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); outline: none;" />
                  </div>
                  <div style="margin-bottom: 16px;">
                    <label for="contact-interest" style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 6px;">Area of Interest</label>
                    <select id="contact-interest" style="width: 100%; padding: 12px 16px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); outline: none;">
                      <option value="Medical Dermatology Evaluation">Medical Dermatology Evaluation</option>
                      <option value="Halo Laser Resurfacing">Halo™ Laser Resurfacing</option>
                      <option value="BBL HERO Photofacial">BBL® HERO Photofacial</option>
                      <option value="Skin Cancer Screening">Skin Cancer Screening</option>
                      <option value="Cosmetic Injectables">Cosmetic Injectables</option>
                    </select>
                  </div>
                  <div style="margin-bottom: 24px;">
                    <label for="contact-msg" style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 6px;">Your Message (Do not include sensitive medical history) *</label>
                    <textarea id="contact-msg" rows="4" required minlength="5" maxlength="1000" placeholder="How may our front-desk team assist you?" style="width: 100%; padding: 12px 16px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); outline: none;"></textarea>
                  </div>
                  <button type="submit" id="contact-submit-btn" class="btn btn-primary btn-lg" style="width: 100%;">Submit Clinic Inquiry</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  window.handleContactSubmit = async function (e) {
    e.preventDefault();
    const form = document.getElementById('demo-contact-form');
    const btn = document.getElementById('contact-submit-btn');
    const fb = document.getElementById('contact-form-feedback');
    if (!form || !btn || btn.disabled) return;

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const interest = document.getElementById('contact-interest').value;
    const message = document.getElementById('contact-msg').value.trim();

    btn.disabled = true;
    const origText = btn.innerText;
    btn.innerText = 'Sending Inquiry...';
    if (fb) fb.style.display = 'none';

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, interest, message })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (fb) {
          fb.style.display = 'block';
          fb.style.background = '#FEE2E2';
          fb.style.color = '#991B1B';
          fb.style.border = '1px solid #FCA5A5';
          fb.innerText = data.error || 'Could not submit inquiry. Please verify your details.';
        }
        window.showToast(data.error || 'Submission failed', 'warning');
      } else {
        if (fb) {
          fb.style.display = 'block';
          fb.style.background = '#DEF7EC';
          fb.style.color = '#03543F';
          fb.style.border = '1px solid #84E1BC';
          fb.innerText = `Inquiry received (Reference: ${data.referenceCode}). Our Marina del Rey desk will review your message during office hours.`;
        }
        window.showToast(`Inquiry saved (${data.referenceCode})`, 'success');
        form.reset();
      }
    } catch (err) {
      if (fb) {
        fb.style.display = 'block';
        fb.style.background = '#FEE2E2';
        fb.style.color = '#991B1B';
        fb.innerText = 'Network error reaching the clinic server. Please call (310) 822-1200.';
      }
    } finally {
      btn.disabled = false;
      btn.innerText = origText;
    }
  };

  // 17. LOCATION AND DIRECTIONS
  function renderLocationPage() {
    const brand = window.CLINIC_DATA.brand;
    DOM.mainContent.innerHTML = `
      ${subpageHero("Location & Marina del Rey Directions", "Visiting our coastal dermatology clinic at 4640 Admiralty Way.", "Location Guide")}
      <section class="section">
        <div class="container">
          <div class="split-grid" style="align-items: start;">
            <div>
              <div class="badge badge-teal" style="margin-bottom: 12px;">Coastal Convenience</div>
              <h2 style="font-size: 2.15rem; margin-bottom: 20px;">Advance Dermatology in Marina del Rey</h2>
              <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 18px;">
                Centrally located in West Los Angeles, our practice conveniently serves patients from Marina del Rey, Venice Beach, Santa Monica, Playa Vista, Culver City, and Manhattan Beach.
              </p>
              
              <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--border-light); margin-bottom: 24px;">
                <h4 style="margin-bottom: 8px;">Address:</h4>
                <p style="color: var(--navy-900); font-weight: 600; margin-bottom: 16px;">${brand.location}</p>
                <h4 style="margin-bottom: 8px;">Driving Directions:</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                  From the CA-90 Expressway (Marina Freeway), proceed west toward Lincoln Blvd. Turn left onto Mindanao Way, then right onto Admiralty Way. The medical professional building will be on your left overlooking the boat slips.
                </p>
              </div>

              <a href="#booking" class="btn btn-gold">Schedule a Consultation</a>
            </div>

            <!-- Stylized Interactive Map Card -->
            <div>
              <div style="background: linear-gradient(135deg, #0B1521 0%, #17324F 100%); border-radius: var(--radius-xl); padding: 36px; color: #FFF; box-shadow: var(--shadow-xl); border: 1px solid rgba(197,168,128,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                  <span class="badge badge-gold">Interactive Map Card</span>
                  <span style="font-size: 0.75rem; color: #94A3B8;">GPS: 33.9803° N, 118.4417° W</span>
                </div>
                
                <div style="height: 260px; background: rgba(255,255,255,0.06); border-radius: var(--radius-md); border: 1px dashed rgba(197,168,128,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; margin-bottom: 24px;">
                  <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--gold-500); color: var(--navy-900); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-weight: bold;">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <strong style="color: #FFF; font-size: 1.05rem;">Advance Dermatology & Laser</strong>
                  <span style="font-size: 0.85rem; color: #CBD5E1; margin-top: 4px;">4640 Admiralty Way, Suite 500, Marina del Rey</span>
                </div>

                <div style="font-size: 0.85rem; color: #94A3B8; line-height: 1.6;">
                  Validated subterranean and surface parking available. Elevators connect directly to the 5th floor suite.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 19. PRIVACY POLICY
  function renderPrivacyPage() {
    DOM.mainContent.innerHTML = `
      ${subpageHero("Privacy Policy & Demonstration Data Notice", "Transparency, HIPAA awareness, and data privacy safeguards.", "Legal & Privacy")}
      <section class="section">
        <div class="container" style="max-width: 860px;">
          <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow-sm); line-height: 1.7; color: var(--text-secondary);">
            <h2 style="color: var(--navy-900); font-size: 1.75rem; margin-bottom: 16px;">1. Patient Privacy Commitment</h2>
            <p style="margin-bottom: 20px;">
              Advance Dermatology & Laser Medical Center maintains strict adherence to federal and California medical confidentiality laws. Protecting patient medical records and inquiries is a core clinical priority.
            </p>

            <h2 style="color: var(--navy-900); font-size: 1.75rem; margin-bottom: 16px;">2. HIPAA Compliance Architecture</h2>
            <p style="margin-bottom: 20px;">
              Our practice management systems incorporate end-to-end encryption in transit (TLS 1.3) and at rest (AES-256), strict role-based access controls, and detailed audit trails to ensure the security of health information.
            </p>

            <h2 style="color: var(--navy-900); font-size: 1.75rem; margin-bottom: 16px;">3. Data Minimization & Patient Autonomy</h2>
            <p style="margin-bottom: 20px;">
              Our AI Assistant (NITA AI) does not store sensitive clinical disclosures or diagnostic symptom logs in persistent external LLM training repositories.
            </p>
          </div>
        </div>
      </section>
    `;
  }

  // 20. TERMS AND CONDITIONS
  function renderTermsPage() {
    DOM.mainContent.innerHTML = `
      ${subpageHero("Terms and Conditions", "Website terms of demonstration, intellectual property, and medical disclaimers.", "Terms")}
      <section class="section">
        <div class="container" style="max-width: 860px;">
          <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow-sm); line-height: 1.7; color: var(--text-secondary);">
            <h2 style="color: var(--navy-900); font-size: 1.75rem; margin-bottom: 16px;">1. Concept Preview Notice</h2>
            <p style="margin-bottom: 20px;">
              This preview is provided for design review only. It does not constitute a legally binding agreement, an authorized medical endorsement, or an operational appointment portal for Dr. Nita Patel.
            </p>

            <h2 style="color: var(--navy-900); font-size: 1.75rem; margin-bottom: 16px;">2. Medical Disclaimer</h2>
            <p style="margin-bottom: 20px;">
              Information on this website, including content generated by the NITA AI Assistant and the AI Skin Concern Navigator, is provided for educational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified medical physician.
            </p>
          </div>
        </div>
      </section>
    `;
  }

  // 21. ACCESSIBILITY STATEMENT
  function renderAccessibilityPage() {
    DOM.mainContent.innerHTML = `
      ${subpageHero("Accessibility Statement", "Commitment to WCAG 2.1 AA digital accessibility for all patients.", "Accessibility")}
      <section class="section">
        <div class="container" style="max-width: 860px;">
          <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow-sm); line-height: 1.7; color: var(--text-secondary);">
            <h2 style="color: var(--navy-900); font-size: 1.75rem; margin-bottom: 16px;">Accessibility Standards & Compliance</h2>
            <p style="margin-bottom: 20px;">
              Advance Dermatology & Laser Medical Center is committed to ensuring that digital healthcare experiences are fully accessible to individuals with visual, auditory, motor, and cognitive impairments. Our website adheres to <strong>WCAG 2.1 Level AA</strong> standards.
            </p>

            <h3 style="color: var(--navy-900); font-size: 1.25rem; margin-bottom: 12px;">Implemented Features:</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
              <li>&check; High-contrast text exceeding 4.5:1 ratio for optimal legibility</li>
              <li>&check; Full keyboard navigability with visible focus indicators</li>
              <li>&check; Screen-reader friendly semantic ARIA landmarks and attributes</li>
              <li>&check; Alternative text for all illustrative and clinical diagrams</li>
              <li>&check; Speech-to-text and text-to-speech fallback in NITA AI assistant</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  // 22. CLINICAL STANDARDS & PRACTICE PHILOSOPHY
  function renderConceptInfoPage() {
    DOM.mainContent.innerHTML = `
      ${subpageHero("Clinical Standards & Practice Philosophy", "Our unwavering commitment to ethical, evidence-based dermatological excellence in Marina del Rey.", "Clinical Standards")}
      <section class="section">
        <div class="container">
          <div class="split-grid" style="align-items: stretch; margin-bottom: 50px;">
            <div style="background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 36px; box-shadow: var(--shadow-md);">
              <span class="badge badge-gold" style="margin-bottom: 12px;">Physician Leadership</span>
              <h3 style="font-size: 1.65rem; margin-bottom: 16px;">Core Medical Principles</h3>
              <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
                Advance Dermatology & Laser Medical Center is founded upon an unwavering commitment to patient dignity, thorough scientific diagnosis, and subtle natural aesthetics.
              </p>
              <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.9rem;">
                <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
                  <strong style="color: var(--navy-900);">1. Unhurried 45-Minute Patient Visits</strong>
                  <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">We reject high-volume conveyor-belt healthcare. Every patient receives dedicated physical time with Dr. Nita Patel.</p>
                </div>
                <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
                  <strong style="color: var(--navy-900);">2. High-Magnification Polarized Dermoscopy</strong>
                  <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">Routine early detection protocols for atypical nevi, dysplastic lesions, and early-stage cutaneous melanoma.</p>
                </div>
                <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
                  <strong style="color: var(--navy-900);">3. Gold-Standard Laser Safety Containment</strong>
                  <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">Hospital-grade air filtration, optical laser safety shielding, and integrated cryogenic skin protection.</p>
                </div>
                <div>
                  <strong style="color: var(--navy-900);">4. Restorative Aesthetic Harmony</strong>
                  <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">Preserving natural facial mobility without artificial or exaggerated volume modifications.</p>
                </div>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #0B1521 0%, #152E4B 100%); color: #FFF; border-radius: var(--radius-xl); padding: 36px; box-shadow: var(--shadow-xl); border: 1px solid rgba(197,168,128,0.3);">
              <span class="badge badge-teal" style="margin-bottom: 12px;">Marina del Rey Center</span>
              <h3 style="font-size: 1.65rem; color: #FFF; margin-bottom: 16px;">The Patient Experience</h3>
              <p style="color: #CBD5E1; line-height: 1.6; margin-bottom: 24px;">
                Located along the scenic marina in West Los Angeles, our practice is designed as a calm, private sanctuary where clinical science meets compassionate care:
              </p>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 14px; font-size: 0.95rem;">
                <li style="display: flex; gap: 12px; align-items: start;">
                  <span style="color: var(--gold-500); font-weight: bold;">✓</span>
                  <span>Direct, board-certified physician diagnosis and treatment execution.</span>
                </li>
                <li style="display: flex; gap: 12px; align-items: start;">
                  <span style="color: var(--gold-500); font-weight: bold;">✓</span>
                  <span>Cutting-edge hybrid fractional laser technology (Sciton Halo™ and BBL HERO™).</span>
                </li>
                <li style="display: flex; gap: 12px; align-items: start;">
                  <span style="color: var(--gold-500); font-weight: bold;">✓</span>
                  <span>Full compliance with HIPAA patient confidentiality and privacy regulations.</span>
                </li>
              </ul>
              <div style="margin-top: 32px;">
                <a href="#booking" class="btn btn-gold">Schedule a Clinical Consultation</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Technology Callout Hotspots (Home Suite Preview)
  const TECH_HOTSPOTS = {
    halo: {
      title: "1. Sciton Halo™ Hybrid Optical Arm (1470nm / 2940nm)",
      desc: "Synchronizes non-ablative dermal coagulation with targeted epidermal resurfacing for calibrated recovery.",
      link: "#treatment/halo-laser"
    },
    bbl: {
      title: "2. BBL® HERO™ Broadband Phototherapy Filter Module",
      desc: "High-energy pulsed light calibrated for superficial melanin spots, erythema, and visible solar pigment.",
      link: "#treatment/bbl-hero"
    },
    cooling: {
      title: "3. Integrated Cryogenic & Sapphire Thermal Protection",
      desc: "Continuous epidermal cooling maintains patient comfort while preserving delicate surface barrier integrity.",
      link: "#technology"
    }
  };

  window.selectTechHotspot = function (key) {
    const info = TECH_HOTSPOTS[key];
    if (!info) return;
    document.querySelectorAll('.tech-hotspot').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-hotspot') === key);
    });
    const box = document.getElementById('home-tech-callout');
    if (box) {
      box.innerHTML = `
        <div style="animation: fadeIn 0.25s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
            <strong style="color:var(--gold-400); font-size:0.95rem;">${info.title}</strong>
            <a href="${info.link}" style="color:#FFF; font-size:0.78rem; text-decoration:underline;">View Protocol &rarr;</a>
          </div>
          <p style="color:#CBD5E1; font-size:0.82rem; line-height:1.5;">${info.desc}</p>
        </div>
      `;
    }
  };

  window.toggleTechExpand = function (idx) {
    const card = document.getElementById(`tech-card-${idx}`);
    const label = document.getElementById(`tech-toggle-label-${idx}`);
    if (!card || !label) return;
    const expanded = card.classList.toggle('expanded');
    label.innerText = expanded ? 'Hide Details −' : 'Clinical Details +';
  };

  // Interactive 5-Step Patient Journey
  const JOURNEY_DETAILS = [
    { title: "Step 01 • Explore Clinical Pathways", text: "Browse medical, cosmetic, and laser dermatology protocols transparently without pressure before scheduling.", btnText: "Explore Services →", href: "#services" },
    { title: "Step 02 • Understand Skin Biology", text: "Interact with our 3D Epidermis/Dermis/Hypodermis explorer or Skin Concern Navigator to prepare informed questions.", btnText: "Open 3D Skin Lab →", href: "#skin-3d-section" },
    { title: "Step 03 • Connect with NITA AI & Concierge", text: "Ask NITA AI about pre-visit prep or reserve an appointment window in under 60 seconds using our Smart Booking flow.", btnText: "Schedule Visit →", href: "#booking" },
    { title: "Step 04 • Physician Consultation & Exam", text: "Meet directly with Dr. Nita Patel in a tranquil Marina del Rey suite for dermoscopy and tailored evaluation.", btnText: "Meet Dr. Patel →", href: "#about-doctor" },
    { title: "Step 05 • Follow-Up & Longitudinal Care", text: "Receive structured post-procedure guidance, barrier recovery regimens, and attentive clinical follow-up.", btnText: "Patient Guides →", href: "#patient-resources" }
  ];

  window.selectJourneyStep = function (stepIdx) {
    document.querySelectorAll('.journey-step-card').forEach((card, i) => {
      card.classList.toggle('active', i === stepIdx);
    });
    const bar = document.getElementById('journey-progress-bar');
    if (bar) bar.style.width = `${((stepIdx + 1) / 5) * 100}%`;
    const detail = document.getElementById('journey-step-detail');
    const item = JOURNEY_DETAILS[stepIdx];
    if (detail && item) {
      const targetHref = item.href === '#skin-3d-section' ? 'javascript:document.getElementById(\'skin-3d-section\')?.scrollIntoView({behavior:\'smooth\'});' : item.href;
      detail.innerHTML = `
        <div style="animation: fadeIn 0.25s ease;">
          <strong style="color: var(--navy-900); font-size: 1rem;">${item.title}</strong>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">${item.text}</p>
        </div>
        <a href="${targetHref}" class="btn btn-sm btn-primary">${item.btnText}</a>
      `;
    }
  };

  // Smart Dock Skin World Scroll Jump
  window.scrollToSkinWorld = function () {
    const go = () => {
      const el = document.getElementById('skin-3d-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (window.location.hash && window.location.hash !== '#home') {
      window.location.hash = '#home';
      setTimeout(go, 140);
    } else {
      go();
    }
  };

  // Visual Treatment Explorer Interactive Category Controller
  window.selectExplorerCategory = function (deptId) {
    const data = window.CLINIC_DATA;
    const dept = data.departments.find(d => d.id === deptId) || data.departments[0];
    const treatments = data.treatments.filter(t => t.dept === dept.id);
    const visualImg = dept.id === 'lasers' ? 'assets/laser-suite.jpg'
      : dept.id === 'cosmetic' ? 'assets/doctor-concept.jpg'
      : dept.id === 'rejuvenation' ? 'assets/clinic-reception.jpg'
      : 'assets/hero-bg.jpg';
    const routeMap = {
      medical: 'medical-dermatology',
      cosmetic: 'cosmetic-dermatology',
      lasers: 'laser-treatments',
      rejuvenation: 'skin-rejuvenation'
    };

    document.querySelectorAll('.explorer-tab').forEach(tab => {
      const isMatch = tab.getAttribute('data-dept') === dept.id;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    const stage = document.getElementById('home-explorer-stage');
    if (!stage) return;

    stage.innerHTML = `
      <div style="animation: fadeIn 0.28s ease; display:flex; flex-direction:column; height:100%;">
        <div class="explorer-stage-visual">
          <img src="${visualImg}" alt="${dept.name} Illustrative Visual" />
          <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(11,21,33,0.15) 0%, rgba(11,21,33,0.78) 100%);"></div>
          <div style="position:absolute; bottom:16px; left:24px; right:24px; display:flex; justify-content:space-between; align-items:flex-end; gap:12px;">
            <div>
              <span class="badge badge-gold" style="margin-bottom:6px; font-size:0.68rem;">${dept.badge}</span>
              <h3 style="color:#FFF; font-size:1.55rem; margin:0;">${dept.name}</h3>
            </div>
            <span class="badge badge-demo" style="font-size:0.65rem;">Illustrative Visual</span>
          </div>
        </div>
        <div class="explorer-stage-body">
          <div>
            <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.65;">${dept.desc}</p>
            <div style="margin-top:14px;">
              <strong style="font-size:0.74rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted);">Available Protocols in This Discipline:</strong>
              <div class="explorer-treatment-chips">
                ${treatments.map(t => `
                  <a href="#treatment/${t.id}" class="explorer-chip">
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${t.title.split('(')[0].trim()}</span>
                    <span style="color:var(--gold-600); flex-shrink:0;">&rarr;</span>
                  </a>
                `).join('')}
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; border-top:1px solid var(--border-light); padding-top:16px;">
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <a href="#${routeMap[dept.id] || 'services'}" class="btn btn-primary btn-sm">Explore ${dept.name.split(' ')[0]} Protocols &rarr;</a>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.launchNitaAssistant('Tell me about ${dept.name}')">Ask NITA AI</button>
            </div>
            <a href="#booking" class="btn btn-gold btn-sm">Book Consultation</a>
          </div>
        </div>
      </div>
    `;
  };

  // Before/After Fullscreen Lightbox Modal
  window.openBAFullscreen = function (beforeSrc, afterSrc, title) {
    let modal = document.getElementById('ba-fullscreen-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'ba-fullscreen-modal';
    modal.className = 'modal-backdrop open';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 900px; padding: 28px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:12px;">
          <div>
            <span class="badge badge-demo" style="margin-bottom:4px;">Illustrative Visual Comparison</span>
            <h3 style="font-size:1.3rem; margin:0;">${title}</h3>
          </div>
          <button type="button" id="ba-fs-close" style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:50%; width:36px; height:36px; font-size:1.3rem; cursor:pointer;" aria-label="Close fullscreen view">&times;</button>
        </div>
        <div class="ba-container" id="ba-fs-slider" style="max-width: 100%; height: 420px;">
          <img src="${beforeSrc}" class="ba-image" alt="Illustrative Baseline" />
          <div class="ba-after-wrapper" id="ba-fs-after">
            <img src="${afterSrc}" class="ba-image" alt="Illustrative Post-Care Concept" />
          </div>
          <div class="ba-handle" id="ba-fs-handle" tabindex="0" role="slider" aria-label="Fullscreen comparison slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <span class="ba-badge ba-badge-before">Illustrative Baseline</span>
          <span class="ba-badge ba-badge-after">Illustrative Post-Care Concept</span>
        </div>
        <p style="font-size:0.78rem; color:var(--text-muted); margin-top:14px; font-style:italic;">
          Illustrative demonstration visualization only. Does not depict real clinical photography or guarantee individual outcomes.
        </p>
      </div>
    `;
    document.body.appendChild(modal);
    initBeforeAfterSlider('ba-fs-slider', 'ba-fs-after', 'ba-fs-handle');

    const close = () => modal.remove();
    document.getElementById('ba-fs-close').onclick = close;
    modal.onclick = (e) => { if (e.target === modal) close(); };
  };

  // Interactive Before/After Drag & Keyboard Logic (Responsive width sync)
  function initBeforeAfterSlider(containerId, afterId, handleId) {
    const container = document.getElementById(containerId);
    const after = document.getElementById(afterId);
    const handle = document.getElementById(handleId);
    if (!container || !after || !handle) return;

    function syncAfterWidth() {
      const afterImg = after.querySelector('.ba-image');
      if (afterImg && container.offsetWidth > 0) {
        afterImg.style.width = `${container.offsetWidth}px`;
      }
    }
    syncAfterWidth();
    window.addEventListener('resize', syncAfterWidth);

    let isDragging = false;
    let currentPct = 50;

    function applyPct(pct) {
      currentPct = Math.max(0, Math.min(100, pct));
      after.style.width = `${currentPct}%`;
      handle.style.left = `${currentPct}%`;
      handle.setAttribute('aria-valuenow', Math.round(currentPct));
    }

    function setPosition(x) {
      const rect = container.getBoundingClientRect();
      if (!rect.width) return;
      applyPct(((x - rect.left) / rect.width) * 100);
    }

    function onPointerDown(e) {
      if (e.target && e.target.closest('.ba-fullscreen-btn')) return;
      isDragging = true;
      setPosition(e.clientX || (e.touches && e.touches[0].clientX));
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      setPosition(e.clientX || (e.touches && e.touches[0].clientX));
    }

    function onPointerUp() {
      isDragging = false;
    }

    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); applyPct(currentPct - 5); }
      if (e.key === 'ArrowRight') { e.preventDefault(); applyPct(currentPct + 5); }
    });

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  // Mobile Drawer Helpers
  function openMobileDrawer() {
    if (DOM.mobileDrawer) {
      DOM.mobileDrawer.style.transform = 'translateX(0)';
      AppState.mobileMenuOpen = true;
    }
  }

  function closeMobileDrawer() {
    if (DOM.mobileDrawer) {
      DOM.mobileDrawer.style.transform = 'translateX(100%)';
      AppState.mobileMenuOpen = false;
    }
  }

  // Initialization
  function init() {
    // Listen to hash change
    window.addEventListener('hashchange', handleRoute);

    // Initial route
    handleRoute();

    // Mobile events
    if (DOM.mobileMenuBtn) {
      DOM.mobileMenuBtn.addEventListener('click', openMobileDrawer);
    }
    if (DOM.closeMobileBtn) {
      DOM.closeMobileBtn.addEventListener('click', closeMobileDrawer);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
