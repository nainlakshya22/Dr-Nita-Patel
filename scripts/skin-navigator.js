/**
 * AI SKIN CONCERN NAVIGATOR & TRIAGE ENGINE
 * Advance Dermatology & Laser Medical Center — Dr. Nita Patel, MD
 */

(function () {
  'use strict';

  // Navigator state
  const NavigatorState = window.NavigatorState = {
    step: 1, // 1: Concern, 2: Area & Sensitivity, 3: Downtime Tolerance, 4: Educational Pathway Result
    selectedConcernId: null,
    selectedArea: 'Face & Cheeks',
    selectedDowntime: 'Weekend Social (1-3 Days)',
    selectedSensitivity: 'Normal / Resilient'
  };

  window.renderSkinConcernNavigator = function (container) {
    if (!container) return;

    const concerns = window.CLINIC_DATA.skinConcerns;

    function render() {
      if (NavigatorState.step === 1) {
        container.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <span class="badge badge-teal">Step 1 of 3: Primary Concern</span>
              <span style="font-size: 0.8125rem; color: #94A3B8;">Educational Triage Tool</span>
            </div>
            <h3 style="color: #FFF; font-size: 1.4rem; margin-bottom: 10px;">What is your primary dermatological focus?</h3>
            <p style="color: #CBD5E1; font-size: 0.9rem; margin-bottom: 24px;">
              Select the general condition you would like to explore prior to your clinical evaluation.
            </p>

            <div class="concern-card-grid">
              ${concerns.map(c => `
                <div class="concern-choice-card ${NavigatorState.selectedConcernId === c.id ? 'selected' : ''}" 
                     onclick="window.selectConcern('${c.id}')" style="background: #142842; border-color: rgba(255,255,255,0.12); color: #FFF;">
                  <strong style="color: #FFF; font-size: 1.05rem; margin-bottom: 8px;">${c.title}</strong>
                  <p style="color: #94A3B8; font-size: 0.85rem; line-height: 1.5; margin-bottom: 12px;">${c.desc}</p>
                  <span class="badge badge-gold" style="align-self: flex-start; font-size: 0.7rem;">${c.recoveryProfile}</span>
                </div>
              `).join('')}
            </div>

            <div style="margin-top: 28px; display: flex; justify-content: flex-end;">
              <button class="btn btn-gold" id="navigator-next-1" ${!NavigatorState.selectedConcernId ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="window.nextNavigatorStep()">
                Continue &rarr;
              </button>
            </div>
          </div>
        `;
      } else if (NavigatorState.step === 2) {
        container.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <span class="badge badge-teal">Step 2 of 3: Area & Sensitivity</span>
              <button class="btn btn-sm btn-secondary" onclick="window.prevNavigatorStep()" style="color:#FFF; background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2);">&larr; Back</button>
            </div>
            <h3 style="color: #FFF; font-size: 1.4rem; margin-bottom: 10px;">Select anatomical area and sensitivity profile</h3>
            <p style="color: #CBD5E1; font-size: 0.9rem; margin-bottom: 24px;">
              Different wavelengths and topical concentrations are selected based on tissue thickness and reactivity.
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
              <div>
                <label style="display: block; color: #CBD5E1; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">Target Anatomical Region</label>
                <select id="nav-area-select" onchange="NavigatorState.selectedArea = this.value" style="width: 100%; padding: 12px; border-radius: var(--radius-sm); background: #0B1521; color: #FFF; border: 1px solid rgba(255,255,255,0.2);">
                  ${['Face & Cheeks', 'Neck & Décolleté', 'Hands & Arms', 'Back & Shoulders', 'Full Scalp'].map(area => `<option value="${area}" ${NavigatorState.selectedArea === area ? 'selected' : ''}>${area}</option>`).join('')}
                </select>
              </div>

              <div>
                <label style="display: block; color: #CBD5E1; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">Skin Sensitivity Level</label>
                <select id="nav-sens-select" onchange="NavigatorState.selectedSensitivity = this.value" style="width: 100%; padding: 12px; border-radius: var(--radius-sm); background: #0B1521; color: #FFF; border: 1px solid rgba(255,255,255,0.2);">
                  ${['Normal / Resilient', 'Easily Flushed / Rosacea Prone', 'Dry & Barrier Compromised', 'High Pigment Reactive (Fitzpatrick IV-VI)'].map(sens => `<option value="${sens}" ${NavigatorState.selectedSensitivity === sens ? 'selected' : ''}>${sens}</option>`).join('')}
                </select>
              </div>
            </div>

            <div style="margin-top: 28px; display: flex; justify-content: flex-end;">
              <button class="btn btn-gold" onclick="window.nextNavigatorStep()">
                Continue to Recovery Preferences &rarr;
              </button>
            </div>
          </div>
        `;
      } else if (NavigatorState.step === 3) {
        container.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <span class="badge badge-teal">Step 3 of 3: Recovery Schedule</span>
              <button class="btn btn-sm btn-secondary" onclick="window.prevNavigatorStep()" style="color:#FFF; background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2);">&larr; Back</button>
            </div>
            <h3 style="color: #FFF; font-size: 1.4rem; margin-bottom: 10px;">What is your acceptable recovery timeline?</h3>
            <p style="color: #CBD5E1; font-size: 0.9rem; margin-bottom: 24px;">
              Aesthetic lasers can be calibrated from zero downtime to intensive multi-day deep dermal remodeling.
            </p>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              <label style="display: flex; align-items: center; gap: 12px; background: #142842; padding: 16px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">
                <input type="radio" name="downtime" value="Zero Downtime" onchange="NavigatorState.selectedDowntime = this.value" />
                <div>
                  <strong style="color: #FFF; display: block;">Zero Downtime (Event Ready)</strong>
                  <span style="color: #94A3B8; font-size: 0.8rem;">HydraFacial MD, gentle BBL phototherapy, medical barrier infusions.</span>
                </div>
              </label>

              <label style="display: flex; align-items: center; gap: 12px; background: #142842; padding: 16px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">
                <input type="radio" name="downtime" value="Weekend Social (1-3 Days)" checked onchange="NavigatorState.selectedDowntime = this.value" />
                <div>
                  <strong style="color: #FFF; display: block;">Weekend Social (1 – 3 Days)</strong>
                  <span style="color: #94A3B8; font-size: 0.8rem;">Mild pinkness; ideal for RF microneedling or light hybrid laser passes.</span>
                </div>
              </label>

              <label style="display: flex; align-items: center; gap: 12px; background: #142842; padding: 16px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">
                <input type="radio" name="downtime" value="Intensive Transformation (4-6 Days)" onchange="NavigatorState.selectedDowntime = this.value" />
                <div>
                  <strong style="color: #FFF; display: block;">Intensive Transformation (4 – 6 Days)</strong>
                  <span style="color: #94A3B8; font-size: 0.8rem;">Profound Sciton Halo™ dual-depth resurfacing for dramatic textural repair.</span>
                </div>
              </label>
            </div>

            <div style="margin-top: 28px; display: flex; justify-content: flex-end;">
              <button class="btn btn-gold" onclick="window.nextNavigatorStep()">
                Generate Educational Clinical Roadmap &rarr;
              </button>
            </div>
          </div>
        `;
      } else if (NavigatorState.step === 4) {
        const concern = concerns.find(c => c.id === NavigatorState.selectedConcernId) || concerns[0];
        const matchedTreatments = window.CLINIC_DATA.treatments.filter(t => concern.treatments.includes(t.id));

        container.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <span class="badge badge-gold">Tailored Educational Roadmap</span>
              <button class="btn btn-sm btn-secondary" onclick="window.resetNavigator()" style="color:#FFF; background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2);">Start Over</button>
            </div>

            <h3 style="color: #FFF; font-size: 1.6rem; margin-bottom: 10px;">Recommended Pathways for: ${concern.title}</h3>
            
            <!-- Medical Safety Disclaimer -->
            <div style="background: rgba(197,168,128,0.15); border: 1px solid var(--gold-500); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 24px; font-size: 0.8rem; color: #DFCDAE;">
              <strong>NON-DIAGNOSTIC NOTICE:</strong> This roadmap is generated for patient educational exploration only. It does not replace a clinical examination by Dr. Nita Patel. Final candidacy and custom parameters will be determined during your physical consultation.
            </div>

            <div style="background: #102136; border-radius: var(--radius-lg); padding: 24px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
              <h4 style="color: var(--gold-400); font-size: 1.05rem; margin-bottom: 8px;">Physician Strategy Note:</h4>
              <p style="color: #CBD5E1; font-size: 0.9rem; line-height: 1.6;">
                ${concern.clinicalAdvice}
              </p>
              <div style="display: flex; gap: 20px; margin-top: 14px; font-size: 0.8rem; color: #94A3B8;">
                <span><strong>Target Region:</strong> ${NavigatorState.selectedArea}</span>
                <span><strong>Downtime Target:</strong> ${NavigatorState.selectedDowntime}</span>
                <span><strong>Reactivity:</strong> ${NavigatorState.selectedSensitivity}</span>
              </div>
            </div>

            <h4 style="color: #FFF; font-size: 1.15rem; margin-bottom: 14px;">Compatible Clinical Protocols:</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 28px;">
              ${matchedTreatments.map(t => `
                <div style="background: #142842; border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 18px; display: flex; flex-direction: column;">
                  <strong style="color: #FFF; font-size: 0.95rem; margin-bottom: 6px;">${t.title}</strong>
                  <p style="color: #94A3B8; font-size: 0.8rem; line-height: 1.5; margin-bottom: 14px; flex: 1;">${t.desc}</p>
                  <a href="#booking/${t.id}" class="btn btn-sm btn-gold" style="width: 100%; text-align: center;">
                    Pre-Fill Booking for ${t.title.split(' ')[0]}
                  </a>
                </div>
              `).join('')}
            </div>

            <div style="text-align: center;">
              <a href="#booking" class="btn btn-primary btn-lg">Schedule Your Comprehensive Evaluation</a>
            </div>
          </div>
        `;
      }
    }

    window.selectConcern = function (id) {
      NavigatorState.selectedConcernId = id;
      render();
    };

    window.nextNavigatorStep = function () {
      if (NavigatorState.step < 4) {
        NavigatorState.step++;
        render();
      }
    };

    window.prevNavigatorStep = function () {
      if (NavigatorState.step > 1) {
        NavigatorState.step--;
        render();
      }
    };

    window.resetNavigator = function () {
      NavigatorState.step = 1;
      NavigatorState.selectedConcernId = null;
      render();
    };

    // Initial render
    render();
  };

})();
