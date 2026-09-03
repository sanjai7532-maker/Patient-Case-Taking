// Doctor Appointments & Tele-Consultation Scheduling Component

export const AVAILABLE_DOCTORS = [
  {
    id: "doc_1",
    name: "Dr. K. Arulmani, MBBS, MD",
    specialty: {
      en: "General Medicine & Rural Triage",
      ta: "பொது மருத்துவம் & கிராமப்புற பரிசோதனை",
      hi: "सामान्य चिकित्सा एवं ग्रामीण ट्राइएज"
    },
    phc: "Kallakurichi Taluk PHC",
    experience: "14 years exp",
    avatarText: "KA",
    availableToday: true,
    slots: ["10:00 AM", "11:30 AM", "02:15 PM", "04:00 PM"]
  },
  {
    id: "doc_2",
    name: "Dr. Sunita Deshmukh, MS (OB-GYN)",
    specialty: {
      en: "Maternal Health & High-Risk Pregnancy",
      ta: "தாய்-சேய் நலம் & உயர் ஆபத்து மகப்பேறு",
      hi: "मातृ स्वास्थ्य एवं उच्च जोखिम गर्भावस्था"
    },
    phc: "District Community Health Centre",
    experience: "11 years exp",
    avatarText: "SD",
    availableToday: true,
    slots: ["10:30 AM", "12:00 PM", "03:30 PM"]
  },
  {
    id: "doc_3",
    name: "Dr. Rajesh Kannan, MD (Pediatrics)",
    specialty: {
      en: "Child Health, Neonatal Care & Nutrition",
      ta: "குழந்தைகள் நலம், பச்சிளங்குழந்தை பராமரிப்பு",
      hi: "बाल स्वास्थ्य एवं शिशु पोषण"
    },
    phc: "Regional Sub-Divisional Hospital",
    experience: "9 years exp",
    avatarText: "RK",
    availableToday: true,
    slots: ["09:30 AM", "01:00 PM", "05:00 PM"]
  },
  {
    id: "doc_4",
    name: "Dr. Priya Sharma, DNB (Cardiology)",
    specialty: {
      en: "Tele-Cardiology & Arrhythmia Consult",
      ta: "தொலைதூர இதய சிறப்பு மருத்துவம் & இசிஜி ஆலோசனை",
      hi: "टेली-कार्डियोलॉजी एवं हृदय रोग विशेषज्ञ"
    },
    phc: "State Rural Telemedicine Network",
    experience: "16 years exp",
    avatarText: "PS",
    availableToday: false,
    slots: ["Tomorrow 11:00 AM", "Tomorrow 03:00 PM"]
  }
];

export function renderAppointmentBooking(container, { currentLang, t, onShowToast }) {
  let selectedDoctor = AVAILABLE_DOCTORS[0];
  let selectedSlot = selectedDoctor.slots[0];
  let bookedAppointment = null;

  function render() {
    const confirmHeading = currentLang === 'ta' ? 'ஆலோசனை விவரங்களை உறுதிப்படுத்தவும்' : currentLang === 'hi' ? 'परामर्श विवरण की पुष्टि करें' : 'Confirm Consultation Details';
    const selDocLabel = currentLang === 'ta' ? 'தேர்வு செய்யப்பட்ட மருத்துவர்:' : currentLang === 'hi' ? 'चयनित चिकित्सा अधिकारी:' : 'Selected Medical Officer:';
    const patientNameLabel = currentLang === 'ta' ? 'நோயாளி பெயர் & கிராமம்:' : currentLang === 'hi' ? 'मरीज का नाम और गांव:' : 'Patient Name & Village:';
    const phoneLabel = currentLang === 'ta' ? 'தொடர்பு / வாட்ஸ்அப் எண் (SMS டோக்கனுக்கு):' : currentLang === 'hi' ? 'मोबाइल नंबर (एसएमएस हेतु):' : 'Contact / WhatsApp Number (for SMS token):';
    const reasonLabel = currentLang === 'ta' ? 'ஆலோசனைக்கான காரணம்:' : currentLang === 'hi' ? 'परामर्श का कारण:' : 'Reason for Consultation:';
    const slotsLabel = currentLang === 'ta' ? 'கிடைக்கும் நேரங்கள்:' : currentLang === 'hi' ? 'उपलब्ध समय:' : 'Available Slots:';
    const roomBtnLabel = currentLang === 'ta' ? '📹 வீடியோ தொலை மருத்துவ அறையை திற' : currentLang === 'hi' ? '📹 वीडियो परामर्श कक्ष खोलें' : '📹 Open Simulated Teleconsultation Room';

    const docSpec = typeof selectedDoctor.specialty === 'object' ? (selectedDoctor.specialty[currentLang] || selectedDoctor.specialty.en) : selectedDoctor.specialty;

    container.innerHTML = `
      <div class="page-intro">
        <div>
          <h2 class="page-title">
            <span>📅</span> ${t('appointments_title')}
          </h2>
          <p class="page-description">${t('appointments_desc')}</p>
        </div>
      </div>

      <div class="grid-sidebar">
        <!-- Left: Doctor Cards -->
        <div>
          <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:14px;">
            ${t('select_doctor_label')}
          </h3>

          <div class="doctor-cards-grid">
            ${AVAILABLE_DOCTORS.map(doc => {
              const isSelected = selectedDoctor && selectedDoctor.id === doc.id;
              const sSpec = typeof doc.specialty === 'object' ? (doc.specialty[currentLang] || doc.specialty.en) : doc.specialty;
              return `
                <div class="doctor-profile-card ${isSelected ? 'selected' : ''}" style="${isSelected ? 'border-color:var(--primary); box-shadow:0 0 0 2px var(--primary);' : ''}" data-doc-id="${doc.id}">
                  <div class="doc-header-row">
                    <div class="doc-avatar">${doc.avatarText}</div>
                    <div>
                      <div class="doc-name">${doc.name}</div>
                      <div class="doc-specialty">${sSpec}</div>
                    </div>
                  </div>

                  <div style="font-size:0.82rem; color:var(--text-muted); display:flex; justify-content:space-between; margin-top:4px;">
                    <span>🏥 ${doc.phc}</span>
                    <span style="color:var(--primary); font-weight:600;">${doc.experience}</span>
                  </div>

                  <div style="margin-top:8px;">
                    <small style="font-weight:600; color:var(--text-muted);">${slotsLabel}</small>
                    <div class="slot-pills-row">
                      ${doc.slots.map(s => `
                        <button type="button" class="slot-pill ${isSelected && selectedSlot === s ? 'active' : ''}" data-slot="${s}">
                          ${s}
                        </button>
                      `).join('')}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right: Booking Form & Teleconsult Room -->
        <div class="card">
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
            <span>📝</span> ${confirmHeading}
          </h3>

          <form id="booking-form">
            <div class="form-group">
              <label class="form-label">${selDocLabel}</label>
              <div style="padding:10px 14px; background:var(--bg-subtle); border-radius:var(--radius-sm); font-weight:600;">
                ${selectedDoctor.name} (${docSpec})
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">${t('select_time_label')}</label>
              <div style="padding:10px 14px; background:var(--bg-subtle); border-radius:var(--radius-sm); font-weight:600; color:var(--primary);">
                🕒 ${selectedSlot}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">${patientNameLabel}</label>
              <input type="text" id="patient-name-input" class="form-input" value="${currentLang === 'ta' ? 'சரஸ்வதி அம்மாள், கள்ளக்குறிச்சி' : 'Saraswathi Ammal, Kallakurichi'}" required />
            </div>

            <div class="form-group">
              <label class="form-label">${phoneLabel}</label>
              <input type="tel" id="patient-phone-input" class="form-input" value="+91 98401 23456" required />
            </div>

            <div class="form-group">
              <label class="form-label">${reasonLabel}</label>
              <input type="text" id="consult-reason-input" class="form-input" value="${currentLang === 'ta' ? 'உயர் இரத்த அழுத்தம் மற்றும் தொடர் இருமல் பரிசோதனை' : 'Follow-up on elevated blood pressure and chronic cough'}" />
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">
              ${t('book_now_btn')}
            </button>
          </form>

          ${bookedAppointment ? `
            <div style="margin-top:20px; background:var(--primary-surface); border:1px solid var(--primary-border); border-radius:var(--radius-md); padding:16px;">
              <div style="display:flex; align-items:center; gap:8px; color:var(--primary-dark); font-weight:700; margin-bottom:6px;">
                <span>✓</span> ${t('booking_success')}
              </div>
              <p style="font-size:0.86rem; color:var(--text-muted); line-height:1.4;">
                ${currentLang === 'ta' ? `டோக்கன் <strong>#PHC-${bookedAppointment.token}</strong> மருத்துவர் <strong>${bookedAppointment.doctor}</strong> உடன் <strong>${bookedAppointment.slot}</strong> நேரத்தில் பதிவு செய்யப்பட்டது.` : `Token <strong>#PHC-${bookedAppointment.token}</strong> reserved with <strong>${bookedAppointment.doctor}</strong> at <strong>${bookedAppointment.slot}</strong>.`}
              </p>
              <div style="margin-top:12px;">
                <button id="launch-teleconsult-btn" class="btn btn-secondary btn-sm" style="width:100%;">
                  ${roomBtnLabel}
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Teleconsultation Video Room Modal -->
      <div id="teleconsult-modal-container"></div>
    `;

    attachEvents();
  }

  function attachEvents() {
    container.querySelectorAll('.doctor-profile-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const slotBtn = e.target.closest('.slot-pill');
        const docId = card.getAttribute('data-doc-id');
        selectedDoctor = AVAILABLE_DOCTORS.find(d => d.id === docId);

        if (slotBtn) {
          selectedSlot = slotBtn.getAttribute('data-slot');
        } else {
          selectedSlot = selectedDoctor.slots[0];
        }
        render();
      });
    });

    const form = container.querySelector('#booking-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pName = container.querySelector('#patient-name-input').value;
        const phone = container.querySelector('#patient-phone-input').value;

        bookedAppointment = {
          token: Math.floor(1000 + Math.random() * 9000),
          doctor: selectedDoctor.name,
          slot: selectedSlot,
          patient: pName,
          phone: phone
        };

        const successMsg = currentLang === 'ta' 
          ? `மருத்துவர் ${selectedDoctor.name} உடன் சந்திப்பு உறுதியானது! டோக்கன் #PHC-${bookedAppointment.token}`
          : `Appointment confirmed with ${selectedDoctor.name}! Token #PHC-${bookedAppointment.token}`;

        onShowToast("success", successMsg);
        render();
      });
    }

    const launchBtn = container.querySelector('#launch-teleconsult-btn');
    if (launchBtn && bookedAppointment) {
      launchBtn.addEventListener('click', () => {
        openTeleconsultRoom(bookedAppointment);
      });
    }
  }

  function openTeleconsultRoom(appmt) {
    const modalContainer = container.querySelector('#teleconsult-modal-container');
    if (!modalContainer) return;

    const patientLabel = currentLang === 'ta' ? 'நோயாளி (நீங்கள்)' : 'Patient (You)';
    const micLabel = currentLang === 'ta' ? '🎤 மைக் நிறுத்து' : '🎤 Mute Mic';
    const camLabel = currentLang === 'ta' ? '📹 கேமரா மாற்று' : '📹 Toggle Camera';
    const endLabel = currentLang === 'ta' ? '📞 ஆலோசனையை முடி' : '📞 End Consultation';
    const onlineStatus = currentLang === 'ta' ? '● பாதுகாப்பான வீடியோ & ஆடியோ இணைப்பு இயங்குகிறது' : '● Secure WebRTC Audio/Video Active • Low Latency 2G/4G Mode';

    modalContainer.innerHTML = `
      <div class="modal-overlay" id="tele-modal-overlay">
        <div class="modal-dialog" style="max-width:700px;">
          <div class="modal-header">
            <h3 class="modal-title">
              <span>📹</span> ${currentLang === 'ta' ? 'தொலை மருத்துவ அறை:' : 'Teleconsultation Room:'} ${appmt.doctor}
            </h3>
            <button class="modal-close-btn" id="tele-close-btn">✕</button>
          </div>

          <!-- Video Simulation Screen -->
          <div style="background:#090d16; border-radius:var(--radius-md); height:320px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
            <div style="text-align:center; color:#fff;">
              <div style="font-size:3.5rem; margin-bottom:8px;">👨‍⚕️</div>
              <strong style="font-size:1.1rem; display:block;">${currentLang === 'ta' ? `${appmt.doctor} உடன் இணைக்கப்பட்டுள்ளது` : `Connected with ${appmt.doctor}`}</strong>
              <small style="color:#10b981; font-weight:600;">${onlineStatus}</small>
            </div>

            <!-- Self PIP (Picture in Picture) -->
            <div style="position:absolute; bottom:16px; right:16px; width:110px; height:80px; background:#1e293b; border:2px solid #38bdf8; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.75rem;">
              ${patientLabel}
            </div>
          </div>

          <!-- Call Controls -->
          <div style="display:flex; justify-content:center; gap:16px; margin-top:18px;">
            <button class="btn btn-secondary" id="tele-mute-btn">${micLabel}</button>
            <button class="btn btn-secondary" id="tele-cam-btn">${camLabel}</button>
            <button class="btn btn-emergency" id="tele-end-btn">${endLabel}</button>
          </div>
        </div>
      </div>
    `;

    const closeBtn = modalContainer.querySelector('#tele-close-btn');
    const endBtn = modalContainer.querySelector('#tele-end-btn');
    const overlay = modalContainer.querySelector('#tele-modal-overlay');

    const close = () => {
      modalContainer.innerHTML = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (endBtn) endBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  render();
}
