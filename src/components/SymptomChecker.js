// Symptom Checker & Clinical Risk Assessment Component
import { COMMON_SYMPTOMS, calculateRisk } from '../aiEngine.js';
import { speechService } from '../speech.js';

export function renderSymptomChecker(container, { currentLang, t, onForwardToDoctor, onTriggerEmergency }) {
  let selectedSymptoms = [];
  let currentResult = null;

  // Localized preset labels
  const presetsText = {
    en: {
      heading: "⚡ Quick Simulation Presets:",
      low: "🟢 Mild Cold (Low Risk)",
      med: "🟡 Dengue/Bronchitis (Moderate)",
      high: "🚨 Acute Cardiac/Hypoxia (High Risk)"
    },
    ta: {
      heading: "⚡ உடனடி மாதிரி பரிசோதனை பொத்தான்கள்:",
      low: "🟢 சாதாரண சளி (குறைந்த அபாயம்)",
      med: "🟡 டெங்கு / மூச்சுக்குழாய் அழற்சி (மிதமான)",
      high: "🚨 தீவிர மாரடைப்பு / மூச்சுத்திணறல் (அதிதீவிர அபாயம்)"
    },
    hi: {
      heading: "⚡ त्वरित सिमुलेशन परीक्षण:",
      low: "🟢 सामान्य सर्दी (कम जोखिम)",
      med: "🟡 डेंगू / ब्रोंकाइटिस (मध्यम)",
      high: "🚨 तीव्र हार्ट अटैक / हाइपोक्सिया (उच्च जोखिम)"
    }
  };

  const pText = presetsText[currentLang] || presetsText.en;

  function render() {
    container.innerHTML = `
      <div class="page-intro">
        <div>
          <h2 class="page-title">
            <span>🩺</span> ${t('symptom_title')}
          </h2>
          <p class="page-description">${t('symptom_desc')}</p>
        </div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <button id="symptom-tts-btn" class="btn-tts">
            <span>🔊</span> ${t('speak_result')}
          </button>
        </div>
      </div>

      <!-- Quick Preset Demo Buttons for Instant Testing -->
      <div class="card" style="margin-bottom: 20px; background: var(--bg-subtle); padding: 14px 20px;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <span style="font-size:0.86rem; font-weight:700; color:var(--text-muted);">
            ${pText.heading}
          </span>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-sm btn-secondary" id="preset-low-btn">
              ${pText.low}
            </button>
            <button class="btn btn-sm btn-secondary" id="preset-med-btn">
              ${pText.med}
            </button>
            <button class="btn btn-sm btn-emergency" id="preset-high-btn">
              ${pText.high}
            </button>
          </div>
        </div>
      </div>

      <div class="grid-sidebar">
        <!-- Left Column: Input Form -->
        <div class="card">
          <form id="symptom-form">
            <!-- Symptom Chips -->
            <label class="form-label">${t('quick_symptoms_label')}</label>
            <div class="symptom-tag-cloud" id="symptom-tag-cloud">
              ${COMMON_SYMPTOMS.map(sym => {
                const label = sym[currentLang] || sym.en;
                const isSelected = selectedSymptoms.includes(sym.id);
                return `
                  <button type="button" class="symptom-chip ${isSelected ? 'selected' : ''}" data-id="${sym.id}">
                    <span class="chip-icon">${sym.icon}</span>
                    <span>${label}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Demographics & Vitals Grid -->
            <h3 style="font-size:1.05rem; font-weight:700; margin: 24px 0 14px 0; display:flex; align-items:center; gap:8px;">
              <span>📊</span> ${t('vitals_section_title')}
            </h3>

            <div class="vitals-grid">
              <div class="form-group">
                <label class="form-label">${t('age_label')}</label>
                <input type="number" id="input-age" class="form-input" value="45" min="1" max="110" />
              </div>

              <div class="form-group">
                <label class="form-label">${t('gender_label')}</label>
                <select id="input-gender" class="form-select">
                  <option value="female">${currentLang === 'ta' ? 'பெண்' : currentLang === 'hi' ? 'महिला' : 'Female'}</option>
                  <option value="male" selected>${currentLang === 'ta' ? 'ஆண்' : currentLang === 'hi' ? 'पुरुष' : 'Male'}</option>
                  <option value="other">${currentLang === 'ta' ? 'மற்றவர்' : currentLang === 'hi' ? 'अन्य' : 'Other'}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">${t('spo2_label')}</label>
                <input type="number" id="input-spo2" class="form-input" value="97" min="60" max="100" />
              </div>
            </div>

            <div class="vitals-grid">
              <div class="form-group">
                <label class="form-label">${t('bp_label')}</label>
                <div style="display:flex; gap:6px; align-items:center;">
                  <input type="number" id="input-sys-bp" class="form-input" value="122" placeholder="Sys" min="60" max="260" />
                  <span>/</span>
                  <input type="number" id="input-dia-bp" class="form-input" value="82" placeholder="Dia" min="40" max="150" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">${t('temp_label')}</label>
                <input type="number" step="0.1" id="input-temp" class="form-input" value="98.6" min="94" max="108" />
              </div>

              <div class="form-group">
                <label class="form-label">${t('pulse_label')}</label>
                <input type="number" id="input-pulse" class="form-input" value="76" min="40" max="220" />
              </div>
            </div>

            <div class="grid-2" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label">${t('duration_label')}</label>
                <select id="input-duration" class="form-select">
                  <option value="1-2">${t('days_1_2')}</option>
                  <option value="3-5">${t('days_3_5')}</option>
                  <option value="week">${t('days_week')}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">${t('severity_label')} (1 - 10): <span id="severity-val">5</span></label>
                <input type="range" id="input-severity" min="1" max="10" value="5" style="width: 100%; margin-top:8px; accent-color: var(--primary);" />
              </div>
            </div>

            <!-- Form Actions -->
            <div style="display:flex; gap:12px; margin-top: 24px; flex-wrap:wrap;">
              <button type="submit" class="btn btn-primary" style="flex:1;">
                ${t('calculate_risk_btn')}
              </button>
              <button type="button" id="reset-symptom-btn" class="btn btn-secondary">
                ${t('reset_btn')}
              </button>
            </div>
          </form>
        </div>

        <!-- Right Column: AI Risk Result Card -->
        <div id="risk-result-container">
          ${renderResultCard(currentResult)}
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderResultCard(result) {
    if (!result) {
      const emptyTitle = currentLang === 'ta' 
        ? "நோயாளி தகவல்களுக்காக காத்திருக்கிறது"
        : currentLang === 'hi'
        ? "मरीज के डेटा की प्रतीक्षा है"
        : "Awaiting Patient Data";

      const emptyDesc = currentLang === 'ta'
        ? "அறிகுறிகளைத் தேர்ந்தெடுத்து அளவீடுகளை உள்ளிடவும் அல்லது மாதிரி பொத்தான்களை அழுத்தி உடனடி AI அபாய மதிப்பீட்டைக் காணவும்."
        : currentLang === 'hi'
        ? "लक्षण चुनें और वाइटल्स दर्ज करें, या रीयल-टाइम एआई जोखिम स्कोर देखने के लिए परीक्षण बटन पर क्लिक करें।"
        : "Select symptoms and enter vitals, or click one of the quick simulation buttons to see real-time AI risk scoring.";

      return `
        <div class="card" style="text-align:center; padding: 48px 24px; color:var(--text-muted);">
          <div style="font-size:3rem; margin-bottom:12px; opacity:0.6;">🩺</div>
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:6px; color:var(--text-main);">
            ${emptyTitle}
          </h3>
          <p style="font-size:0.9rem;">
            ${emptyDesc}
          </p>
        </div>
      `;
    }

    const { score, level, vitalFlags, differentialConditions, action, criticalReasons } = result;

    let badgeClass = "badge-risk-low";
    let meterClass = "risk-low";
    let levelText = t('risk_low');

    if (level === "medium") {
      badgeClass = "badge-risk-medium";
      meterClass = "risk-medium";
      levelText = t('risk_medium');
    } else if (level === "high") {
      badgeClass = "badge-risk-high";
      meterClass = "risk-high";
      levelText = t('risk_high');
    }

    const actionText = action[currentLang] || action.en;
    const criticalTitle = currentLang === 'ta' ? "⚠️ தீவிர எச்சரிக்கை அறிகுறிகள்:" : currentLang === 'hi' ? "⚠️ गंभीर चेतावनी संकेत:" : "⚠️ Critical Red Flags:";
    const audioBtnLabel = currentLang === 'ta' ? "குரலில் கேட்க" : currentLang === 'hi' ? "बोलकर सुनें" : "Audio Readout";

    return `
      <div class="risk-meter-card ${meterClass} card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <span class="badge ${badgeClass}">${levelText}</span>
          <button id="speak-diagnosis-btn" class="btn-tts" title="Listen in Audio">
            <span>🔊</span> ${audioBtnLabel}
          </button>
        </div>

        <!-- Circle Gauge -->
        <div class="risk-score-circle" style="color: var(--risk-${level});">
          <span class="risk-score-number">${score}</span>
          <span class="risk-score-label">Risk Index</span>
        </div>

        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:8px;">
          ${t('risk_score_label')}: ${levelText} (${score}/100)
        </h3>

        <!-- Critical Flags Alert -->
        ${criticalReasons.length > 0 ? `
          <div style="background: rgba(220, 38, 38, 0.1); border: 1px solid var(--risk-high-border); border-radius: var(--radius-sm); padding: 10px 14px; text-align:left; margin: 12px 0;">
            <strong style="color: var(--risk-high); font-size:0.86rem;">${criticalTitle}</strong>
            <ul style="margin: 6px 0 0 18px; font-size:0.84rem; color: var(--risk-high-text);">
              ${criticalReasons.map(r => {
                const rText = typeof r === 'object' ? (r[currentLang] || r.en) : r;
                return `<li>${rText}</li>`;
              }).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Recommended Action Box -->
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px; text-align:left; margin-top:14px;">
          <strong style="font-size:0.86rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">
            ${t('recommended_action')}
          </strong>
          <p style="font-size:0.92rem; font-weight:600; margin-top:4px; color:var(--text-main);">
            ${actionText}
          </p>
        </div>

        <!-- Suspected Conditions -->
        <div class="risk-breakdown-list">
          <strong style="font-size:0.86rem; color:var(--text-muted); display:block; margin-bottom:10px;">
            ${t('suspected_conditions')}
          </strong>
          ${differentialConditions.map(item => {
            const condName = typeof item.name === 'object' ? (item.name[currentLang] || item.name.en) : item.name;
            const condRat = typeof item.rationale === 'object' ? (item.rationale[currentLang] || item.rationale.en) : item.rationale;
            return `
              <div class="risk-factor-item">
                <span class="risk-factor-icon">🔍</span>
                <div>
                  <strong style="font-size:0.9rem;">${condName}</strong>
                  <div style="font-size:0.78rem; color:var(--text-muted);">${condRat}</div>
                </div>
              </div>
            `;
          }).join('')}

          <strong style="font-size:0.86rem; color:var(--text-muted); display:block; margin: 14px 0 8px 0;">
            ${t('vital_flags')}
          </strong>
          ${vitalFlags.map(vf => {
            const msg = typeof vf.msg === 'object' ? (vf.msg[currentLang] || vf.msg.en) : vf.msg;
            return `
              <div class="risk-factor-item" style="font-size:0.82rem;">
                <span>${vf.status === 'critical' ? '🔴' : vf.status === 'warning' ? '🟡' : '🟢'}</span>
                <span>${msg}</span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Action CTAs -->
        <div style="margin-top: 20px; display:flex; flex-direction:column; gap:10px;">
          ${level === 'high' ? `
            <button id="trigger-emergency-action-btn" class="btn btn-emergency">
              🚨 ${t('trigger_emergency_btn')}
            </button>
          ` : ''}
          <button id="forward-doctor-btn" class="btn btn-primary">
            ${t('send_to_doctor_btn')}
          </button>
        </div>
      </div>
    `;
  }

  function getFormData() {
    return {
      selectedSymptoms,
      age: parseInt(container.querySelector('#input-age').value) || 30,
      gender: container.querySelector('#input-gender').value,
      spo2: parseInt(container.querySelector('#input-spo2').value) || 98,
      sysBp: parseInt(container.querySelector('#input-sys-bp').value) || 120,
      diaBp: parseInt(container.querySelector('#input-dia-bp').value) || 80,
      temperature: parseFloat(container.querySelector('#input-temp').value) || 98.6,
      pulse: parseInt(container.querySelector('#input-pulse').value) || 76,
      duration: container.querySelector('#input-duration').value,
      severity: parseInt(container.querySelector('#input-severity').value) || 5
    };
  }

  function runAnalysis() {
    const data = getFormData();
    currentResult = calculateRisk(data, currentLang);
    const resultContainer = container.querySelector('#risk-result-container');
    if (resultContainer) {
      resultContainer.innerHTML = renderResultCard(currentResult);
      attachResultEvents();
    }
  }

  function attachEvents() {
    // Symptom chips click
    container.querySelectorAll('.symptom-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-id');
        if (selectedSymptoms.includes(id)) {
          selectedSymptoms = selectedSymptoms.filter(s => s !== id);
          chip.classList.remove('selected');
        } else {
          selectedSymptoms.push(id);
          chip.classList.add('selected');
        }
      });
    });

    // Form submit
    const form = container.querySelector('#symptom-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        runAnalysis();
      });
    }

    // Reset button
    const resetBtn = container.querySelector('#reset-symptom-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        selectedSymptoms = [];
        container.querySelectorAll('.symptom-chip').forEach(c => c.classList.remove('selected'));
        container.querySelector('#input-age').value = 45;
        container.querySelector('#input-spo2').value = 97;
        container.querySelector('#input-sys-bp').value = 120;
        container.querySelector('#input-dia-bp').value = 80;
        container.querySelector('#input-temp').value = 98.6;
        container.querySelector('#input-pulse').value = 76;
        container.querySelector('#input-severity').value = 5;
        container.querySelector('#severity-val').textContent = '5';
        currentResult = null;
        container.querySelector('#risk-result-container').innerHTML = renderResultCard(null);
      });
    }

    // Severity Slider change
    const sevInput = container.querySelector('#input-severity');
    const sevVal = container.querySelector('#severity-val');
    if (sevInput && sevVal) {
      sevInput.addEventListener('input', () => {
        sevVal.textContent = sevInput.value;
      });
    }

    // Presets
    const lowBtn = container.querySelector('#preset-low-btn');
    if (lowBtn) {
      lowBtn.addEventListener('click', () => {
        selectedSymptoms = ['body_weakness'];
        container.querySelectorAll('.symptom-chip').forEach(c => {
          c.classList.toggle('selected', selectedSymptoms.includes(c.getAttribute('data-id')));
        });
        container.querySelector('#input-age').value = 28;
        container.querySelector('#input-spo2').value = 99;
        container.querySelector('#input-sys-bp').value = 118;
        container.querySelector('#input-dia-bp').value = 78;
        container.querySelector('#input-temp').value = 98.8;
        container.querySelector('#input-pulse').value = 72;
        container.querySelector('#input-duration').value = '1-2';
        container.querySelector('#input-severity').value = 3;
        container.querySelector('#severity-val').textContent = '3';
        runAnalysis();
      });
    }

    const medBtn = container.querySelector('#preset-med-btn');
    if (medBtn) {
      medBtn.addEventListener('click', () => {
        selectedSymptoms = ['fever', 'cough'];
        container.querySelectorAll('.symptom-chip').forEach(c => {
          c.classList.toggle('selected', selectedSymptoms.includes(c.getAttribute('data-id')));
        });
        container.querySelector('#input-age').value = 48;
        container.querySelector('#input-spo2').value = 94;
        container.querySelector('#input-sys-bp').value = 138;
        container.querySelector('#input-dia-bp').value = 88;
        container.querySelector('#input-temp').value = 102.2;
        container.querySelector('#input-pulse').value = 96;
        container.querySelector('#input-duration').value = '3-5';
        container.querySelector('#input-severity').value = 6;
        container.querySelector('#severity-val').textContent = '6';
        runAnalysis();
      });
    }

    const highBtn = container.querySelector('#preset-high-btn');
    if (highBtn) {
      highBtn.addEventListener('click', () => {
        selectedSymptoms = ['chest_pain', 'breathlessness'];
        container.querySelectorAll('.symptom-chip').forEach(c => {
          c.classList.toggle('selected', selectedSymptoms.includes(c.getAttribute('data-id')));
        });
        container.querySelector('#input-age').value = 62;
        container.querySelector('#input-spo2').value = 89;
        container.querySelector('#input-sys-bp').value = 175;
        container.querySelector('#input-dia-bp').value = 105;
        container.querySelector('#input-temp').value = 99.4;
        container.querySelector('#input-pulse').value = 114;
        container.querySelector('#input-duration').value = '1-2';
        container.querySelector('#input-severity').value = 9;
        container.querySelector('#severity-val').textContent = '9';
        runAnalysis();
      });
    }

    // Header TTS Button
    const ttsBtn = container.querySelector('#symptom-tts-btn');
    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => {
        const textToRead = currentResult
          ? `${t('risk_score_label')}: ${t('risk_' + currentResult.level)}. ${currentResult.action[currentLang] || currentResult.action.en}`
          : t('symptom_desc');
        speechService.toggle(textToRead, currentLang, ttsBtn);
      });
    }

    attachResultEvents();
  }

  function attachResultEvents() {
    const speakDiagBtn = container.querySelector('#speak-diagnosis-btn');
    if (speakDiagBtn && currentResult) {
      speakDiagBtn.addEventListener('click', () => {
        const actionTxt = currentResult.action[currentLang] || currentResult.action.en;
        const msg = `${t('risk_score_label')}: ${t('risk_' + currentResult.level)}. Score: ${currentResult.score}. ${actionTxt}`;
        speechService.toggle(msg, currentLang, speakDiagBtn);
      });
    }

    const forwardBtn = container.querySelector('#forward-doctor-btn');
    if (forwardBtn && currentResult) {
      forwardBtn.addEventListener('click', () => {
        const data = getFormData();
        const symptomsTranslated = selectedSymptoms.map(sid => {
          const found = COMMON_SYMPTOMS.find(s => s.id === sid);
          return found ? (found[currentLang] || found.en) : sid;
        });

        onForwardToDoctor({
          ...data,
          ...currentResult,
          id: 'PAT-' + Math.floor(1000 + Math.random() * 9000),
          patientName: `Patient (${data.age}${data.gender === 'female' ? 'F' : 'M'})`,
          village: currentLang === 'ta' ? "கள்ளக்குறிச்சி கிராமம்" : currentLang === 'hi' ? "कल्लकुरुचि गांव" : "Kallakurichi Rural Ward",
          selectedSymptoms: symptomsTranslated,
          time: currentLang === 'ta' ? "சற்றுமுன்" : currentLang === 'hi' ? "अभी" : "Just now"
        });
      });
    }

    const triggerEmergBtn = container.querySelector('#trigger-emergency-action-btn');
    if (triggerEmergBtn) {
      triggerEmergBtn.addEventListener('click', () => {
        onTriggerEmergency();
      });
    }
  }

  render();
}
