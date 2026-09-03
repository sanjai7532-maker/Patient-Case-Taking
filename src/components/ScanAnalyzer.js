// Medical Report & Scan Abnormality Detector Component
import { sampleScans } from '../sampleScans.js';
import { speechService } from '../speech.js';

export function renderScanAnalyzer(container, { currentLang, t, onForwardToDoctor, onTriggerEmergency }) {
  let selectedScan = sampleScans[0]; // Default to Pneumonia scan

  function render() {
    container.innerHTML = `
      <div class="page-intro">
        <div>
          <h2 class="page-title">
            <span>🔬</span> ${t('scanner_title')}
          </h2>
          <p class="page-description">${t('scanner_desc')}</p>
        </div>
      </div>

      <!-- Upload Zone -->
      <div class="upload-dropzone card" id="file-dropzone" style="margin-bottom: 24px;">
        <input type="file" id="file-input" accept="image/*,application/pdf" style="display:none;" />
        <div class="dropzone-icon">📁</div>
        <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:4px;">
          ${t('upload_drag_text')}
        </h3>
        <p style="font-size:0.86rem; color:var(--text-muted);">
          ${t('upload_subtext')}
        </p>
        <button type="button" class="btn btn-secondary btn-sm" style="margin-top:14px;" id="browse-btn">
          <span>📤</span> ${currentLang === 'ta' ? 'கோப்பைத் தேர்ந்தெடு' : currentLang === 'hi' ? 'फ़ाइल चुनें' : 'Browse File'}
        </button>
      </div>

      <!-- Sample Scans Selector -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
          <span>💡</span> ${t('sample_scans_heading')}
        </h3>

        <div class="sample-scans-grid">
          ${sampleScans.map(scan => {
            const isSelected = selectedScan && selectedScan.id === scan.id;
            const sTitle = typeof scan.title === 'object' ? (scan.title[currentLang] || scan.title.en) : scan.title;
            const riskText = scan.riskScore > 70 ? t('risk_high') : scan.riskScore > 35 ? t('risk_medium') : t('risk_low');

            return `
              <div class="sample-scan-card ${isSelected ? 'selected' : ''}" data-id="${scan.id}">
                <div class="sample-scan-thumb">
                  <img src="${scan.thumbnail}" alt="${sTitle}" />
                </div>
                <div class="sample-scan-title">${sTitle}</div>
                <div class="sample-scan-type">${scan.type} • ${scan.category}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                  <span class="badge ${scan.riskScore > 70 ? 'badge-risk-high' : scan.riskScore > 35 ? 'badge-risk-medium' : 'badge-risk-low'}">
                    ${riskText}
                  </span>
                  <small style="font-weight:700; color:var(--text-muted);">${scan.confidence}</small>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Active Scan AI Analysis Inspection -->
      <div id="scan-inspection-area">
        ${renderScanDetails(selectedScan)}
      </div>
    `;

    attachEvents();
  }

  function renderScanDetails(scan) {
    if (!scan) return '';

    const findingsText = scan.findings[currentLang] || scan.findings.en;
    const isCritical = scan.riskScore >= 75;
    const sTitle = typeof scan.title === 'object' ? (scan.title[currentLang] || scan.title.en) : scan.title;
    const sAbnormality = typeof scan.abnormality === 'object' ? (scan.abnormality[currentLang] || scan.abnormality.en) : scan.abnormality;
    const sRec = typeof scan.recommendation === 'object' ? (scan.recommendation[currentLang] || scan.recommendation.en) : scan.recommendation;
    const audioLabel = currentLang === 'ta' ? 'குரலில் கேட்க' : currentLang === 'hi' ? 'बोलकर सुनें' : 'Audio Readout';
    const noteHeading = currentLang === 'ta' ? 'மருத்துவ குறிப்பு:' : currentLang === 'hi' ? 'चिकित्सीय सलाह:' : 'Clinical Note:';

    return `
      <div class="card card-glass" style="border: 2px solid ${isCritical ? 'var(--risk-high-border)' : 'var(--border)'};">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
          <div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="badge ${isCritical ? 'badge-risk-high' : scan.riskScore > 35 ? 'badge-risk-medium' : 'badge-risk-low'}">
                ${sAbnormality}
              </span>
              <span style="font-size:0.86rem; color:var(--text-muted);">${scan.type}</span>
            </div>
            <h3 style="font-family:var(--font-heading); font-size:1.35rem; font-weight:700; margin-top:6px;">
              ${sTitle}
            </h3>
            <span style="font-size:0.84rem; color:var(--text-muted);">
              ${currentLang === 'ta' ? 'நோயாளி:' : currentLang === 'hi' ? 'मरीज:' : 'Patient:'} <strong>${scan.patientName}</strong>
            </span>
          </div>

          <div style="display:flex; gap:8px;">
            <button id="scan-tts-btn" class="btn-tts">
              <span>🔊</span> ${audioLabel}
            </button>
          </div>
        </div>

        <div class="grid-sidebar">
          <!-- Visual Box -->
          <div class="scan-visualizer-box">
            <img src="${scan.thumbnail}" alt="${sTitle}" class="scan-image-preview" />
          </div>

          <!-- AI Findings Panel -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:16px;">
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid var(--border);">
                <span style="font-size:0.86rem; font-weight:600; color:var(--text-muted);">${t('confidence_level')}:</span>
                <strong style="color:var(--primary); font-size:1.05rem;">${scan.confidence}</strong>
              </div>

              <div style="background:var(--bg-subtle); border-radius:var(--radius-md); padding:14px; margin-bottom:14px;">
                <strong style="font-size:0.84rem; color:var(--text-muted); text-transform:uppercase;">
                  ${t('report_findings_title')}
                </strong>
                <p style="font-size:0.92rem; margin-top:6px; line-height:1.5; font-weight:500;">
                  ${findingsText}
                </p>
              </div>

              <!-- Metric Badges -->
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${scan.keyMetrics.map(m => {
                  const lbl = typeof m.label === 'object' ? (m.label[currentLang] || m.label.en) : m.label;
                  const val = typeof m.value === 'object' ? (m.value[currentLang] || m.value.en) : m.value;
                  return `
                    <div style="display:flex; justify-content:space-between; font-size:0.86rem; background:var(--bg-card); border:1px solid var(--border); padding:8px 12px; border-radius:var(--radius-sm);">
                      <span style="color:var(--text-muted);">${lbl}:</span>
                      <strong>${val}</strong>
                    </div>
                  `;
                }).join('')}
              </div>

              <div style="margin-top:14px; font-size:0.84rem; color:var(--text-muted); line-height:1.4;">
                <strong>${noteHeading}</strong> ${sRec}
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
              ${isCritical ? `
                <button id="scan-emergency-btn" class="btn btn-emergency">
                  🚨 ${t('trigger_emergency_btn')}
                </button>
              ` : ''}
              <button id="scan-forward-btn" class="btn btn-primary">
                ${t('send_to_doctor_btn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    container.querySelectorAll('.sample-scan-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        selectedScan = sampleScans.find(s => s.id === id);
        container.querySelectorAll('.sample-scan-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        const inspectArea = container.querySelector('#scan-inspection-area');
        if (inspectArea) {
          inspectArea.innerHTML = renderScanDetails(selectedScan);
          attachInspectionEvents();
        }
      });
    });

    const dropzone = container.querySelector('#file-dropzone');
    const fileInput = container.querySelector('#file-input');
    const browseBtn = container.querySelector('#browse-btn');

    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
    }

    if (dropzone && fileInput) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-active');
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-active');
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-active');
        if (e.dataTransfer.files.length) {
          handleUploadedFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
          handleUploadedFile(e.target.files[0]);
        }
      });
    }

    attachInspectionEvents();
  }

  function handleUploadedFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const customScan = {
        id: "scan_custom_" + Date.now(),
        type: "Uploaded Clinical Report / Scan",
        title: {
          en: `Uploaded Image Analysis: ${file.name}`,
          ta: `பதிவேற்றப்பட்ட அறிக்கை பகுப்பாய்வு: ${file.name}`,
          hi: `अपलोड की गई फ़ाइल विश्लेषण: ${file.name}`
        },
        patientName: "Rural Patient Record (Manual Upload)",
        category: "Point-of-Care Scan",
        thumbnail: event.target.result,
        findings: {
          en: `Simulated AI Vision detected abnormal tissue contrast density and border irregularities in uploaded file (${file.name}). Recommended for manual physician correlation.`,
          ta: `பதிவேற்றப்பட்ட கோப்பில் (${file.name}) திசு அடர்த்தி மற்றும் எல்லைகளில் முரண்பாடுகள் கண்டறியப்பட்டுள்ளன. மருத்துவரின் உறுதிப்படுத்தல் தேவை.`,
          hi: `अपलोड की गई फ़ाइल (${file.name}) में असमान ऊतक घनत्व और अनियमित सीमाएं पाई गई हैं। डॉक्टर द्वारा पुष्टि आवश्यक है।`
        },
        abnormality: {
          en: "Moderate Risk - Anomaly Detected",
          ta: "மிதமான அபாயம் - அசாதாரண நிலை கண்டறியப்பட்டது",
          hi: "मध्यम जोखिम - असामान्यता पाई गई"
        },
        confidence: "89.4%",
        riskScore: 68,
        keyMetrics: [
          {
            label: { en: "File Processed", ta: "பகுப்பாய்வு செய்யப்பட்ட கோப்பு", hi: "फ़ाइल" },
            value: { en: file.name, ta: file.name, hi: file.name }
          },
          {
            label: { en: "OCR Confidence", ta: "OCR துல்லியம்", hi: "सटीकता" },
            value: { en: "92.1%", ta: "92.1%", hi: "92.1%" }
          }
        ],
        recommendation: {
          en: "Uploaded document queued for primary health centre medical officer tele-verification.",
          ta: "பதிவேற்றப்பட்ட அறிக்கை ஆரம்ப சுகாதார நிலைய மருத்துவரின் பார்வைக்காக வரிசைப்படுத்தப்பட்டது.",
          hi: "दस्तावेज़ डॉक्टर के सत्यापन हेतु कतार में जोड़ा गया।"
        }
      };

      selectedScan = customScan;
      const inspectArea = container.querySelector('#scan-inspection-area');
      if (inspectArea) {
        inspectArea.innerHTML = renderScanDetails(selectedScan);
        attachInspectionEvents();
      }
    };

    reader.readAsDataURL(file);
  }

  function attachInspectionEvents() {
    const ttsBtn = container.querySelector('#scan-tts-btn');
    if (ttsBtn && selectedScan) {
      ttsBtn.addEventListener('click', () => {
        const sTitle = typeof selectedScan.title === 'object' ? (selectedScan.title[currentLang] || selectedScan.title.en) : selectedScan.title;
        const text = `${sTitle}. ${selectedScan.findings[currentLang] || selectedScan.findings.en}`;
        speechService.toggle(text, currentLang, ttsBtn);
      });
    }

    const forwardBtn = container.querySelector('#scan-forward-btn');
    if (forwardBtn && selectedScan) {
      forwardBtn.addEventListener('click', () => {
        const sTitle = typeof selectedScan.title === 'object' ? (selectedScan.title[currentLang] || selectedScan.title.en) : selectedScan.title;
        const sAbnormality = typeof selectedScan.abnormality === 'object' ? (selectedScan.abnormality[currentLang] || selectedScan.abnormality.en) : selectedScan.abnormality;

        onForwardToDoctor({
          id: 'SCAN-' + Math.floor(1000 + Math.random() * 9000),
          patientName: selectedScan.patientName,
          village: currentLang === 'ta' ? "கள்ளக்குறிச்சி ஆரம்ப சுகாதார நிலையம்" : "District PHC Field",
          selectedSymptoms: [sAbnormality],
          score: selectedScan.riskScore,
          level: selectedScan.riskScore > 75 ? 'high' : selectedScan.riskScore > 35 ? 'medium' : 'low',
          scanTitle: sTitle,
          scanConfidence: selectedScan.confidence,
          time: currentLang === 'ta' ? "சற்றுமுன்" : "Just now",
          criticalReasons: selectedScan.riskScore > 75 ? [sAbnormality] : [],
          vitalFlags: [{ status: "warning", msg: `${sAbnormality}` }]
        });
      });
    }

    const emergBtn = container.querySelector('#scan-emergency-btn');
    if (emergBtn) {
      emergBtn.addEventListener('click', onTriggerEmergency);
    }
  }

  render();
}
