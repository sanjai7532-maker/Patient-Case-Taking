// Doctor Tele-Triage Dashboard Component
import { speechService } from '../speech.js';

export function renderDoctorDashboard(container, { currentLang, t, patientQueue, onUpdateQueue, onTriggerEmergency }) {
  let activeFilter = "all";
  let activePatientModal = null;

  function render() {
    const totalCount = patientQueue.length;
    const highRiskCount = patientQueue.filter(p => p.level === 'high' && !p.resolved).length;
    const medRiskCount = patientQueue.filter(p => p.level === 'medium' && !p.resolved).length;

    // Filter patients
    const filteredPatients = patientQueue.filter(p => {
      if (activeFilter === "high") return p.level === "high" && !p.resolved;
      if (activeFilter === "medium") return p.level === "medium" && !p.resolved;
      if (activeFilter === "low") return p.level === "low" && !p.resolved;
      return true;
    });

    const queueHeading = currentLang === 'ta' ? 'நேரலை நோயாளி முன்னுரிமை வரிசை' : currentLang === 'hi' ? 'रीयल-टाइम मरीज प्राथमिकता सूची' : 'Live Triage Priority Queue';
    const hospitalLabel = currentLang === 'ta' ? 'மருத்துவமனை: கள்ளக்குறிச்சி அரசு ஆரம்ப சுகாதார நிலையம் • டாக்டர் ஏ. வர்மா' : 'Hospital: Kallakurichi Taluk PHC • Dr. A. Varma, MD';
    const statusCol = currentLang === 'ta' ? 'நிலை' : currentLang === 'hi' ? 'स्थिति' : 'Status';

    container.innerHTML = `
      <div class="page-intro">
        <div>
          <h2 class="page-title">
            <span>👨‍⚕️</span> ${t('doc_title')}
          </h2>
          <p class="page-description">${t('doc_desc')}</p>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <span style="font-size:0.86rem; color:var(--text-muted);">
            <strong>${hospitalLabel}</strong>
          </span>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="doctor-stats-row">
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background:var(--primary-surface); color:var(--primary);">👥</div>
          <div class="stat-info">
            <h4>${t('stat_total')}</h4>
            <div class="stat-value">${totalCount}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap" style="background:var(--risk-high-bg); color:var(--risk-high);">🚨</div>
          <div class="stat-info">
            <h4>${t('stat_high_risk')}</h4>
            <div class="stat-value" style="color:var(--risk-high);">${highRiskCount}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap" style="background:var(--risk-medium-bg); color:var(--risk-medium);">🏥</div>
          <div class="stat-info">
            <h4>${t('stat_phc_referrals')}</h4>
            <div class="stat-value">${patientQueue.filter(p => p.referred).length}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap" style="background:var(--secondary-surface); color:var(--secondary);">⏱️</div>
          <div class="stat-info">
            <h4>${t('stat_avg_response')}</h4>
            <div class="stat-value">6.5 min</div>
          </div>
        </div>
      </div>

      <!-- Main Triage Queue Card -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:18px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <h3 style="font-size:1.15rem; font-weight:700;">${queueHeading}</h3>
            <span class="badge ${highRiskCount > 0 ? 'badge-risk-high' : 'badge-risk-low'}">
              ${highRiskCount} ${currentLang === 'ta' ? 'அவசரம்' : 'Urgent'}
            </span>
          </div>

          <!-- Filters -->
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" data-filter="all">
              ${t('filter_all')} (${totalCount})
            </button>
            <button class="btn btn-sm ${activeFilter === 'high' ? 'btn-emergency' : 'btn-secondary'}" data-filter="high">
              🚨 ${t('filter_high')} (${highRiskCount})
            </button>
            <button class="btn btn-sm ${activeFilter === 'medium' ? 'btn-primary' : 'btn-secondary'}" data-filter="medium">
              ${t('filter_medium')} (${medRiskCount})
            </button>
            <button class="btn btn-sm ${activeFilter === 'low' ? 'btn-primary' : 'btn-secondary'}" data-filter="low">
              ${t('filter_low')}
            </button>
          </div>
        </div>

        <!-- Patients Table -->
        <div class="triage-table-container">
          <table class="triage-table">
            <thead>
              <tr>
                <th>${t('col_patient')}</th>
                <th>${t('col_symptoms')}</th>
                <th>${t('col_vitals')}</th>
                <th>${t('col_risk')}</th>
                <th>${statusCol}</th>
                <th>${t('col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPatients.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align:center; padding:32px; color:var(--text-muted);">
                    ${currentLang === 'ta' ? 'இந்த பிரிவில் நோயாளிகள் இல்லை.' : 'No patients currently matching this filter criteria.'}
                  </td>
                </tr>
              ` : filteredPatients.map(p => renderPatientRow(p)).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Patient Review Modal Dialog (if open) -->
      ${activePatientModal ? renderPatientReviewModal(activePatientModal) : ''}
    `;

    attachEvents();
  }

  function renderPatientRow(p) {
    const isHigh = p.level === 'high';
    const isMed = p.level === 'medium';
    const badgeClass = isHigh ? 'badge-risk-high' : isMed ? 'badge-risk-medium' : 'badge-risk-low';
    const levelName = isHigh ? t('risk_high') : isMed ? t('risk_medium') : t('risk_low');

    const symptomsList = p.selectedSymptoms && p.selectedSymptoms.length > 0 
      ? p.selectedSymptoms.slice(0, 3).join(', ')
      : (currentLang === 'ta' ? "உடல் நலம் சரியில்லை" : "General malaise");

    const vitalsStr = `SpO2: ${p.spo2 || 98}% | BP: ${p.sysBp || 120}/${p.diaBp || 80}`;

    return `
      <tr style="${p.resolved ? 'opacity:0.6;' : ''}">
        <td>
          <div class="patient-avatar-cell">
            <div class="patient-avatar-circle" style="${isHigh ? 'border:2px solid #ef4444; color:#ef4444;' : ''}">
              ${isHigh ? '⚠️' : p.isMediKioskRecord ? '🏥' : '👤'}
            </div>
            <div>
              <strong style="font-size:0.92rem; display:block;">${p.patientName}</strong>
              <small style="color:var(--text-muted);">${p.village} • ${p.time || '10m ago'}</small>
              ${p.isMediKioskRecord ? `<span class="badge" style="background:#ecfdf5; color:#047857; font-size:0.68rem; margin-top:2px; font-weight:700;">🏥 MediKiosk ABDM Intake</span>` : ''}
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight:500; font-size:0.86rem;">${symptomsList}</div>
          ${p.scanTitle ? `<small style="color:var(--secondary); font-weight:600;">📎 ${p.scanTitle}</small>` : ''}
          ${p.medikioskSummary ? `<small style="color:var(--primary); font-weight:600; display:block;">✓ HPI: ${p.medikioskSummary.chiefComplaintText}</small>` : ''}
        </td>
        <td>
          <div style="font-size:0.84rem; font-family:monospace;">${vitalsStr}</div>
          <small style="color:var(--text-muted);">${p.temperature || 98.6}°F | Pulse: ${p.pulse || 76}</small>
        </td>
        <td>
          <span class="badge ${badgeClass}">${levelName} (${p.score || 50})</span>
        </td>
        <td>
          ${p.resolved ? `
            <span style="color:var(--primary); font-weight:700; font-size:0.82rem;">✓ ${currentLang === 'ta' ? 'பரிசோதிக்கப்பட்டது' : 'Completed'}</span>
          ` : p.referred ? `
            <span style="color:var(--secondary); font-weight:700; font-size:0.82rem;">🚑 ${currentLang === 'ta' ? 'மருத்துவமனைக்கு மாற்றம்' : 'Hospital Dispatched'}</span>
          ` : `
            <span style="color:var(--text-muted); font-size:0.82rem;">● ${currentLang === 'ta' ? 'காத்திருக்கிறது' : 'Awaiting Review'}</span>
          `}
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-primary review-patient-btn" data-id="${p.id}">
              ${t('review_btn')}
            </button>
            ${isHigh && !p.referred ? `
              <button class="btn btn-sm btn-emergency direct-refer-btn" data-id="${p.id}">
                🚨 108
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }

  function renderPatientReviewModal(p) {
    const modalTitle = currentLang === 'ta' ? `மருத்துவ மறுஆய்வு: ${p.patientName}` : `Clinical Patient Review: ${p.patientName}`;
    const defaultNotes = currentLang === 'ta'
      ? 'நோயாளி AI தொலை மருத்துவ முறையில் பரிசோதிக்கப்பட்டார். ஓய்வு மற்றும் மருந்து நெறிமுறை வழங்கப்பட்டது.'
      : 'Patient evaluated via AI tele-triage. Prescribed supportive hydration and symptomatic protocol.';

    const mk = p.medikioskSummary;

    return `
      <div class="modal-overlay" id="patient-modal-overlay">
        <div class="modal-dialog" style="${mk ? 'max-width:780px;' : ''}">
          <div class="modal-header">
            <h3 class="modal-title">
              <span>📋</span> ${modalTitle}
            </h3>
            <button class="modal-close-btn" id="modal-close-btn">✕</button>
          </div>

          <!-- Time Saved Callout for MediKiosk -->
          ${mk ? `
            <div style="background:linear-gradient(135deg, #ecfdf5, #f0fdf4); border:1px solid #a7f3d0; border-radius:var(--radius-md); padding:12px 16px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:1.4rem;">⏱️</span>
                <div>
                  <strong style="color:#065f46; font-size:0.92rem; display:block;">MediKiosk Intake: 3 min 48 sec Consultation Time Reclaimed!</strong>
                  <small style="color:#047857;">Structured SOCRATES History & Multi-lingual OCR digitizations pre-loaded. Doctor reviews in under 15 seconds.</small>
                </div>
              </div>
              <span class="badge badge-risk-low" style="font-size:0.75rem;">ABHA: ${mk.abhaId || '91-4829-1029-4821'}</span>
            </div>
          ` : ''}

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span class="badge ${p.level === 'high' ? 'badge-risk-high' : p.level === 'medium' ? 'badge-risk-medium' : 'badge-risk-low'}">
              ${t('risk_score_label')}: ${p.score}/100 • ${p.level.toUpperCase()}
            </span>
            <small style="color:var(--text-muted);">${p.village} | ID: ${p.id}</small>
          </div>

          <!-- Vitals Summary Grid -->
          <div class="grid-3" style="margin-bottom:16px;">
            <div style="background:var(--bg-subtle); padding:10px; border-radius:var(--radius-sm); text-align:center;">
              <small style="color:var(--text-muted); display:block;">SpO2 Saturation</small>
              <strong style="font-size:1.1rem; color:${p.spo2 < 92 ? 'var(--risk-high)' : 'var(--primary)'};">
                ${p.spo2 || 98}%
              </strong>
            </div>
            <div style="background:var(--bg-subtle); padding:10px; border-radius:var(--radius-sm); text-align:center;">
              <small style="color:var(--text-muted); display:block;">Blood Pressure</small>
              <strong style="font-size:1.1rem;">${p.sysBp || 120} / ${p.diaBp || 80}</strong>
            </div>
            <div style="background:var(--bg-subtle); padding:10px; border-radius:var(--radius-sm); text-align:center;">
              <small style="color:var(--text-muted); display:block;">Body Temp</small>
              <strong style="font-size:1.1rem;">${p.temperature || 98.6}°F</strong>
            </div>
          </div>

          <!-- Rich MediKiosk Clinical Intake Section (if available) -->
          ${mk ? `
            <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:14px; margin-bottom:16px;">
              <div style="font-weight:700; font-size:0.95rem; color:var(--text-main); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                <span>🩺</span> Chief Complaint & History of Present Illness (HPI)
              </div>
              <p style="font-size:0.86rem; line-height:1.5; color:var(--text-main); background:var(--bg-subtle); padding:10px; border-radius:var(--radius-sm);">
                ${mk.hpiSummary}
              </p>

              ${mk.ayush ? `
                <div style="margin-top:10px; padding:10px; background:#fefce8; border:1px solid #fef08a; border-radius:var(--radius-sm);">
                  <strong style="color:#854d0e; font-size:0.86rem;">🌿 Ayurvedic Dashavidha Pariksha Intake:</strong>
                  <div style="font-size:0.84rem; color:#713f12; margin-top:4px;">${mk.ayush.summaryText}</div>
                </div>
              ` : ''}

              <!-- Extracted Allergies & Labs -->
              <div class="grid-2 gap-12" style="margin-top:10px;">
                <div style="background:var(--risk-high-bg); border:1px solid var(--risk-high-border); padding:10px; border-radius:var(--radius-sm);">
                  <strong style="color:var(--risk-high); font-size:0.82rem; display:block;">⚠️ Allergies from Prior Records:</strong>
                  <div style="font-size:0.82rem; color:var(--risk-high-text); font-weight:600; margin-top:2px;">
                    ${mk.allergies.join(', ')}
                  </div>
                </div>

                <div style="background:#fffbeb; border:1px solid #fde68a; padding:10px; border-radius:var(--radius-sm);">
                  <strong style="color:#92400e; font-size:0.82rem; display:block;">🔬 Abnormal Investigation Flags:</strong>
                  <div style="font-size:0.8rem; color:#78350f; margin-top:2px;">
                    ${mk.abnormalInvestigations.slice(0, 2).join(' • ')}
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Clinical Flags -->
          ${p.criticalReasons && p.criticalReasons.length > 0 ? `
            <div style="background:var(--risk-high-bg); border:1px solid var(--risk-high-border); border-radius:var(--radius-md); padding:12px; margin-bottom:16px;">
              <strong style="color:var(--risk-high); font-size:0.86rem;">⚠️ ${currentLang === 'ta' ? 'தீவிர எச்சரிக்கை காரணங்கள்:' : 'Critical Findings:'}</strong>
              <div style="font-size:0.84rem; color:var(--risk-high-text); margin-top:4px;">
                ${p.criticalReasons.map(r => typeof r === 'object' ? (r[currentLang] || r.en) : r).join(' • ')}
              </div>
            </div>
          ` : ''}

          <!-- Doctor's e-Prescription & Notes -->
          <div class="form-group" style="margin-top:16px;">
            <label class="form-label">${currentLang === 'ta' ? 'மருத்துவரின் குறிப்புகள் & பரிசோதனை முடிவு:' : "Doctor's Clinical Notes & Diagnosis:"}</label>
            <textarea id="doctor-notes-input" class="form-textarea" rows="3">${p.doctorNotes || defaultNotes}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">${currentLang === 'ta' ? 'விரைவு மின்னணு மருந்துச் சீட்டு (e-Prescription):' : 'Fast e-Prescription Items:'}</label>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              <label class="symptom-chip selected"><input type="checkbox" checked style="margin-right:6px;" /> Tab Paracetamol 500mg</label>
              <label class="symptom-chip"><input type="checkbox" style="margin-right:6px;" /> Cap Amoxicillin 500mg</label>
              <label class="symptom-chip selected"><input type="checkbox" checked style="margin-right:6px;" /> ORS Sachets</label>
              <label class="symptom-chip"><input type="checkbox" style="margin-right:6px;" /> Salbutamol Inhaler</label>
            </div>
          </div>

          <!-- Actions -->
          <div style="display:flex; justify-content:space-between; gap:12px; margin-top:20px; flex-wrap:wrap;">
            <button id="modal-refer-btn" class="btn btn-emergency">
              🚑 ${currentLang === 'ta' ? 'மாவட்ட மருத்துவமனைக்கு மாற்று (108)' : 'Transfer to District Hospital (108)'}
            </button>
            <div style="display:flex; gap:10px;">
              <button id="modal-resolve-btn" class="btn btn-primary">
                ✓ ${currentLang === 'ta' ? 'மருந்துச் சீட்டு வழங்கி முடி' : 'Issue Prescription & Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    container.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-filter');
        render();
      });
    });

    container.querySelectorAll('.review-patient-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        activePatientModal = patientQueue.find(p => p.id === id);
        render();
      });
    });

    container.querySelectorAll('.direct-refer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const pat = patientQueue.find(p => p.id === id);
        if (pat) {
          pat.referred = true;
          onUpdateQueue([...patientQueue]);
          onTriggerEmergency();
          render();
        }
      });
    });

    const closeBtn = container.querySelector('#modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        activePatientModal = null;
        render();
      });
    }

    const overlay = container.querySelector('#patient-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          activePatientModal = null;
          render();
        }
      });
    }

    const resolveBtn = container.querySelector('#modal-resolve-btn');
    if (resolveBtn && activePatientModal) {
      resolveBtn.addEventListener('click', () => {
        const notes = container.querySelector('#doctor-notes-input').value;
        activePatientModal.doctorNotes = notes;
        activePatientModal.resolved = true;
        onUpdateQueue([...patientQueue]);
        activePatientModal = null;
        render();
      });
    }

    const referBtn = container.querySelector('#modal-refer-btn');
    if (referBtn && activePatientModal) {
      referBtn.addEventListener('click', () => {
        activePatientModal.referred = true;
        onUpdateQueue([...patientQueue]);
        activePatientModal = null;
        onTriggerEmergency();
        render();
      });
    }
  }

  render();
}
