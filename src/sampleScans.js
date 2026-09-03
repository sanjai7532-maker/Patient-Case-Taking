// Sample Scans and Laboratory Data with realistic AI Computer Vision & OCR outputs
// Fully translated in English, தமிழ் (Tamil), and हिन्दी (Hindi)

export const sampleScans = [
  {
    id: "scan_pneumonia",
    type: "Chest X-Ray (CXR)",
    title: {
      en: "Chest X-Ray: Right Lower Lobe Consolidation",
      ta: "மார்பு எக்ஸ்-ரே: வலது கீழ் நுரையீரல் தொற்று உறைதல் (நிமோனியா)",
      hi: "चेस्ट एक्स-रे: दाहिने फेफड़े में गंभीर निमोनिया इन्फेक्शन"
    },
    patientName: "Murugan S. (58M, Thiruvarur)",
    category: "Radiology",
    thumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="%23020617"/>
      <path d="M100 80 Q200 40 300 80 Q350 200 320 280 L80 280 Q50 200 100 80 Z" fill="%230f172a" stroke="%23334155" stroke-width="2"/>
      <line x1="200" y1="50" x2="200" y2="280" stroke="%23475569" stroke-width="12" stroke-dasharray="8 4"/>
      <path d="M120 100 Q200 120 280 100 M110 130 Q200 150 290 130 M105 160 Q200 180 295 160 M100 190 Q200 210 300 190 M95 220 Q200 240 305 220" stroke="%23334155" stroke-width="6" fill="none" opacity="0.6"/>
      <path d="M170 140 C170 130 240 140 240 190 C240 230 190 240 160 210 Z" fill="%231e293b" opacity="0.8"/>
      <ellipse cx="260" cy="200" rx="45" ry="35" fill="%23f8fafc" opacity="0.75" filter="blur(6px)"/>
      <ellipse cx="260" cy="200" rx="35" ry="25" fill="%23ffffff" opacity="0.85"/>
      <rect x="205" y="155" width="110" height="90" fill="none" stroke="%23ef4444" stroke-width="3" stroke-dasharray="5 3"/>
      <text x="210" y="148" fill="%23ef4444" font-family="sans-serif" font-size="12" font-weight="bold">AI: Consolidation 94%</text>
      <text x="20" y="30" fill="%2394a3b8" font-family="sans-serif" font-size="14">CHEST AP VIEW - DIGITAL RADIOGRAPHY</text>
    </svg>`,
    findings: {
      en: "Dense patchy airspace consolidation in the right lower zone, consistent with Bacterial Lobar Pneumonia. Air bronchograms visible. Risk of hypoxia.",
      ta: "வலது கீழ் நுரையீரல் பகுதியில் அடர்த்தியான தொற்று உறைதல் (Consolidation) காணப்படுகிறது. பாக்டீரியா நிமோனியா இருப்பதற்கான 94% வாய்ப்பு. ஆக்ஸிஜன் அளவு குறையும் அபாயம்.",
      hi: "दाहिने निचले फेफड़े में सघन इन्फेक्शन (Lobar Pneumonia) दिखाई दे रहा है। सांस लेने में कमी और हाइपोक्सिया का गंभीर जोखिम।"
    },
    abnormality: {
      en: "High Risk - Acute Pulmonary Infection",
      ta: "அதிதீவிர அபாயம் - கடுமையான நுரையீரல் தொற்று",
      hi: "उच्च जोखिम - गंभीर फेफड़ों का संक्रमण"
    },
    confidence: "94.2%",
    riskScore: 88,
    keyMetrics: [
      {
        label: { en: "Consolidation Density", ta: "தொற்று அடர்த்தி", hi: "इन्फेक्शन घनत्व" },
        value: { en: "Severe (Right Basal)", ta: "தீவிரம் (வலது கீழ்)", hi: "गंभीर (निचला हिस्सा)" }
      },
      {
        label: { en: "Pleural Effusion", ta: "நுரையீரல் திரவக் கசிவு", hi: "फेफड़ों में पानी" },
        value: { en: "Minimal Reactive", ta: "லேசான திரவம்", hi: "हल्का तरल" }
      },
      {
        label: { en: "SpO2 Association", ta: "ஆக்சிஜன் அளவு தாக்கம்", hi: "ऑक्सीजन प्रभाव" },
        value: { en: "Risk if <93%", ta: "<93% குறைந்தால் ஆபத்து", hi: "<93% पर आपातकाल" }
      }
    ],
    recommendation: {
      en: "Immediate Primary Health Centre medical officer triage; commence oral/IV antibiotics as per protocol, monitor respiratory rate.",
      ta: "உடனடி ஆரம்ப சுகாதார நிலைய மருத்துவர் பரிசோதனை; நெறிமுறையின்படி ஆன்டிபயாடிக் மருந்துகள் மற்றும் ஆக்சிஜன் கண்காணிப்பு தொடங்கவும்.",
      hi: "पीएचसी डॉक्टर द्वारा तुरंत जांच; एंटीबायोटिक्स शुरू करें और सांस की गति पर नजर रखें।"
    }
  },

  {
    id: "scan_diabetes",
    type: "Blood Panel Report (CBC / Glycemic)",
    title: {
      en: "Comprehensive Metabolic & Glycemic Profile",
      ta: "முழு இரத்த சர்க்கரை மற்றும் வளர்சிதை மாற்ற அறிக்கை",
      hi: "रक्त शर्करा एवं मेटाबॉलिक जांच रिपोर्ट"
    },
    patientName: "Kamala Devi (52F, Sitapur)",
    category: "Lab Report",
    thumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="%23ffffff"/>
      <rect x="15" y="15" width="370" height="270" rx="6" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="1.5"/>
      <rect x="25" y="25" width="350" height="40" fill="%230284c7" rx="4"/>
      <text x="35" y="50" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">DISTRICT PHC DIAGNOSTIC LABORATORY</text>
      <line x1="25" y1="90" x2="375" y2="90" stroke="%2394a3b8" stroke-width="1"/>
      <text x="35" y="85" fill="%23475569" font-family="sans-serif" font-size="11" font-weight="bold">TEST NAME</text>
      <text x="180" y="85" fill="%23475569" font-family="sans-serif" font-size="11" font-weight="bold">RESULT</text>
      <text x="270" y="85" fill="%23475569" font-family="sans-serif" font-size="11" font-weight="bold">NORMAL RANGE</text>
      <text x="35" y="115" fill="%230f172a" font-family="sans-serif" font-size="12">Fasting Blood Sugar</text>
      <rect x="175" y="102" width="75" height="18" fill="%23fee2e2" rx="3"/>
      <text x="180" y="115" fill="%23b91c1c" font-family="sans-serif" font-size="12" font-weight="bold">284 mg/dL ⬆</text>
      <text x="270" y="115" fill="%2364748b" font-family="sans-serif" font-size="12">70 - 99 mg/dL</text>
      <text x="35" y="145" fill="%230f172a" font-family="sans-serif" font-size="12">Glycated Hb (HbA1c)</text>
      <rect x="175" y="132" width="75" height="18" fill="%23fee2e2" rx="3"/>
      <text x="180" y="145" fill="%23b91c1c" font-family="sans-serif" font-size="12" font-weight="bold">10.8 % ⬆</text>
      <text x="270" y="145" fill="%2364748b" font-family="sans-serif" font-size="12">&lt; 5.7 %</text>
      <rect x="35" y="210" width="330" height="50" fill="%23fff1f2" stroke="%23f43f5e" rx="6" stroke-dasharray="4 2"/>
      <text x="45" y="230" fill="%23e11d48" font-family="sans-serif" font-size="12" font-weight="bold">AI OCR Alert: Uncontrolled Hyperglycemia</text>
      <text x="45" y="248" fill="%23881337" font-family="sans-serif" font-size="11">Risk of Diabetic Ketoacidosis (DKA) / Renal Stress</text>
    </svg>`,
    findings: {
      en: "OCR flags severe chronic hyperglycemia (HbA1c: 10.8%, FBS: 284 mg/dL) and borderline elevated creatinine (1.45 mg/dL). High risk of diabetic microvascular complications.",
      ta: "இரத்த சர்க்கரை அளவு ஆபத்தான அளவில் அதிகமாக உள்ளது (HbA1c: 10.8%, குளுக்கோஸ்: 284 mg/dL). சிறுநீரக செயல்பாடு பாதிக்கப்படும் அபாயம்.",
      hi: "रक्त शर्करा बहुत गंभीर स्तर पर है (HbA1c: 10.8%, शुगर: 284 mg/dL)। डायबिटिक कोमा या किडनी पर असर होने का उच्च जोखिम।"
    },
    abnormality: {
      en: "High Risk - Severe Metabolic Derangement",
      ta: "அதிதீவிர அபாயம் - கட்டுப்பாடற்ற இரத்த சர்க்கரை",
      hi: "उच्च जोखिम - अनियंत्रित मधुमेह"
    },
    confidence: "98.7%",
    riskScore: 82,
    keyMetrics: [
      {
        label: { en: "Fasting Glucose", ta: "உண்ணாவிரத சர்க்கரை", hi: "फास्टिंग शुगर" },
        value: { en: "284 mg/dL (Critical)", ta: "284 mg/dL (ஆபத்து)", hi: "284 mg/dL (गंभीर)" }
      },
      {
        label: { en: "HbA1c", ta: "3 மாத சராசரி சர்க்கரை", hi: "HbA1c स्तर" },
        value: { en: "10.8% (Target < 7%)", ta: "10.8% (இயல்பு < 7%)", hi: "10.8% (लक्ष्य < 7%)" }
      }
    ],
    recommendation: {
      en: "Review glycemic regimen; assess urine ketones and microalbumin; initiate teleconsultation with General Physician.",
      ta: "சர்க்கரை மாத்திரை அளவை உடனடியாக மாற்றி அமைக்க வேண்டும்; பொது மருத்துவரிடம் அவசர ஆலோசனை பெறவும்.",
      hi: "दवाओं की समीक्षा करें और तुरंत चिकित्सक से परामर्श लें।"
    }
  },

  {
    id: "scan_ecg",
    type: "ECG 12-Lead Strip",
    title: {
      en: "12-Lead Rhythm Strip: Arrhythmia Detection",
      ta: "12-லீட் இசிஜி (ECG): சீரற்ற இதயத்துடிப்பு கண்டறிதல்",
      hi: "12-लीड ईसीजी: अतालता (Arrhythmia) पहचान"
    },
    patientName: "Ramasamy K. (65M, Dharmapuri)",
    category: "Cardiology",
    thumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="%23fef2f2"/>
      <defs>
        <pattern id="ecgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23fca5a5" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(%23ecgGrid)"/>
      <text x="20" y="30" fill="%23991b1b" font-family="sans-serif" font-size="12" font-weight="bold">LEAD II RHYTHM STRIP (25mm/s - 10mm/mV)</text>
      <path d="M 20 150 L 50 150 L 55 145 L 60 160 L 65 80 L 70 180 L 75 150 L 90 150 Q 100 135 110 150 L 130 150 L 135 145 L 140 160 L 145 85 L 150 175 L 155 150 L 195 150 L 200 145 L 205 160 L 210 75 L 215 185 L 220 150 L 290 150 L 295 145 L 300 160 L 305 80 L 310 180 L 315 150 L 380 150" fill="none" stroke="%23b91c1c" stroke-width="2.5"/>
      <rect x="250" y="45" width="135" height="40" fill="%23b91c1c" rx="4"/>
      <text x="260" y="65" fill="%23ffffff" font-family="sans-serif" font-size="11" font-weight="bold">AI: AFib / Arrhythmia</text>
    </svg>`,
    findings: {
      en: "Absence of distinct P waves with irregular R-R intervals detected by rhythm analysis. Consistent with Atrial Fibrillation with rapid ventricular response (HR: 118 bpm). Embolic risk.",
      ta: "இதயத் துடிப்பில் சீரற்ற ஒழுங்கின்மை (Atrial Fibrillation) கண்டறியப்பட்டுள்ளது. நாடித்துடிப்பு வேகம் 118 bpm. பக்கவாதம் மற்றும் இதய செயலிழப்பு அபாயம்.",
      hi: "दिल की धड़कन में असामान्य अनियमितता (Atrial Fibrillation)। नाड़ी दर 118 प्रति मिनट। स्ट्रोक की रोकथाम हेतु तुरंत जांच आवश्यक।"
    },
    abnormality: {
      en: "High Risk - Cardiac Arrhythmia",
      ta: "அதிதீவிர அபாயம் - இதய துடிப்பு சீர்குலைவு",
      hi: "उच्च जोखिम - हृदय अतालता"
    },
    confidence: "91.8%",
    riskScore: 90,
    keyMetrics: [
      {
        label: { en: "Ventricular Rate", ta: "இதய துடிப்பு வீதம்", hi: "वेंट्रिकुलर दर" },
        value: { en: "118 bpm (Tachycardia)", ta: "118 bpm (அதிவேகம்)", hi: "118 प्रति मिनट" }
      }
    ],
    recommendation: {
      en: "Emergency PHC physician review; continuous pulse oximetry, prepare anticoagulant assessment and tele-cardiology opinion.",
      ta: "உடனடி அவசர ஆரம்ப சுகாதார நிலைய மருத்துவர் பரிசோதனை; தொலைதூர இதய சிறப்பு மருத்துவரின் வழிகாட்டுதலைப் பெறவும்.",
      hi: "आपातकालीन ईसीजी समीक्षा; तत्काल कॉर्डियोलॉजिस्ट से संपर्क करें।"
    }
  },

  {
    id: "scan_normal",
    type: "Chest X-Ray (CXR)",
    title: {
      en: "Routine Health Screening: Normal Chest Scan",
      ta: "வழக்கமான சுகாதார பரிசோதனை: இயல்பான மார்பு எக்ஸ்-ரே",
      hi: "नियमित स्वास्थ्य जांच: सामान्य चेस्ट एक्स-रे"
    },
    patientName: "Selvi R. (34F, Chengalpattu)",
    category: "Radiology",
    thumbnail: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="%23020617"/>
      <path d="M100 80 Q200 40 300 80 Q350 200 320 280 L80 280 Q50 200 100 80 Z" fill="%230f172a" stroke="%23334155" stroke-width="2"/>
      <line x1="200" y1="50" x2="200" y2="280" stroke="%23475569" stroke-width="12" stroke-dasharray="8 4"/>
      <path d="M120 100 Q200 120 280 100 M110 130 Q200 150 290 130 M105 160 Q200 180 295 160" stroke="%23334155" stroke-width="6" fill="none" opacity="0.6"/>
      <path d="M170 140 C170 130 230 140 230 190 C230 230 190 240 170 210 Z" fill="%231e293b" opacity="0.8"/>
      <rect x="230" y="20" width="150" height="35" fill="%23059669" rx="4"/>
      <text x="240" y="42" fill="%23ffffff" font-family="sans-serif" font-size="12" font-weight="bold">✓ AI: Normal Scan 98%</text>
    </svg>`,
    findings: {
      en: "Both lung fields are clear of focal consolidation, effusion, or active pneumothorax. Cardiothoracic ratio within normal physiological limits. Normal study.",
      ta: "இரு நுரையீரல்களும் தெளிவாக உள்ளன. நிமோனியா அல்லது திரவக் கசிவு இல்லை. இதய அளவு சீராக உள்ளது. சாதாரண பரிசோதனை முடிவு.",
      hi: "दोनों फेफड़े बिल्कुल साफ हैं। कोई इन्फेक्शन या असामान्य लक्षण नहीं पाया गया। सामान्य एक्स-रे रिपोर्ट।"
    },
    abnormality: {
      en: "Low Risk - Healthy / Unremarkable",
      ta: "குறைந்த அபாயம் - ஆரோக்கியமானது / சாதாரண முடிவு",
      hi: "कम जोखिम - सामान्य एवं स्वस्थ"
    },
    confidence: "98.1%",
    riskScore: 12,
    keyMetrics: [
      {
        label: { en: "Lung Parenchyma", ta: "நுரையீரல் திசுக்கள்", hi: "फेफड़े" },
        value: { en: "Clear bilateral", ta: "இருபுறமும் சீரானது", hi: "साफ" }
      }
    ],
    recommendation: {
      en: "Routine preventive health follow-up; no acute clinical intervention indicated.",
      ta: "வழக்கமான தடுப்பு சுகாதார பராமரிப்பு போதுமானது; அவசர சிகிச்சை எதுவும் தேவையில்லை.",
      hi: "नियमित स्वास्थ्य देखभाल जारी रखें; आपातकालीन उपचार की आवश्यकता नहीं।"
    }
  }
];
