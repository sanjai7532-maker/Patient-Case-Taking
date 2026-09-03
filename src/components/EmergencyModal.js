// Emergency Red Alert Modal & Nearest Primary Health Centre (PHC) Locator

export function renderEmergencyModal(container, { currentLang, t, onClose }) {
  const firstAidGuides = {
    en: [
      "Keep the patient in a semi-reclined, comfortable position. Do not allow exertion.",
      "Ensure an open airway; loosen any restrictive clothing around chest and neck.",
      "If snakebite is suspected: Keep limb below heart level. Do NOT cut, tourniquet, or suction.",
      "If patient is conscious with chest pain and no allergy: 1 chewable Aspirin (300mg) can be administered under medical direction."
    ],
    ta: [
      "நோயாளியை சாய்ந்த நிலையில் வசதியாக உட்கார வைக்கவும்; நடக்கவோ அலையவோ விடாதீர்கள்.",
      "சுவாசம் தடையின்றி இருப்பதை உறுதி செய்யவும்; இறுக்கமான ஆடைகளை தளர்த்தவும்.",
      "பாம்புக்கடி எனில்: கடித்த பகுதியை இதய அளவிற்கு கீழே வைக்கவும்; கயிறு கொண்டு இறுக்க வேண்டாம்.",
      "108 ஆம்புலன்ஸ் வரும் வரை நோயாளியை தனியாக விடாமல் அமைதியாக வைத்திருக்கவும்."
    ],
    hi: [
      "मरीज को आरामदायक स्थिति में आधा लेटाएं; चलने या शारीरिक श्रम न करने दें।",
      "गले और सीने के टाइट कपड़ों को ढीला करें ताकि सांस लेने में रुकावट न हो।",
      "सांप काटने पर: अंग को दिल के स्तर से नीचे रखें; चीरा या कसकर पट्टी न बांधें।",
      "108 एम्बुलेंस आने तक मरीज के पास रहें और उन्हें शांत रखें।"
    ]
  };

  const checklist = firstAidGuides[currentLang] || firstAidGuides.en;

  container.innerHTML = `
    <div class="modal-overlay" id="emergency-overlay">
      <div class="modal-dialog modal-emergency">
        <div class="modal-header" style="border-color:var(--risk-high-border);">
          <h3 class="modal-title" style="color:var(--risk-high);">
            <span>🚨</span> ${t('emergency_modal_title')}
          </h3>
          <button class="modal-close-btn" id="emerg-modal-close-btn">✕</button>
        </div>

        <p style="font-size:0.92rem; color:var(--text-main); margin-bottom:18px; font-weight:500;">
          ${t('emergency_modal_desc')}
        </p>

        <!-- Big 108 Action Button -->
        <div style="text-align:center; margin-bottom:20px;">
          <a href="tel:108" class="btn btn-emergency" style="font-size:1.15rem; padding:16px 28px; width:100%; border-radius:var(--radius-lg); text-decoration:none;">
            ${t('call_108_immediate')}
          </a>
          <small style="display:block; margin-top:6px; color:var(--text-muted);">
            Toll-Free Emergency Helpline • 24x7 Government Ambulance Dispatch
          </small>
        </div>

        <!-- Ambulance Tracker Simulation -->
        <div style="background:var(--risk-high-bg); border:1px solid var(--risk-high-border); border-radius:var(--radius-md); padding:14px; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:10px; color:var(--risk-high); font-weight:700; font-size:0.9rem;">
            <span>🚑</span> 108 Ambulance Unit Fast Response
          </div>
          <div style="font-size:0.84rem; color:var(--risk-high-text); margin-top:4px;">
            Emergency Beacon Broadcast to Nearest PHC Dispatch Station: <strong>Kallakurichi Taluk</strong>. Estimated Ambulance Transit: <strong>~9 to 12 minutes</strong>.
          </div>
        </div>

        <!-- Nearest PHC Facilities -->
        <div style="margin-bottom:20px;">
          <h4 style="font-size:0.92rem; font-weight:700; margin-bottom:10px;">
            ${t('nearest_phc_title')}
          </h4>

          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="background:var(--bg-subtle); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="font-size:0.88rem; display:block;">Kallakurichi 24x7 Upgraded PHC</strong>
                <small style="color:var(--text-muted);">Emergency Oxygen, 4 Inpatient Beds, Emergency Drugs</small>
              </div>
              <div style="text-align:right;">
                <span class="badge badge-risk-low">3.8 km</span>
                <small style="display:block; color:var(--text-muted);">~8 mins</small>
              </div>
            </div>

            <div style="background:var(--bg-subtle); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="font-size:0.88rem; display:block;">Sankarapuram Community Health Centre (CHC)</strong>
                <small style="color:var(--text-muted);">Operation Theatre, Blood Storage, 24x7 Medical Officer</small>
              </div>
              <div style="text-align:right;">
                <span class="badge badge-risk-medium">8.5 km</span>
                <small style="display:block; color:var(--text-muted);">~18 mins</small>
              </div>
            </div>

            <div style="background:var(--bg-subtle); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="font-size:0.88rem; display:block;">Government Headquarters District Hospital</strong>
                <small style="color:var(--text-muted);">ICU, Anti-Snake Venom (ASV), Full Trauma Care</small>
              </div>
              <div style="text-align:right;">
                <span class="badge badge-risk-high">14.2 km</span>
                <small style="display:block; color:var(--text-muted);">~26 mins</small>
              </div>
            </div>
          </div>
        </div>

        <!-- First Aid Checklist -->
        <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:14px;">
          <h4 style="font-size:0.88rem; font-weight:700; margin-bottom:8px; color:var(--text-muted); text-transform:uppercase;">
            ${t('first_aid_title')}
          </h4>
          <ul style="padding-left:18px; font-size:0.84rem; line-height:1.5;">
            ${checklist.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top:20px; text-align:right;">
          <button class="btn btn-secondary" id="emerg-close-btn-bottom">
            Dismiss Alert Window
          </button>
        </div>
      </div>
    </div>
  `;

  const closeBtn = container.querySelector('#emerg-modal-close-btn');
  const closeBtnBottom = container.querySelector('#emerg-close-btn-bottom');
  const overlay = container.querySelector('#emergency-overlay');

  if (closeBtn) closeBtn.addEventListener('click', onClose);
  if (closeBtnBottom) closeBtnBottom.addEventListener('click', onClose);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) onClose();
    });
  }
}
