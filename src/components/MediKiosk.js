// MediKiosk: AI Clinical History Software Platform for Indian Hospitals & AYUSH Centers
// Implements Modules A, B, C, D (Voice+Touch History, Document OCR, Structured Summary, ABDM FHIR & HIS Push)

import { CHIEF_COMPLAINTS, AYUSH_FRAMEWORK, SAMPLE_DOCUMENTS, generateFhirBundle } from '../medikioskData.js';
import { speechService, speechRecognitionService } from '../speech.js';

export function renderMediKiosk(container, { currentLang, t, onPushToDoctorQueue, onTriggerEmergency, onShowToast }) {
  // Kiosk State
  const state = {
    step: 1, // 1: Identify & Consent, 2: Conversational History, 3: Document OCR, 4: Structured Summary & ABDM, 5: Consult Preview
    clinicalMode: 'allopathy', // 'allopathy' | 'ayush'
    patient: {
      name: "Ramesh V. Patel",
      age: 58,
      gender: "male",
      abhaId: "91-4829-1029-4821",
      abhaAddress: "ramesh.patel@abdm",
      phone: "+91 98402 12345",
      tokenNumber: "OPD-A-142",
      department: "General Medicine / NCD Clinic",
      consentGranted: true
    },
    // Module A State
    selectedComplaintId: "chest_pain",
    socratesAnswers: {
      site: "substernal",
      onset: "exertion",
      character: "crushing",
      radiation: "left_arm_jaw",
      associations: ["sweating", "dyspnea"],
      timing: "1_2h",
      exacerbating: "unrelieved",
      severity: 8
    },
    ayushAnswers: {
      prakriti: "vataja",
      vikriti: "vata_vridhi",
      sara: "madhyama_sara",
      samhanana: "madhyama_samhata",
      pramana: "sama_pramana",
      satmya: "madhyama_satmya",
      sattva: "madhyama_sattva",
      ahara_shakti: "manda_agni",
      vyayama_shakti: "avara_vyayama",
      vaya: "vriddha"
    },
    voiceActive: false,
    interimVoiceText: "",
    isRedFlagDetected: true,
    // Module B State
    scannedDocs: [...SAMPLE_DOCUMENTS],
    activeDocPreview: SAMPLE_DOCUMENTS[0].id,
    // Module C State
    summaryDraft: null,
    isPushedToHis: false
  };

  function getLang() {
    return currentLang || 'en';
  }

  function getLocalized(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[getLang()] || obj.en || Object.values(obj)[0] || '';
  }

  // Evaluate red flag state
  function evaluateRedFlags() {
    if (state.selectedComplaintId === 'chest_pain') {
      const isCrushing = state.socratesAnswers.character === 'crushing';
      const radiatesToArm = state.socratesAnswers.radiation === 'left_arm_jaw';
      const severeSweatOrDyspnea = Array.isArray(state.socratesAnswers.associations) && 
        (state.socratesAnswers.associations.includes('sweating') || state.socratesAnswers.associations.includes('dyspnea'));
      const highSeverity = Number(state.socratesAnswers.severity) >= 7;

      state.isRedFlagDetected = (isCrushing && (radiatesToArm || severeSweatOrDyspnea)) || highSeverity;
    } else if (state.selectedComplaintId === 'breathlessness') {
      state.isRedFlagDetected = state.socratesAnswers.onset === 'sudden_dyspnea' || state.socratesAnswers.character === 'gasping' || state.socratesAnswers.timing === 'pnd';
    } else if (state.selectedComplaintId === 'abdominal_pain') {
      state.isRedFlagDetected = state.socratesAnswers.character === 'rigid' || state.socratesAnswers.associations === 'hematemesis';
    } else {
      state.isRedFlagDetected = false;
    }
  }

  // Compile full physician structured summary
  function generateStructuredSummary() {
    const complaint = CHIEF_COMPLAINTS.find(c => c.id === state.selectedComplaintId) || CHIEF_COMPLAINTS[0];
    const socrates = state.socratesAnswers;
    
    // Compile HPI text
    const hpiLines = [
      `Patient presents with acute onset of ${getLocalized(complaint.title).toLowerCase()}.`,
      `Site: Centered at ${socrates.site || 'retrosternal region'}.`,
      `Onset: Developed ${socrates.onset || 'during mild exertion'}.`,
      `Character: Described as ${socrates.character || 'squeezing/crushing'} in nature.`,
      `Radiation: Radiates notably to ${socrates.radiation || 'left shoulder and jaw'}.`,
      `Associated Features: Accompanied by ${Array.isArray(socrates.associations) ? socrates.associations.join(' and ') : 'diaphoresis and dyspnea'}.`,
      `Timing: Duration is approx ${socrates.timing || '1-2 hours'} prior to hospital arrival.`,
      `Exacerbating/Relieving: ${socrates.exacerbating || 'Unrelieved at rest'}.`,
      `Severity: Rated ${socrates.severity || 8} / 10 on numeric pain scale.`
    ];

    // Compile AYUSH section if in AYUSH mode
    let ayushSection = null;
    if (state.clinicalMode === 'ayush') {
      const pData = state.ayushAnswers;
      ayushSection = {
        title: "Ayurvedic Dashavidha Pariksha Intake",
        prakriti: pData.prakriti,
        vikriti: pData.vikriti,
        agni: pData.ahara_shakti,
        sattva: pData.sattva,
        vyayama: pData.vyayama_shakti,
        vaya: pData.vaya,
        summaryText: `Rogi Pariksha reveals ${pData.prakriti.toUpperCase()} constitution with active ${pData.vikriti.toUpperCase()} aggravation. Agni is impaired (${pData.ahara_shakti}), Sattva is ${pData.sattva}, and Vyayama Shakti is reduced.`
      };
    }

    return {
      id: `MK-${Date.now().toString().slice(-6)}`,
      patientName: `${state.patient.name} (${state.patient.age}M)`,
      abhaId: state.patient.abhaId,
      tokenNumber: state.patient.tokenNumber,
      chiefComplaintText: getLocalized(complaint.title),
      hpiSummary: hpiLines.join(' '),
      hpiDetails: socrates,
      pastMedicalHistory: [
        "Type 2 Diabetes Mellitus - 8 years (uncontrolled on Metformin)",
        "Essential Hypertension - 5 years (on Telmisartan 40mg)",
        "Prior Laparoscopic Cholecystectomy (June 2024)"
      ],
      allergies: [
        "⚠️ KNOWN ALLERGY: Penicillin / Ampicillin (History of severe anaphylactoid rash)"
      ],
      currentMedications: [
        "Tab Metformin 500mg BD",
        "Tab Telmisartan 40mg OD",
        "Tab Atorvastatin 20mg HS"
      ],
      abnormalInvestigations: [
        "Fasting Blood Sugar: 214 mg/dL (HIGH - Ref: 70-100)",
        "HbA1c: 9.4% (HIGH - Ref: 4.0-5.6)",
        "Serum Creatinine: 1.74 mg/dL (HIGH - eGFR 41.8 mL/min - CKD Stage 3b pattern)",
        "Serum Potassium: 5.3 mEq/L (BORDERLINE HIGH - Caution with ACEi/ARB)"
      ],
      redFlags: state.isRedFlagDetected ? [
        "🚨 Suspected Acute Coronary Syndrome (ACS) / High Risk Cardiac Ischemia",
        "⚠️ Critical Glycemic & Renal impairment combination"
      ] : [],
      ayush: ayushSection,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reviewStatus: "Ready for Physician Confirmation",
      timeSavedSeconds: 240 // 4 minutes saved per patient consultation
    };
  }

  function render() {
    evaluateRedFlags();
    state.summaryDraft = generateStructuredSummary();

    const modeToggleBadge = state.clinicalMode === 'ayush'
      ? `<span class="badge" style="background:#fef3c7; color:#92400e; border:1px solid #fcd34d;">🌿 AYUSH / Ayurvedic OPD Mode Active</span>`
      : `<span class="badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #7dd3fc;">🩺 Allopathic Medicine OPD Mode</span>`;

    container.innerHTML = `
      <!-- MediKiosk Master Wrapper -->
      <div class="medikiosk-container">
        <!-- Top Kiosk Ribbon -->
        <div class="kiosk-top-ribbon">
          <div class="kiosk-brand">
            <div class="kiosk-pulse-indicator"></div>
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-main); margin:0;">
                  🏥 MediKiosk™ <span style="color:var(--primary); font-size:0.85rem; font-weight:700; background:var(--primary-surface); padding:2px 8px; border-radius:999px; border:1px solid var(--primary-border);">ABDM First-Mile AI Intake</span>
                </h2>
                ${modeToggleBadge}
              </div>
              <small style="color:var(--text-muted);">
                Autonomous Clinical History Acquisition, Document OCR & ABDM FHIR Gateway • OPD Token: <strong>${state.patient.tokenNumber}</strong>
              </small>
            </div>
          </div>

          <div class="kiosk-header-actions">
            <!-- Clinical Framework Toggle (Allopathy vs AYUSH) -->
            <div class="clinical-mode-toggle" title="Switch between Allopathic SOCRATES framework and Ayurvedic Dashavidha Pariksha">
              <button class="btn btn-sm ${state.clinicalMode === 'allopathy' ? 'btn-primary' : 'btn-secondary'}" id="btn-mode-allopathy">
                🩺 Allopathy
              </button>
              <button class="btn btn-sm ${state.clinicalMode === 'ayush' ? 'btn-primary' : 'btn-secondary'}" id="btn-mode-ayush">
                🌿 AYUSH / Ayurveda
              </button>
            </div>

            <!-- Emergency Red Flag Button -->
            ${state.isRedFlagDetected ? `
              <button class="btn btn-sm btn-emergency pulse-red" id="kiosk-priority-triage-btn">
                🚨 RED FLAG DETECTED: URGENT TRIAGE
              </button>
            ` : ''}
          </div>
        </div>

        <!-- 5-Step Journey Stepper Nav -->
        <div class="kiosk-stepper">
          <button class="step-node ${state.step === 1 ? 'active' : state.step > 1 ? 'completed' : ''}" data-step="1">
            <div class="step-num">${state.step > 1 ? '✓' : '1'}</div>
            <div class="step-info">
              <span class="step-title">Step 1: Identify & Consent</span>
              <small class="step-desc">ABHA ID & DPDP Act 2023</small>
            </div>
          </button>

          <button class="step-node ${state.step === 2 ? 'active' : state.step > 2 ? 'completed' : ''}" data-step="2">
            <div class="step-num">${state.step > 2 ? '✓' : '2'}</div>
            <div class="step-info">
              <span class="step-title">Step 2: Conversational History</span>
              <small class="step-desc">Dual Voice/Touch • SOCRATES</small>
            </div>
          </button>

          <button class="step-node ${state.step === 3 ? 'active' : state.step > 3 ? 'completed' : ''}" data-step="3">
            <div class="step-num">${state.step > 3 ? '✓' : '3'}</div>
            <div class="step-info">
              <span class="step-title">Step 3: Document Digitization</span>
              <small class="step-desc">Multilingual OCR & Timeline</small>
            </div>
          </button>

          <button class="step-node ${state.step === 4 ? 'active' : state.step > 4 ? 'completed' : ''}" data-step="4">
            <div class="step-num">${state.step > 4 ? '✓' : '4'}</div>
            <div class="step-info">
              <span class="step-title">Step 4: Structured Summary & ABDM</span>
              <small class="step-desc">FHIR Bundle & HIS Push</small>
            </div>
          </button>

          <button class="step-node ${state.step === 5 ? 'active' : ''}" data-step="5">
            <div class="step-num">5</div>
            <div class="step-info">
              <span class="step-title">Step 5: Physician OPD Room</span>
              <small class="step-desc">Doctor Instant Review (<15s)</small>
            </div>
          </button>
        </div>

        <!-- Dynamic Step Content Pane -->
        <div class="kiosk-body-card">
          ${renderStepContent()}
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderStepContent() {
    switch (state.step) {
      case 1:
        return renderStep1Identify();
      case 2:
        return renderStep2Converse();
      case 3:
        return renderStep3Scan();
      case 4:
        return renderStep4SummarizeAndRoute();
      case 5:
        return renderStep5DoctorConsult();
      default:
        return renderStep1Identify();
    }
  }

  // ==========================================
  // STEP 1: Identify, ABHA ID & DPDP Consent
  // ==========================================
  function renderStep1Identify() {
    return `
      <div class="kiosk-step-wrapper">
        <div class="kiosk-step-header">
          <div>
            <h3 class="kiosk-step-title">
              <span>🪪</span> Step 1: Patient Check-In & ABDM Consent Verification
            </h3>
            <p class="kiosk-step-subtitle">
              Authenticate via Ayushman Bharat Health Account (ABHA) or generate an instant OPD Token. Compliant with Digital Personal Data Protection (DPDP) Act 2023.
            </p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-audio-consent-explain">
            🔊 Listen to Consent Explanation (${getLang() === 'ta' ? 'தமிழ்' : getLang() === 'hi' ? 'हिन्दी' : 'English'})
          </button>
        </div>

        <div class="grid-2 gap-20">
          <!-- ABHA Card / Verification -->
          <div class="kiosk-panel">
            <div class="kiosk-panel-title">
              <span>🇮🇳</span> National Health Identity (ABDM)
            </div>

            <div class="form-group">
              <label class="form-label">14-Digit ABHA Health ID Number:</label>
              <div style="display:flex; gap:8px;">
                <input type="text" class="form-input" id="input-abha-id" value="${state.patient.abhaId}" placeholder="e.g. 91-4829-1029-4821" style="font-family:monospace; font-size:1.05rem; font-weight:700; letter-spacing:1px;" />
                <button class="btn btn-secondary" id="btn-simulate-abha-otp">Verify OTP</button>
              </div>
              <small style="color:var(--text-muted); display:block; margin-top:4px;">
                Linked Address: <strong style="color:var(--primary);">${state.patient.abhaAddress}</strong> • Aadhaar Authenticated ✓
              </small>
            </div>

            <div class="grid-2 gap-12" style="margin-top:14px;">
              <div class="form-group">
                <label class="form-label">Patient Full Name:</label>
                <input type="text" class="form-input" id="input-patient-name" value="${state.patient.name}" />
              </div>
              <div class="form-group">
                <label class="form-label">Age / Gender:</label>
                <div style="display:flex; gap:8px;">
                  <input type="number" class="form-input" id="input-patient-age" value="${state.patient.age}" style="max-width:90px;" />
                  <select class="form-input" id="input-patient-gender">
                    <option value="male" ${state.patient.gender === 'male' ? 'selected' : ''}>Male</option>
                    <option value="female" ${state.patient.gender === 'female' ? 'selected' : ''}>Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="grid-2 gap-12" style="margin-top:8px;">
              <div class="form-group">
                <label class="form-label">Registered Mobile Number:</label>
                <input type="text" class="form-input" id="input-patient-phone" value="${state.patient.phone}" />
              </div>
              <div class="form-group">
                <label class="form-label">Assigned OPD Room / Token:</label>
                <input type="text" class="form-input" value="${state.patient.tokenNumber} (Dr. Varma, MD)" readonly style="background:var(--bg-subtle); font-weight:700;" />
              </div>
            </div>

            <!-- Fast Quick Load Buttons for Kiosk Demo -->
            <div style="margin-top:16px; padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md);">
              <small style="color:var(--text-muted); font-weight:600; display:block; margin-bottom:8px;">⚡ Fast Test Personas:</small>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button class="btn btn-sm btn-secondary btn-persona" data-name="Ramesh V. Patel" data-age="58" data-gender="male" data-abha="91-4829-1029-4821" data-complaint="chest_pain">
                  🫀 Ramesh Patel (58M, Chest Pain)
                </button>
                <button class="btn btn-sm btn-secondary btn-persona" data-name="Lakshmi Narayanan" data-age="64" data-gender="female" data-abha="91-2091-8841-3312" data-complaint="breathlessness">
                  🫁 Lakshmi N. (64F, Wheezing)
                </button>
                <button class="btn btn-sm btn-secondary btn-persona" data-name="Vaidya Anand Rao" data-age="52" data-gender="male" data-abha="91-7712-4029-6611" data-complaint="fever_rigors">
                  🌿 Anand Rao (52M, AYUSH Intake)
                </button>
              </div>
            </div>
          </div>

          <!-- DPDP Act 2023 & ABDM Consent Box -->
          <div class="kiosk-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="kiosk-panel-title">
                <span>🔒</span> DPDP Act 2023 & ABDM Data Consent
              </div>

              <div class="consent-box">
                <p style="font-size:0.88rem; line-height:1.5; color:var(--text-main); margin-bottom:12px;">
                  Under India's <strong>Digital Personal Data Protection Act 2023</strong> and the <strong>ABDM Health Data Management Policy</strong>:
                </p>
                <ul class="consent-checklist">
                  <li>
                    <label class="checkbox-label">
                      <input type="checkbox" id="chk-consent-history" checked />
                      <span><strong>Multimodal Clinical History:</strong> I consent to recording my presenting complaints and clinical history using conversational speech & touch.</span>
                    </label>
                  </li>
                  <li>
                    <label class="checkbox-label">
                      <input type="checkbox" id="chk-consent-ocr" checked />
                      <span><strong>Medical Document OCR:</strong> I authorize optical character recognition and clinical data extraction from my physical prescriptions & reports.</span>
                    </label>
                  </li>
                  <li>
                    <label class="checkbox-label">
                      <input type="checkbox" id="chk-consent-fhir" checked />
                      <span><strong>Hospital HIS & FHIR Linking:</strong> I consent to sharing the structured clinical intake summary with the consulting doctor and linking to my ABHA record.</span>
                    </label>
                  </li>
                  <li>
                    <label class="checkbox-label">
                      <input type="checkbox" id="chk-consent-purge" checked />
                      <span><strong>Zero-Retention Kiosk Guarantee:</strong> Temporary voice recordings and raw camera captures are purged immediately upon session completion.</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            <div style="margin-top:20px; display:flex; justify-content:flex-end;">
              <button class="btn btn-primary btn-lg" id="btn-step1-continue" style="min-width:240px; font-weight:700;">
                Proceed to Clinical History ➜
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // STEP 2: Conversational Multimodal History (Module A)
  // ==========================================
  function renderStep2Converse() {
    const complaint = CHIEF_COMPLAINTS.find(c => c.id === state.selectedComplaintId) || CHIEF_COMPLAINTS[0];
    const socrates = complaint.socrates;

    return `
      <div class="kiosk-step-wrapper">
        <div class="kiosk-step-header">
          <div>
            <h3 class="kiosk-step-title">
              <span>🗣️</span> Step 2: Multimodal Conversational History Acquisition
            </h3>
            <p class="kiosk-step-subtitle">
              Dual-mode voice + touch interaction powered by Indian Language ASR & Clinical Ontologies.
            </p>
          </div>

          <div style="display:flex; gap:10px; align-items:center;">
            <!-- Live Voice Toggle Button -->
            <button class="btn ${state.voiceActive ? 'btn-emergency pulse-red' : 'btn-secondary'}" id="btn-toggle-voice-kiosk">
              <span>${state.voiceActive ? '🛑 Stop Microphone' : '🎙️ Speak Answers (Mic)'}</span>
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-read-question-tts">
              🔊 Read Question
            </button>
          </div>
        </div>

        <!-- Voice Recognition Active Banner -->
        ${state.voiceActive ? `
          <div class="voice-wave-banner">
            <div class="audio-bars">
              <span class="bar"></span><span class="bar"></span><span class="bar"></span><span class="bar"></span><span class="bar"></span>
            </div>
            <div>
              <strong>Listening in ${getLang() === 'ta' ? 'தமிழ் (Tamil)' : getLang() === 'hi' ? 'हिन्दी (Hindi)' : 'English'}...</strong>
              <div style="font-size:0.9rem; color:var(--text-muted);">${state.interimVoiceText || "Speak naturally. e.g., 'I have heavy crushing chest pain radiating to left hand with cold sweat'"}</div>
            </div>
          </div>
        ` : ''}

        <!-- Red Flag Alert if Active -->
        ${state.isRedFlagDetected ? `
          <div class="kiosk-redflag-banner">
            <div class="rf-icon">🚨</div>
            <div class="rf-content">
              <strong>CRITICAL CLINICAL RED FLAG DETECTED: SUSPECTED ACUTE CORONARY SYNDROME</strong>
              <p>Patient reports severe crushing retrosternal pain radiating to left arm/jaw with diaphoresis & breathlessness. Flagged for immediate priority triage triage in Emergency/ICU Bay 1 rather than routine queueing.</p>
            </div>
            <button class="btn btn-emergency btn-sm" id="btn-kiosk-alert-triage">
              Notify Triage Nurse
            </button>
          </div>
        ` : ''}

        <!-- Chief Complaint Selector Chips -->
        <div style="margin-bottom:20px;">
          <label class="form-label" style="font-size:0.95rem; font-weight:700;">Select Chief Presenting Complaint (Or speak your main symptom):</label>
          <div class="kiosk-complaints-grid">
            ${CHIEF_COMPLAINTS.map(c => `
              <button class="kiosk-chip-card ${c.id === state.selectedComplaintId ? 'active' : ''}" data-complaint-id="${c.id}">
                <span class="chip-icon">${c.icon}</span>
                <span class="chip-title">${getLocalized(c.title)}</span>
                ${c.redFlagTrigger ? `<span class="badge badge-risk-high" style="font-size:0.68rem; margin-top:4px;">Urgent Protocol</span>` : ''}
              </button>
            `).join('')}
          </div>
        </div>

        ${state.clinicalMode === 'allopathy' ? renderSocratesInterview(socrates) : renderAyushInterview()}

        <!-- Navigation buttons -->
        <div class="kiosk-nav-footer">
          <button class="btn btn-secondary" id="btn-back-to-step1">
            ⬅ Back to Identification
          </button>
          <button class="btn btn-primary btn-lg" id="btn-step2-continue" style="min-width:260px; font-weight:700;">
            Proceed to Document OCR (Step 3) ➜
          </button>
        </div>
      </div>
    `;
  }

  // Allopathy SOCRATES Questions Renderer
  function renderSocratesInterview(socrates) {
    const answers = state.socratesAnswers;

    return `
      <div class="kiosk-socrates-card">
        <div class="socrates-header">
          <h4>🩺 Structured SOCRATES Clinical History Probing</h4>
          <span style="font-size:0.82rem; color:var(--text-muted);">Dynamically branches based on patient chief complaint</span>
        </div>

        <div class="socrates-grid">
          <!-- 1. Site -->
          <div class="socrates-question-box">
            <div class="sq-title"><span>S</span> 1. Site of Complaint:</div>
            <p class="sq-sub">${getLocalized(socrates.site.question)}</p>
            <div class="sq-options">
              ${socrates.site.options.map(opt => `
                <button class="sq-option-btn ${answers.site === opt.id ? 'selected' : ''}" data-param="site" data-val="${opt.id}">
                  ${getLocalized(opt.label)}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 2. Onset -->
          <div class="socrates-question-box">
            <div class="sq-title"><span>O</span> 2. Onset & Trigger:</div>
            <p class="sq-sub">${getLocalized(socrates.onset.question)}</p>
            <div class="sq-options">
              ${socrates.onset.options.map(opt => `
                <button class="sq-option-btn ${answers.onset === opt.id ? 'selected' : ''}" data-param="onset" data-val="${opt.id}">
                  ${getLocalized(opt.label)}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 3. Character -->
          <div class="socrates-question-box">
            <div class="sq-title"><span>C</span> 3. Character of Pain:</div>
            <p class="sq-sub">${getLocalized(socrates.character.question)}</p>
            <div class="sq-options">
              ${socrates.character.options.map(opt => `
                <button class="sq-option-btn ${opt.redFlag ? 'flag-trigger' : ''} ${answers.character === opt.id ? 'selected' : ''}" data-param="character" data-val="${opt.id}">
                  ${getLocalized(opt.label)} ${opt.redFlag ? '⚠️' : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 4. Radiation -->
          <div class="socrates-question-box">
            <div class="sq-title"><span>R</span> 4. Radiation / Spread:</div>
            <p class="sq-sub">${getLocalized(socrates.radiation.question)}</p>
            <div class="sq-options">
              ${socrates.radiation.options.map(opt => `
                <button class="sq-option-btn ${opt.redFlag ? 'flag-trigger' : ''} ${answers.radiation === opt.id ? 'selected' : ''}" data-param="radiation" data-val="${opt.id}">
                  ${getLocalized(opt.label)} ${opt.redFlag ? '⚠️' : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 5. Associated Symptoms -->
          <div class="socrates-question-box">
            <div class="sq-title"><span>A</span> 5. Associated Symptoms (Select Multiple):</div>
            <p class="sq-sub">${getLocalized(socrates.associations.question)}</p>
            <div class="sq-options">
              ${socrates.associations.options.map(opt => {
                const isSelected = Array.isArray(answers.associations) && answers.associations.includes(opt.id);
                return `
                  <button class="sq-option-btn ${opt.redFlag ? 'flag-trigger' : ''} ${isSelected ? 'selected' : ''}" data-param="associations-multi" data-val="${opt.id}">
                    ${isSelected ? '✓ ' : ''}${getLocalized(opt.label)} ${opt.redFlag ? '⚠️' : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 6. Timing / Duration -->
          <div class="socrates-question-box">
            <div class="sq-title"><span>T</span> 6. Timing & Duration:</div>
            <p class="sq-sub">${getLocalized(socrates.timing.question)}</p>
            <div class="sq-options">
              ${socrates.timing.options.map(opt => `
                <button class="sq-option-btn ${answers.timing === opt.id ? 'selected' : ''}" data-param="timing" data-val="${opt.id}">
                  ${getLocalized(opt.label)}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 7. Exacerbating / Relieving -->
          <div class="socrates-question-box">
            <div class="sq-title"><span>E</span> 7. Exacerbating / Relieving Factors:</div>
            <p class="sq-sub">${getLocalized(socrates.exacerbating.question)}</p>
            <div class="sq-options">
              ${socrates.exacerbating.options.map(opt => `
                <button class="sq-option-btn ${opt.redFlag ? 'flag-trigger' : ''} ${answers.exacerbating === opt.id ? 'selected' : ''}" data-param="exacerbating" data-val="${opt.id}">
                  ${getLocalized(opt.label)}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 8. Severity (1-10) -->
          <div class="socrates-question-box">
            <div class="sq-title"><span>S</span> 8. Severity Scale (1 = Mild, 10 = Agonizing):</div>
            <p class="sq-sub">Current: <strong style="color:${Number(answers.severity) >= 7 ? 'var(--risk-high)' : 'var(--primary)'}; font-size:1.1rem;">${answers.severity} / 10</strong></p>
            <div class="severity-slider-wrapper">
              <input type="range" min="1" max="10" value="${answers.severity}" id="socrates-severity-range" class="severity-range-input" />
              <div class="severity-scale-ticks">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `<span>${n}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // AYUSH Dashavidha Pariksha Renderer
  function renderAyushInterview() {
    const list = AYUSH_FRAMEWORK.parikshaList;
    const answers = state.ayushAnswers;

    return `
      <div class="kiosk-ayush-card">
        <div class="ayush-header">
          <div>
            <h4>🌿 ${getLocalized(AYUSH_FRAMEWORK.title)}</h4>
            <small style="color:var(--text-muted);">Standardized 10-fold clinical pariksha for Ayurvedic OPD intake</small>
          </div>
          <span class="badge" style="background:#fef3c7; color:#92400e;">NAMASTE & AYUSH Portal Standard</span>
        </div>

        <div class="ayush-grid">
          ${list.map(item => `
            <div class="ayush-item-box">
              <strong style="display:block; font-size:0.92rem; color:var(--text-main); margin-bottom:2px;">
                ${getLocalized(item.title)}
              </strong>
              <small style="color:var(--text-muted); display:block; margin-bottom:8px;">${getLocalized(item.description)}</small>
              <div class="sq-options">
                ${item.options.map(opt => `
                  <button class="sq-option-btn ${answers[item.id] === opt.id ? 'selected' : ''}" data-ayush-param="${item.id}" data-val="${opt.id}">
                    ${getLocalized(opt.label)}
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // STEP 3: Medical Document Digitization & OCR (Module B)
  // ==========================================
  function renderStep3Scan() {
    const activeDoc = state.scannedDocs.find(d => d.id === state.activeDocPreview) || state.scannedDocs[0];

    return `
      <div class="kiosk-step-wrapper">
        <div class="kiosk-step-header">
          <div>
            <h3 class="kiosk-step-title">
              <span>📑</span> Step 3: Medical Document Digitization & OCR Intelligence
            </h3>
            <p class="kiosk-step-subtitle">
              Multi-lingual OCR extracts diagnoses, active medications, lab values, and surgical history from prior paper records into a chronological timeline.
            </p>
          </div>

          <div style="display:flex; gap:8px;">
            <label class="btn btn-secondary btn-sm" style="cursor:pointer;">
              📷 Scan Physical Document
              <input type="file" id="kiosk-file-upload-input" accept="image/*,application/pdf" style="display:none;" />
            </label>
          </div>
        </div>

        <!-- Document Selection Ribbon -->
        <div class="kiosk-docs-ribbon">
          ${state.scannedDocs.map(doc => `
            <div class="doc-tab-card ${doc.id === state.activeDocPreview ? 'active' : ''}" data-doc-id="${doc.id}">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="badge" style="background:${doc.badgeColor}15; color:${doc.badgeColor}; font-weight:700;">
                  ${doc.type.toUpperCase().replace('_', ' ')}
                </span>
                <small style="color:var(--text-muted); font-weight:600;">${doc.date}</small>
              </div>
              <strong style="font-size:0.88rem; display:block; margin-top:6px; line-height:1.3;">
                ${getLocalized(doc.title)}
              </strong>
              <small style="color:var(--text-muted);">${doc.facility}</small>
            </div>
          `).join('')}
        </div>

        <!-- Active Document OCR Details Grid -->
        <div class="grid-2 gap-20" style="margin-top:16px;">
          <!-- Document Preview / OCR Extraction View -->
          <div class="kiosk-panel">
            <div class="kiosk-panel-title">
              <span>🔍</span> OCR Extraction Findings & Entity Recognition
              <span class="badge" style="background:#ecfdf5; color:#059669; font-weight:700; margin-left:auto;">
                Confidence: ${activeDoc.ocrConfidence}
              </span>
            </div>

            <div style="font-size:0.86rem; color:var(--text-muted); margin-bottom:12px;">
              Provider: <strong>${activeDoc.physician}</strong> • Facility: <strong>${activeDoc.facility}</strong> • Date: <strong>${activeDoc.date}</strong>
            </div>

            ${renderExtractedDocEntities(activeDoc)}
          </div>

          <!-- Chronological Medical Timeline & Alerts -->
          <div class="kiosk-panel">
            <div class="kiosk-panel-title">
              <span>⏳</span> Integrated Patient Medical Timeline
            </div>

            <div class="medical-timeline">
              <div class="timeline-event">
                <div class="timeline-bullet" style="background:var(--primary);"></div>
                <div class="timeline-content">
                  <div class="timeline-date">Nov 14, 2025 • District Hospital OPD</div>
                  <strong>Type 2 Diabetes & HTN Stage 2 Confirmed</strong>
                  <p>Started on Metformin 500mg BD + Telmisartan 40mg OD + Atorvastatin 20mg.</p>
                </div>
              </div>

              <div class="timeline-event">
                <div class="timeline-bullet" style="background:var(--risk-high);"></div>
                <div class="timeline-content">
                  <div class="timeline-date">Jan 22, 2026 • State Health Diagnostic Lab</div>
                  <strong style="color:var(--risk-high);">Critical Biochemistry Flags Detected</strong>
                  <p>HbA1c escalated to 9.4%, Fasting Glucose 214 mg/dL. Creatinine 1.74 mg/dL (eGFR 41.8 mL/min - CKD alert).</p>
                </div>
              </div>

              <div class="timeline-event">
                <div class="timeline-bullet" style="background:var(--teal);"></div>
                <div class="timeline-content">
                  <div class="timeline-date">June 18, 2024 • Stanley Medical College</div>
                  <strong>Laparoscopic Cholecystectomy</strong>
                  <p>Severe drug allergy documented: <span style="color:var(--risk-high); font-weight:700;">Ampicillin / Penicillin anaphylaxis</span>.</p>
                </div>
              </div>

              <div class="timeline-event current">
                <div class="timeline-bullet pulse-red" style="background:var(--emergency);"></div>
                <div class="timeline-content">
                  <div class="timeline-date">TODAY • MediKiosk Intake</div>
                  <strong style="color:var(--emergency);">Active Intake: Acute Chest Tightness (SOCRATES score 8/10)</strong>
                  <p>Pending immediate review with Dr. A. Varma, MD.</p>
                </div>
              </div>
            </div>

            <!-- Drug-Drug & Allergy Warning Card -->
            <div class="drug-warning-card" style="margin-top:16px;">
              <strong style="color:#b91c1c; font-size:0.86rem;">⚠️ Clinical Safety Alerts Identified by AI:</strong>
              <ul style="font-size:0.82rem; margin-top:6px; padding-left:16px; color:#7f1d1d; line-height:1.5;">
                <li><strong>Penicillin Allergy:</strong> Avoid all beta-lactam antibiotics (Amoxicillin, Augmentin, Piperacillin).</li>
                <li><strong>Renal & Electrolyte Caution:</strong> Elevated Serum Creatinine (1.74) + K+ 5.3 mEq/L indicates patient requires renal dose adjustment for Metformin & monitoring with ARBs.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Navigation buttons -->
        <div class="kiosk-nav-footer">
          <button class="btn btn-secondary" id="btn-back-to-step2">
            ⬅ Back to Conversational History
          </button>
          <button class="btn btn-primary btn-lg" id="btn-step3-continue" style="min-width:260px; font-weight:700;">
            Generate Structured Clinical Summary (Step 4) ➜
          </button>
        </div>
      </div>
    `;
  }

  function renderExtractedDocEntities(doc) {
    const data = doc.extractedData;
    if (!data) return `<p>No structured data extracted.</p>`;

    if (doc.type === 'prescription') {
      return `
        <div>
          <div style="margin-bottom:12px;">
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Extracted Diagnoses:</span>
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
              ${data.diagnoses.map(d => `<span class="badge" style="background:#f1f5f9; color:var(--text-main); font-weight:600;">${d}</span>`).join('')}
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Extracted Medications (Rx):</span>
            <div class="extracted-rx-table-wrap" style="margin-top:4px;">
              <table class="triage-table" style="font-size:0.82rem;">
                <thead>
                  <tr>
                    <th>Medication</th>
                    <th>Strength</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.medications.map(m => `
                    <tr>
                      <td><strong>${m.name}</strong></td>
                      <td>${m.dose}</td>
                      <td><span class="badge" style="background:#ecfdf5; color:#059669;">${m.frequency}</span></td>
                      <td>${m.duration}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    if (doc.type === 'lab_report') {
      return `
        <div>
          <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Lab Biochemical Parameters:</span>
          <div class="extracted-rx-table-wrap" style="margin-top:4px;">
            <table class="triage-table" style="font-size:0.82rem;">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Value</th>
                  <th>Reference</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${data.investigations.map(inv => `
                  <tr style="${inv.status === 'HIGH' || inv.status === 'LOW' ? 'background:rgba(239, 68, 68, 0.05);' : ''}">
                    <td><strong>${inv.test}</strong></td>
                    <td style="font-family:monospace; font-weight:700; color:${inv.critical ? 'var(--risk-high)' : 'inherit'};">
                      ${inv.value} ${inv.unit}
                    </td>
                    <td style="color:var(--text-muted);">${inv.refRange}</td>
                    <td>
                      <span class="badge ${inv.status === 'HIGH' ? 'badge-risk-high' : inv.status === 'LOW' ? 'badge-risk-medium' : 'badge-risk-low'}">
                        ${inv.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (doc.type === 'discharge_summary') {
      return `
        <div>
          <div style="margin-bottom:12px;">
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Procedures & Surgery:</span>
            <div style="margin-top:4px; font-weight:600; font-size:0.88rem; color:var(--text-main);">
              ${data.procedures.join(', ')}
            </div>
          </div>
          <div style="margin-bottom:12px;">
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Critical Allergy Notation:</span>
            <div style="margin-top:4px; padding:8px 12px; background:var(--risk-high-bg); border-left:4px solid var(--risk-high); border-radius:4px; font-size:0.86rem; color:var(--risk-high-text); font-weight:700;">
              ${data.allergies.join(', ')}
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  // ==========================================
  // STEP 4: Structured Summary & ABDM Integration (Module C & D)
  // ==========================================
  function renderStep4SummarizeAndRoute() {
    const summary = state.summaryDraft;
    const fhirBundle = generateFhirBundle(state.patient, summary);

    return `
      <div class="kiosk-step-wrapper">
        <div class="kiosk-step-header">
          <div>
            <h3 class="kiosk-step-title">
              <span>📋</span> Step 4: Structured Clinical Summary & ABDM FHIR Routing
            </h3>
            <p class="kiosk-step-subtitle">
              AI synthesizes conversational interview + digitized documents into standard clinical format. Verified and dispatched to Hospital Information System (HIS).
            </p>
          </div>

          <div style="display:flex; gap:10px;">
            <button class="btn btn-secondary btn-sm" id="btn-listen-summary-audio">
              🔊 Listen to Patient Confirmation
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-toggle-fhir-modal">
              📦 View ABDM FHIR JSON Bundle
            </button>
          </div>
        </div>

        <!-- Summary Main Sheet -->
        <div class="grid-2 gap-20">
          <div class="kiosk-panel clinical-summary-sheet">
            <div class="summary-sheet-header">
              <div>
                <span class="badge" style="background:var(--primary-surface); color:var(--primary); font-weight:700;">Physician-Ready Clinical Intake</span>
                <h4 style="font-size:1.15rem; margin:6px 0 2px 0;">${summary.patientName} • ABHA: ${summary.abhaId}</h4>
                <small style="color:var(--text-muted);">OPD Token: <strong>${summary.tokenNumber}</strong> • Recorded: <strong>${summary.timestamp}</strong></small>
              </div>
              <span class="badge ${state.isRedFlagDetected ? 'badge-risk-high pulse-red' : 'badge-risk-low'}">
                ${state.isRedFlagDetected ? '🚨 PRIORITY EMERGENCY' : '✓ Normal OPD Queue'}
              </span>
            </div>

            <div class="summary-section">
              <div class="sum-label">Chief Complaint:</div>
              <div class="sum-val"><strong>${summary.chiefComplaintText}</strong></div>
            </div>

            <div class="summary-section">
              <div class="sum-label">History of Present Illness (HPI - SOCRATES Framework):</div>
              <div class="sum-val" style="line-height:1.55; color:var(--text-main); font-size:0.88rem;">
                ${summary.hpiSummary}
              </div>
            </div>

            ${summary.ayush ? `
              <div class="summary-section" style="background:#fefce8; padding:10px; border-radius:var(--radius-sm); border:1px solid #fef08a;">
                <div class="sum-label" style="color:#854d0e;">Ayurvedic Dashavidha Pariksha Summary:</div>
                <div class="sum-val" style="font-size:0.86rem; color:#713f12;">
                  ${summary.ayush.summaryText}
                </div>
              </div>
            ` : ''}

            <div class="summary-section">
              <div class="sum-label">Past Medical & Surgical History (From Digitized Records):</div>
              <ul class="sum-list">
                ${summary.pastMedicalHistory.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>

            <div class="summary-section">
              <div class="sum-label" style="color:var(--risk-high);">Known Drug Allergies:</div>
              <div class="sum-val" style="color:var(--risk-high); font-weight:700;">
                ${summary.allergies.join(', ')}
              </div>
            </div>

            <div class="summary-section">
              <div class="sum-label">Active Medications:</div>
              <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
                ${summary.currentMedications.map(m => `<span class="badge" style="background:var(--bg-subtle); color:var(--text-main);">${m}</span>`).join('')}
              </div>
            </div>

            <div class="summary-section">
              <div class="sum-label">Abnormal Investigation Findings:</div>
              <ul class="sum-list" style="color:#b91c1c; font-weight:600; font-size:0.82rem;">
                ${summary.abnormalInvestigations.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- ABDM Gateway & HIS Push Dispatch Card -->
          <div class="kiosk-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="kiosk-panel-title">
                <span>⚡</span> ABDM Interoperability & Hospital HIS Dispatch
              </div>

              <div class="his-dispatch-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <strong>Destination: Outpatient Consultation Room 3</strong>
                  <span class="badge badge-risk-low">Connected</span>
                </div>

                <div class="metric-row">
                  <span>Consulting Physician:</span>
                  <strong>Dr. A. Varma, MD (Gen Med)</strong>
                </div>
                <div class="metric-row">
                  <span>Queue Priority Status:</span>
                  <strong style="color:${state.isRedFlagDetected ? 'var(--risk-high)' : 'var(--primary)'};">
                    ${state.isRedFlagDetected ? 'High Priority Triage (Position #1)' : 'Standard Queue (Position #4)'}
                  </strong>
                </div>
                <div class="metric-row">
                  <span>ABHA Personal Health Record (PHR):</span>
                  <strong>Linked via FHIR R4 API ✓</strong>
                </div>
                <div class="metric-row">
                  <span>Estimated Consultation Time Saved:</span>
                  <strong style="color:var(--primary); font-size:1.05rem;">~4.0 Minutes (75% time reclaimed)</strong>
                </div>
              </div>

              <div style="margin-top:20px; padding:14px; background:var(--primary-surface); border:1px solid var(--primary-border); border-radius:var(--radius-md);">
                <strong style="color:var(--primary-dark); font-size:0.9rem;">✓ Ready for Point-of-Entry Dispatch</strong>
                <p style="font-size:0.84rem; color:var(--text-muted); margin-top:4px;">
                  Submitting will push this complete clinical profile directly to the Doctor Tele-Triage Dashboard and create an active consultation token for Dr. Varma.
                </p>
              </div>
            </div>

            <div style="margin-top:24px; display:flex; flex-direction:column; gap:10px;">
              <button class="btn btn-primary btn-lg" id="btn-push-his-queue" style="font-weight:700; font-size:1.05rem; width:100%;">
                ${state.isPushedToHis ? '✓ Successfully Dispatched to HIS & Doctor Queue!' : '🚀 Dispatch Clinical Record to Doctor Queue'}
              </button>
              <button class="btn btn-secondary" id="btn-view-doctor-room" style="width:100%;">
                Step 5: View Doctor OPD Screen (Consultation Room) ➜
              </button>
            </div>
          </div>
        </div>

        <!-- Hidden/Popup FHIR JSON Modal Viewer -->
        <div id="fhir-modal-wrap" class="hidden">
          <div class="modal-overlay" id="fhir-modal-overlay">
            <div class="modal-dialog" style="max-width:760px;">
              <div class="modal-header">
                <h3 class="modal-title"><span>📦</span> ABDM FHIR R4 Bundle (JSON Standard)</h3>
                <button class="modal-close-btn" id="btn-close-fhir-modal">✕</button>
              </div>
              <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:12px;">
                Standardized FHIR R4 Document bundle conforming to NRCES NDHM guidelines with Patient, Encounter, Condition, and DocumentReference resources.
              </p>
              <pre class="fhir-code-viewer"><code>${JSON.stringify(fhirBundle, null, 2)}</code></pre>
              <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px;">
                <button class="btn btn-secondary btn-sm" id="btn-copy-fhir">Copy JSON</button>
                <button class="btn btn-primary btn-sm" id="btn-close-fhir-modal-2">Close Viewer</button>
              </div>
            </div>
          </div>
        </div>

        <div class="kiosk-nav-footer">
          <button class="btn btn-secondary" id="btn-back-to-step3">
            ⬅ Back to Document Digitization
          </button>
          <button class="btn btn-secondary" id="btn-step4-next">
            Step 5: Doctor Consultation Room ➜
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // STEP 5: Physician OPD Room (Instant Review & Consult)
  // ==========================================
  function renderStep5DoctorConsult() {
    const summary = state.summaryDraft;

    return `
      <div class="kiosk-step-wrapper">
        <div class="kiosk-step-header">
          <div>
            <h3 class="kiosk-step-title">
              <span>👨‍⚕️</span> Step 5: Physician OPD Room — Instant Clinical Review
            </h3>
            <p class="kiosk-step-subtitle">
              What the doctor sees the moment the patient enters the consultation room. Review 100% structured history in under 15 seconds.
            </p>
          </div>

          <!-- Real-Time Consultation Time Saved Counter -->
          <div class="doctor-time-meter">
            <div class="time-meter-badge">
              <span class="tm-icon">⏱️</span>
              <div>
                <span class="tm-title">OPD Time Saved on Intake:</span>
                <strong class="tm-val">3 min 48 sec</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Physician Interactive EMR Form -->
        <div class="grid-2 gap-20">
          <div class="kiosk-panel">
            <div class="kiosk-panel-title">
              <span>📋</span> Pre-Populated Clinical Intake (Physician Editable)
              <span class="badge badge-risk-low" style="margin-left:auto;">Verified Intake</span>
            </div>

            <div class="form-group">
              <label class="form-label">Chief Complaint & Onset:</label>
              <input type="text" class="form-input" id="doc-edit-cc" value="${summary.chiefComplaintText} (Duration: 1-2 hours)" />
            </div>

            <div class="form-group">
              <label class="form-label">History of Present Illness (SOCRATES):</label>
              <textarea class="form-textarea" rows="4" id="doc-edit-hpi">${summary.hpiSummary}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Relevant Medical History & Document Flags:</label>
              <textarea class="form-textarea" rows="3" id="doc-edit-pmh">T2DM (8 yrs, HbA1c 9.4%), HTN (5 yrs), Lap Cholecystectomy (2024). Known Penicillin Allergy. Renal caution: S.Creat 1.74 mg/dL.</textarea>
            </div>

            <!-- Doctor Clinical Impression & Differential -->
            <div class="form-group">
              <label class="form-label">Doctor Clinical Impression / Differential Diagnosis:</label>
              <select class="form-input" id="doc-impression-select">
                <option value="acs">Acute Coronary Syndrome (ACS) - Rule Out NSTEMI / STEMI</option>
                <option value="angina">Unstable Angina Pectoris with Diabetic Neuropathy</option>
                <option value="gerd">Severe GERD / Esophageal Spasm with Dyslipidemia</option>
                <option value="pleurisy">Atypical Musculoskeletal / Pleuritic Pain</option>
              </select>
            </div>
          </div>

          <!-- Doctor Actions & Fast Order Entry -->
          <div class="kiosk-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="kiosk-panel-title">
                <span>⚡</span> Immediate Clinical Directives
              </div>

              <!-- Stat Emergency Actions -->
              ${state.isRedFlagDetected ? `
                <div style="background:var(--risk-high-bg); border:1px solid var(--risk-high-border); padding:12px; border-radius:var(--radius-md); margin-bottom:14px;">
                  <strong style="color:var(--risk-high); font-size:0.9rem;">🚨 Stat ACS Protocol Activated:</strong>
                  <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
                    <label class="checkbox-label" style="font-size:0.86rem;">
                      <input type="checkbox" checked />
                      <span>Immediate 12-Lead ECG in Bay 1 (Within 5 minutes)</span>
                    </label>
                    <label class="checkbox-label" style="font-size:0.86rem;">
                      <input type="checkbox" checked />
                      <span>Stat Troponin-I / CPK-MB Cardiac Biomarkers</span>
                    </label>
                    <label class="checkbox-label" style="font-size:0.86rem;">
                      <input type="checkbox" checked />
                      <span>Sublingual Sorbitrate 5mg SOS (Check BP first)</span>
                    </label>
                  </div>
                </div>
              ` : ''}

              <!-- Doctor Fast e-Prescription (Non-Allergenic) -->
              <div class="form-group">
                <label class="form-label">Doctor Fast e-Prescription (Safe for Penicillin Allergy):</label>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  <label class="symptom-chip selected"><input type="checkbox" checked style="margin-right:6px;" /> Tab Aspirin 150 mg Stat & OD</label>
                  <label class="symptom-chip selected"><input type="checkbox" checked style="margin-right:6px;" /> Tab Clopidogrel 75 mg Stat & OD</label>
                  <label class="symptom-chip selected"><input type="checkbox" checked style="margin-right:6px;" /> Tab Atorvastatin 40 mg HS</label>
                  <label class="symptom-chip"><input type="checkbox" style="margin-right:6px;" /> Tab Pantoprazole 40 mg OD</label>
                </div>
              </div>

              <!-- Full Consultation Focus Reminder -->
              <div style="padding:12px; background:var(--secondary-surface); border-radius:var(--radius-md); font-size:0.84rem; color:var(--secondary);">
                💡 <strong>Consultation Shift:</strong> History is already captured. Doctor devotes 100% of the consultation to physical examination (auscultation, vitals check), clinical reasoning, and counseling the patient!
              </div>
            </div>

            <!-- Doctor Confirm & Issue Button -->
            <div style="margin-top:20px; display:flex; gap:10px;">
              <button class="btn btn-emergency btn-lg" id="btn-doc-transfer-108" style="flex:1;">
                🚨 Transfer to CCU (108)
              </button>
              <button class="btn btn-primary btn-lg" id="btn-doc-sign-confirm" style="flex:1;">
                ✓ Validate & Issue Prescription
              </button>
            </div>
          </div>
        </div>

        <div class="kiosk-nav-footer">
          <button class="btn btn-secondary" id="btn-back-to-step4">
            ⬅ Back to Step 4 (ABDM Summary)
          </button>
          <button class="btn btn-primary" id="btn-start-new-kiosk-session">
            🔄 Start New Patient Kiosk Session
          </button>
        </div>
      </div>
    `;
  }

  // Event Handlers
  function attachEvents() {
    // Stepper nodes click
    container.querySelectorAll('.step-node').forEach(node => {
      node.addEventListener('click', () => {
        const targetStep = parseInt(node.getAttribute('data-step'), 10);
        state.step = targetStep;
        render();
      });
    });

    // Clinical Mode toggle (Allopathy vs AYUSH)
    const btnAllopathy = container.querySelector('#btn-mode-allopathy');
    const btnAyush = container.querySelector('#btn-mode-ayush');
    if (btnAllopathy) {
      btnAllopathy.addEventListener('click', () => {
        state.clinicalMode = 'allopathy';
        render();
        if (onShowToast) onShowToast('info', 'Switched to Allopathic Clinical SOCRATES Framework.');
      });
    }
    if (btnAyush) {
      btnAyush.addEventListener('click', () => {
        state.clinicalMode = 'ayush';
        render();
        if (onShowToast) onShowToast('info', 'Switched to Ayurvedic Dashavidha Pariksha Mode.');
      });
    }

    // Step 1: Persona Loaders
    container.querySelectorAll('.btn-persona').forEach(btn => {
      btn.addEventListener('click', () => {
        state.patient.name = btn.getAttribute('data-name');
        state.patient.age = parseInt(btn.getAttribute('data-age'), 10);
        state.patient.gender = btn.getAttribute('data-gender');
        state.patient.abhaId = btn.getAttribute('data-abha');
        state.selectedComplaintId = btn.getAttribute('data-complaint');
        if (btn.getAttribute('data-complaint') === 'fever_rigors') {
          state.clinicalMode = 'ayush';
        } else {
          state.clinicalMode = 'allopathy';
        }
        render();
        if (onShowToast) onShowToast('info', `Loaded test patient: ${state.patient.name}`);
      });
    });

    // Step 1: Audio consent explanation
    const audioConsentBtn = container.querySelector('#btn-audio-consent-explain');
    if (audioConsentBtn) {
      audioConsentBtn.addEventListener('click', () => {
        const text = getLang() === 'ta'
          ? "வணக்கம். ஆயுஷ்மான் பாரத் டிஜிட்டல் மிஷன் மற்றும் 2023 தனிநபர் தரவு பாதுகாப்பு சட்டத்தின்படி, உங்கள் மருத்துவ வரலாறு மற்றும் முந்தைய ஆவணங்கள் பாதுகாப்பாக பதிவு செய்யப்பட்டு உங்கள் மருத்துவருக்கு மட்டுமே அனுப்பப்படும்."
          : getLang() === 'hi'
          ? "नमस्ते। आयुष्मान भारत डिजिटल मिशन और डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 के तहत, आपका मेडिकल इतिहास और पुरानी पर्चियां सुरक्षित रूप से रिकॉर्ड करके केवल आपके डॉक्टर तक पहुंचाई जाएंगी।"
          : "Welcome. Under the Ayushman Bharat Digital Mission and the Digital Personal Data Protection Act 2023, your medical history and past documents are recorded securely and shared directly with your consulting doctor.";
        speechService.toggle(text, getLang(), audioConsentBtn);
      });
    }

    // Step 1 Continue
    const step1Continue = container.querySelector('#btn-step1-continue');
    if (step1Continue) {
      step1Continue.addEventListener('click', () => {
        state.step = 2;
        render();
      });
    }

    // Step 2: Voice Toggle
    const voiceBtn = container.querySelector('#btn-toggle-voice-kiosk');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        if (state.voiceActive) {
          speechRecognitionService.stopListening();
          state.voiceActive = false;
          render();
        } else {
          state.voiceActive = true;
          render();

          speechRecognitionService.startListening({
            lang: getLang(),
            onInterim: (text) => {
              state.interimVoiceText = text;
              const bannerText = container.querySelector('.voice-wave-banner div div');
              if (bannerText) bannerText.textContent = text;
            },
            onResult: (finalText) => {
              state.interimVoiceText = finalText;
              const lower = finalText.toLowerCase();
              if (lower.includes('chest') || lower.includes('heart') || lower.includes('மார்பு') || lower.includes('सीना')) {
                state.selectedComplaintId = 'chest_pain';
              } else if (lower.includes('breath') || lower.includes('wheez') || lower.includes('மூச்சு') || lower.includes('सांस')) {
                state.selectedComplaintId = 'breathlessness';
              } else if (lower.includes('stomach') || lower.includes('pain') || lower.includes('வயிறு') || lower.includes('पेट')) {
                state.selectedComplaintId = 'abdominal_pain';
              } else if (lower.includes('fever') || lower.includes('chills') || lower.includes('காய்ச்சல்') || lower.includes('बुखार')) {
                state.selectedComplaintId = 'fever_rigors';
              }
              if (onShowToast) onShowToast('success', `Voice recognized: "${finalText}"`);
              speechRecognitionService.stopListening();
              state.voiceActive = false;
              render();
            },
            onError: () => {
              state.voiceActive = false;
              render();
            },
            onEnd: () => {
              state.voiceActive = false;
              render();
            }
          });
        }
      });
    }

    // Step 2: TTS Read Question
    const ttsBtn = container.querySelector('#btn-read-question-tts');
    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => {
        const complaint = CHIEF_COMPLAINTS.find(c => c.id === state.selectedComplaintId) || CHIEF_COMPLAINTS[0];
        const text = `${getLocalized(complaint.title)}. ${getLocalized(complaint.socrates.character.question)}`;
        speechService.toggle(text, getLang(), ttsBtn);
      });
    }

    // Step 2: Complaint selection
    container.querySelectorAll('.kiosk-chip-card').forEach(card => {
      card.addEventListener('click', () => {
        state.selectedComplaintId = card.getAttribute('data-complaint-id');
        render();
      });
    });

    // Step 2: SOCRATES single options
    container.querySelectorAll('.sq-option-btn[data-param]').forEach(btn => {
      btn.addEventListener('click', () => {
        const param = btn.getAttribute('data-param');
        const val = btn.getAttribute('data-val');

        if (param === 'associations-multi') {
          if (!Array.isArray(state.socratesAnswers.associations)) {
            state.socratesAnswers.associations = [];
          }
          if (state.socratesAnswers.associations.includes(val)) {
            state.socratesAnswers.associations = state.socratesAnswers.associations.filter(v => v !== val);
          } else {
            state.socratesAnswers.associations.push(val);
          }
        } else {
          state.socratesAnswers[param] = val;
        }
        render();
      });
    });

    // Step 2: Severity range input
    const severitySlider = container.querySelector('#socrates-severity-range');
    if (severitySlider) {
      severitySlider.addEventListener('input', (e) => {
        state.socratesAnswers.severity = parseInt(e.target.value, 10);
        evaluateRedFlags();
        const sub = severitySlider.closest('.socrates-question-box').querySelector('.sq-sub strong');
        if (sub) {
          sub.textContent = `${state.socratesAnswers.severity} / 10`;
          sub.style.color = state.socratesAnswers.severity >= 7 ? 'var(--risk-high)' : 'var(--primary)';
        }
      });
    }

    // Step 2: AYUSH option selection
    container.querySelectorAll('.sq-option-btn[data-ayush-param]').forEach(btn => {
      btn.addEventListener('click', () => {
        const param = btn.getAttribute('data-ayush-param');
        const val = btn.getAttribute('data-val');
        state.ayushAnswers[param] = val;
        render();
      });
    });

    // Step 2 navigation
    const backTo1 = container.querySelector('#btn-back-to-step1');
    if (backTo1) backTo1.addEventListener('click', () => { state.step = 1; render(); });

    const step2Continue = container.querySelector('#btn-step2-continue');
    if (step2Continue) step2Continue.addEventListener('click', () => { state.step = 3; render(); });

    // Step 3: Document preview tab
    container.querySelectorAll('.doc-tab-card').forEach(tab => {
      tab.addEventListener('click', () => {
        state.activeDocPreview = tab.getAttribute('data-doc-id');
        render();
      });
    });

    // Step 3: File upload simulation
    const fileInput = container.querySelector('#kiosk-file-upload-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (onShowToast) onShowToast('info', `Simulating OCR on ${file.name}...`);
          setTimeout(() => {
            if (onShowToast) onShowToast('success', `High accuracy OCR completed on ${file.name}!`);
          }, 800);
        }
      });
    }

    // Step 3 navigation
    const backTo2 = container.querySelector('#btn-back-to-step2');
    if (backTo2) backTo2.addEventListener('click', () => { state.step = 2; render(); });

    const step3Continue = container.querySelector('#btn-step3-continue');
    if (step3Continue) step3Continue.addEventListener('click', () => { state.step = 4; render(); });

    // Step 4: Audio summary listen
    const listenSummaryBtn = container.querySelector('#btn-listen-summary-audio');
    if (listenSummaryBtn) {
      listenSummaryBtn.addEventListener('click', () => {
        const summary = state.summaryDraft;
        const text = getLang() === 'ta'
          ? `நோயாளி ${summary.patientName}. மார்பு இறுக்கம் மற்றும் மூச்சுத் திணறல் பதிவு செய்யப்பட்டது. மருத்துவர் வர்மா அறைக்கு அனுப்பப்பட்டது.`
          : getLang() === 'hi'
          ? `मरीज ${summary.patientName}। सीने में भारीपन और सांस फूलने का इतिहास रिकॉर्ड किया गया। डॉक्टर कक्ष संख्या 3 में भेजा गया।`
          : `Patient ${summary.patientName}. Presenting with acute chest discomfort and diaphoresis. Clinical record dispatched to Dr. Varma in OPD room 3.`;
        speechService.toggle(text, getLang(), listenSummaryBtn);
      });
    }

    // Step 4: FHIR JSON Modal toggle
    const toggleFhirBtn = container.querySelector('#btn-toggle-fhir-modal');
    const fhirModal = container.querySelector('#fhir-modal-wrap');
    const closeFhir1 = container.querySelector('#btn-close-fhir-modal');
    const closeFhir2 = container.querySelector('#btn-close-fhir-modal-2');
    const copyFhirBtn = container.querySelector('#btn-copy-fhir');

    if (toggleFhirBtn && fhirModal) {
      toggleFhirBtn.addEventListener('click', () => {
        fhirModal.classList.remove('hidden');
      });
    }
    if (closeFhir1 && fhirModal) {
      closeFhir1.addEventListener('click', () => fhirModal.classList.add('hidden'));
    }
    if (closeFhir2 && fhirModal) {
      closeFhir2.addEventListener('click', () => fhirModal.classList.add('hidden'));
    }
    if (copyFhirBtn) {
      copyFhirBtn.addEventListener('click', () => {
        const fhirCode = container.querySelector('.fhir-code-viewer code').textContent;
        navigator.clipboard.writeText(fhirCode);
        if (onShowToast) onShowToast('success', 'ABDM FHIR Bundle copied to clipboard!');
      });
    }

    // Step 4: Push to HIS & Doctor Queue
    const pushHisBtn = container.querySelector('#btn-push-his-queue');
    if (pushHisBtn) {
      pushHisBtn.addEventListener('click', () => {
        const summary = state.summaryDraft;
        state.isPushedToHis = true;

        // Build rich patient record for DoctorDashboard queue
        const doctorQueueRecord = {
          id: summary.id,
          patientName: summary.patientName,
          village: "Kallakurichi Taluk Ward 4",
          selectedSymptoms: [summary.chiefComplaintText, "Diaphoresis", "Dyspnea"],
          score: state.isRedFlagDetected ? 94 : 52,
          level: state.isRedFlagDetected ? "high" : "medium",
          spo2: 95,
          sysBp: 158,
          diaBp: 98,
          temperature: 98.8,
          pulse: 104,
          time: "Just now (MediKiosk)",
          criticalReasons: state.isRedFlagDetected ? [
            "Suspected Acute Coronary Syndrome (ACS)",
            "Active HbA1c 9.4% & Renal Impairment"
          ] : [],
          resolved: false,
          referred: false,
          isMediKioskRecord: true,
          medikioskSummary: summary
        };

        if (onPushToDoctorQueue) {
          onPushToDoctorQueue(doctorQueueRecord);
        }
        if (onShowToast) {
          onShowToast('success', `Dispatched to Hospital HIS & Dr. Varma Queue (Token: ${summary.tokenNumber})!`);
        }
        render();
      });
    }

    const viewDoctorRoomBtn = container.querySelector('#btn-view-doctor-room');
    if (viewDoctorRoomBtn) {
      viewDoctorRoomBtn.addEventListener('click', () => {
        state.step = 5;
        render();
      });
    }

    // Step 4 navigation
    const backTo3 = container.querySelector('#btn-back-to-step3');
    if (backTo3) backTo3.addEventListener('click', () => { state.step = 3; render(); });

    const step4Next = container.querySelector('#btn-step4-next');
    if (step4Next) step4Next.addEventListener('click', () => { state.step = 5; render(); });

    // Step 5 Doctor actions
    const docConfirmBtn = container.querySelector('#btn-doc-sign-confirm');
    if (docConfirmBtn) {
      docConfirmBtn.addEventListener('click', () => {
        if (onShowToast) onShowToast('success', 'Physician verified intake & digital e-prescription signed in 14 seconds!');
      });
    }

    const docTransfer108 = container.querySelector('#btn-doc-transfer-108');
    if (docTransfer108) {
      docTransfer108.addEventListener('click', () => {
        if (onTriggerEmergency) onTriggerEmergency();
      });
    }

    const backTo4 = container.querySelector('#btn-back-to-step4');
    if (backTo4) backTo4.addEventListener('click', () => { state.step = 4; render(); });

    const startNewSession = container.querySelector('#btn-start-new-kiosk-session');
    if (startNewSession) {
      startNewSession.addEventListener('click', () => {
        state.step = 1;
        state.isPushedToHis = false;
        render();
        if (onShowToast) onShowToast('info', 'New patient kiosk session initialized.');
      });
    }
  }

  // Initial render
  render();
}
