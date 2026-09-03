// AI Clinical Risk Assessment & Triage Engine
// Fully localized in English, தமிழ் (Tamil), and हिन्दी (Hindi)

export const COMMON_SYMPTOMS = [
  { id: "fever", icon: "🌡️", en: "High Fever", ta: "கடுமையான காய்ச்சல்", hi: "तेज बुखार", weight: 15 },
  { id: "chest_pain", icon: "💔", en: "Chest Pain / Tightness", ta: "மார்பு வலி / நெஞ்சு இறுக்கம்", hi: "सीने में दर्द / जकड़न", weight: 35, critical: true },
  { id: "breathlessness", icon: "🫁", en: "Shortness of Breath", ta: "மூச்சுத் திணறல்", hi: "सांस लेने में कठिनाई", weight: 35, critical: true },
  { id: "cough", icon: "🗣️", en: "Persistent Cough (>2 weeks)", ta: "தொடர் இருமல் (>2 வாரம்)", hi: "लगातार खांसी (>2 सप्ताह)", weight: 15 },
  { id: "vomiting", icon: "🤢", en: "Vomiting / Diarrhea", ta: "வாந்தி / வயிற்றுப்போக்கு", hi: "उल्टी / दस्त", weight: 15 },
  { id: "snakebite", icon: "🐍", en: "Snake / Insect Bite", ta: "பாம்பு / விஷக்கடி", hi: "सांप / विषैला कीड़ा काटना", weight: 50, critical: true },
  { id: "maternal_flag", icon: "🤰", en: "Pregnancy Warning Signs", ta: "கர்ப்பகால எச்சரிக்கை அறிகுறிகள்", hi: "गर्भावस्था खतरे के संकेत", weight: 40, critical: true },
  { id: "headache_vision", icon: "🧠", en: "Severe Headache & Blur Vision", ta: "கடுமையான தலைவலி & பார்வை மங்கல்", hi: "तेज सिरदर्द और धुंधला दिखना", weight: 20 },
  { id: "skin_lesion", icon: "🩹", en: "Spreading Skin Rash / Ulcer", ta: "தோல் புண் / தடிப்பு", hi: "फैलने वाले दाने या घाव", weight: 10 },
  { id: "abdominal_pain", icon: "⚡", en: "Severe Abdominal Cramps", ta: "கடும் வயிற்று வலி", hi: "पेट में तेज मरोड़ / दर्द", weight: 15 },
  { id: "body_weakness", icon: "🛌", en: "Severe Fatigue & Weakness", ta: "தீவிர சோர்வு & பலவீனம்", hi: "अत्यधिक कमजोरी व सुस्ती", weight: 10 },
  { id: "fainting", icon: "💫", en: "Dizziness or Fainting Spells", ta: "தலைச்சுற்றல் அல்லது மயக்கம்", hi: "चक्कर आना या बेहोशी", weight: 25 }
];

/**
 * Calculates patient risk score (0-100) and localized clinical recommendations
 */
export function calculateRisk(data, lang = 'en') {
  let score = 0;
  const criticalReasons = [];
  const differentialConditions = [];
  const vitalFlags = [];

  const {
    selectedSymptoms = [],
    age = 30,
    spo2 = 98,
    sysBp = 120,
    diaBp = 80,
    temperature = 98.6,
    pulse = 76,
    duration = "1-2",
    severity = 5
  } = data;

  // 1. Evaluate Symptom Weights
  selectedSymptoms.forEach(symId => {
    const sym = COMMON_SYMPTOMS.find(s => s.id === symId);
    if (sym) {
      score += sym.weight;
      if (sym.critical) {
        criticalReasons.push({
          en: sym.en,
          ta: sym.ta,
          hi: sym.hi
        });
      }
    }
  });

  // 2. Vitals Analysis: SpO2
  if (spo2 > 0) {
    if (spo2 < 90) {
      score += 45;
      criticalReasons.push({
        en: `Severe Hypoxemia (SpO2: ${spo2}% < 90%)`,
        ta: `கடுமையான ஆக்சிஜன் குறைவு (SpO2: ${spo2}% < 90% ஆபத்து)`,
        hi: `गंभीर ऑक्सीजन की कमी (SpO2: ${spo2}% < 90%)`
      });
      vitalFlags.push({
        status: "critical",
        msg: {
          en: `Critical Oxygen: ${spo2}% (Normal >95%)`,
          ta: `ஆபத்தான ஆக்சிஜன் அளவு: ${spo2}% (இயல்பு >95%)`,
          hi: `गंभीर ऑक्सीजन स्तर: ${spo2}% (सामान्य >95%)`
        }
      });
    } else if (spo2 <= 93) {
      score += 25;
      vitalFlags.push({
        status: "warning",
        msg: {
          en: `Low Oxygen SpO2: ${spo2}% - Supplemental O2 may be needed`,
          ta: `குறைந்த ஆக்சிஜன் SpO2: ${spo2}% - செயற்கை ஆக்சிஜன் தேவைப்படலாம்`,
          hi: `कम ऑक्सीजन स्तर: ${spo2}% - ऑक्सीजन सहायता की आवश्यकता हो सकती है`
        }
      });
    } else {
      vitalFlags.push({
        status: "normal",
        msg: {
          en: `Oxygen SpO2 Normal: ${spo2}%`,
          ta: `ஆக்சிஜன் அளவு இயல்பானது: ${spo2}%`,
          hi: `ऑक्सीजन स्तर सामान्य: ${spo2}%`
        }
      });
    }
  }

  // 3. Vitals Analysis: Blood Pressure
  if (sysBp > 0 && diaBp > 0) {
    if (sysBp >= 180 || diaBp >= 110) {
      score += 40;
      criticalReasons.push({
        en: `Hypertensive Urgency (${sysBp}/${diaBp} mmHg)`,
        ta: `ஆபத்தான உயர் இரத்த அழுத்தம் (${sysBp}/${diaBp} mmHg - பக்கவாத அபாயம்)`,
        hi: `अत्यधिक उच्च रक्तचाप (${sysBp}/${diaBp} mmHg - स्ट्रोक का खतरा)`
      });
      vitalFlags.push({
        status: "critical",
        msg: {
          en: `Critical BP: ${sysBp}/${diaBp} mmHg (Risk of Stroke/Organ Damage)`,
          ta: `ஆபத்தான ரத்த அழுத்தம்: ${sysBp}/${diaBp} mmHg (பக்கவாத / உறுப்பு பாதிப்பு அபாயம்)`,
          hi: `गंभीर ब्लड प्रेशर: ${sysBp}/${diaBp} mmHg (स्ट्रोक व अंग क्षति का खतरा)`
        }
      });
    } else if (sysBp >= 140 || diaBp >= 90) {
      score += 18;
      vitalFlags.push({
        status: "warning",
        msg: {
          en: `Elevated BP: ${sysBp}/${diaBp} mmHg (Stage 2 Hypertension)`,
          ta: `அதிகரித்த ரத்த அழுத்தம்: ${sysBp}/${diaBp} mmHg (நிலை 2 உயர் ரத்த அழுத்தம்)`,
          hi: `बढ़ा हुआ रक्तचाप: ${sysBp}/${diaBp} mmHg (स्टेज 2 हाइपरटेंशन)`
        }
      });
    } else if (sysBp < 90 || diaBp < 50) {
      score += 35;
      criticalReasons.push({
        en: "Hypotensive Shock Risk (BP < 90/50)",
        ta: "இரத்த அழுத்தம் மிகக் குறைவு (அதிர்ச்சி மற்றும் மயக்க அபாயம்)",
        hi: "अत्यधिक कम रक्तचाप (शॉक व बेहोशी का खतरा)"
      });
      vitalFlags.push({
        status: "critical",
        msg: {
          en: `Low BP: ${sysBp}/${diaBp} mmHg (Shock Warning)`,
          ta: `குறைந்த ரத்த அழுத்தம்: ${sysBp}/${diaBp} mmHg (அதிர்ச்சி எச்சரிக்கை)`,
          hi: `अत्यधिक कम बीपी: ${sysBp}/${diaBp} mmHg (शॉक चेतावनी)`
        }
      });
    } else {
      vitalFlags.push({
        status: "normal",
        msg: {
          en: `Blood Pressure Normal: ${sysBp}/${diaBp} mmHg`,
          ta: `இரத்த அழுத்தம் இயல்பாக உள்ளது: ${sysBp}/${diaBp} mmHg`,
          hi: `रक्तचाप सामान्य है: ${sysBp}/${diaBp} mmHg`
        }
      });
    }
  }

  // 4. Vitals Analysis: Temperature
  if (temperature > 0) {
    if (temperature >= 103.5) {
      score += 25;
      vitalFlags.push({
        status: "warning",
        msg: {
          en: `High Grade Hyperpyrexia: ${temperature}°F`,
          ta: `மிகக் கடுமையான காய்ச்சல்: ${temperature}°F`,
          hi: `अत्यधिक तेज बुखार: ${temperature}°F`
        }
      });
    } else if (temperature >= 100.5) {
      score += 15;
      vitalFlags.push({
        status: "info",
        msg: {
          en: `Fever detected: ${temperature}°F`,
          ta: `காய்ச்சல் கண்டறியப்பட்டது: ${temperature}°F`,
          hi: `बुखार दर्ज किया गया: ${temperature}°F`
        }
      });
    }
  }

  // 5. Vitals Analysis: Heart Rate
  if (pulse > 0) {
    if (pulse > 120 || pulse < 50) {
      score += 20;
      vitalFlags.push({
        status: "warning",
        msg: {
          en: `Abnormal Heart Rate: ${pulse} bpm (Tachycardia/Bradycardia)`,
          ta: `சீரற்ற இதயத்துடிப்பு: ${pulse} bpm (மிக வேகம் அல்லது மந்தம்)`,
          hi: `असामान्य हृदय गति: ${pulse} bpm (अत्यधिक तेज या धीमी)`
        }
      });
    }
  }

  // 6. Demographics: Age Risk Multiplier
  if (age > 65 || age < 5) {
    score = Math.round(score * 1.15);
  }

  // 7. Duration Factor
  if (duration === "week" && score > 20) {
    score += 12;
  }

  // 8. Severity Adjustment (scale 1-10)
  score += Math.round((severity - 5) * 2.5);

  // Normalize score between 5 and 100
  score = Math.max(8, Math.min(100, Math.round(score)));

  // Categorize Risk Level
  let level = "low";
  if (score >= 70 || criticalReasons.length > 0) {
    level = "high";
    score = Math.max(score, 75); // High risk baseline
  } else if (score >= 38) {
    level = "medium";
  }

  // Differential Clinical Suspicions with Complete Tamil Translations
  if (selectedSymptoms.includes("chest_pain") && (selectedSymptoms.includes("breathlessness") || sysBp > 150)) {
    differentialConditions.push({
      name: {
        en: "Acute Coronary Syndrome / Angina",
        ta: "கடுமையான மாரடைப்பு / ஆஞ்சைனா (Acute Coronary Syndrome)",
        hi: "एक्यूट कोरोनरी सिंड्रोम / एनजाइना (हार्ट अटैक जोखिम)"
      },
      risk: "High",
      rationale: {
        en: "Chest discomfort co-occurring with dyspnea or elevated vascular stress.",
        ta: "நெஞ்சு இறுக்கம் மற்றும் மூச்சுத்திணறல் இணைந்துள்ளதால் உடனடி இதய பரிசோதனை அவசியம்.",
        hi: "सीने में दर्द के साथ सांस फूलना हृदय संबंधी आपातकाल का संकेत है।"
      }
    });
  }

  if (selectedSymptoms.includes("snakebite")) {
    differentialConditions.push({
      name: {
        en: "Venomous Envenomation (Neuro/Hemotoxic)",
        ta: "நச்சுப் பாம்புக்கடி / விஷக்கடி (Snake Envenomation)",
        hi: "विषैला सर्पदंश (न्यूरो/हेमोटॉक्सिक)"
      },
      risk: "Critical",
      rationale: {
        en: "Immediate anti-snake venom (ASV) protocol required at nearest CHC/District hospital.",
        ta: "உடனடியாக 108 ஆம்புலன்ஸ் மூலம் பாம்புக்கடி விஷமுறிவு மருந்து (ASV) உள்ள மருத்துவமனைக்கு கொண்டு செல்லவும்.",
        hi: "नजदीकी अस्पताल में तत्काल एंटी-स्नेक वेनम (ASV) इंजेक्शन की आवश्यकता है।"
      }
    });
  }

  if (selectedSymptoms.includes("fever") && selectedSymptoms.includes("cough")) {
    differentialConditions.push({
      name: {
        en: "Lower Respiratory Tract Infection / Pneumonia",
        ta: "நுரையீரல் தொற்று / நிமோனியா (Pneumonia)",
        hi: "श्वसन तंत्र संक्रमण / निमोनिया (Pneumonia)"
      },
      risk: score > 60 ? "High" : "Moderate",
      rationale: {
        en: "Bacterial or viral pulmonary involvement. Requires auscultation and SpO2 monitoring.",
        ta: "நுரையீரலில் சளி உறைந்து தொற்று ஏற்பட்டிருக்கலாம். ஆக்சிஜன் அளவை தொடர்ந்து கண்காணிக்கவும்.",
        hi: "फेफड़ों में संक्रमण के लक्षण हैं। ऑक्सीजन स्तर की जांच आवश्यक है।"
      }
    });
  }

  if (selectedSymptoms.includes("vomiting")) {
    differentialConditions.push({
      name: {
        en: "Acute Gastroenteritis with Dehydration Risk",
        ta: "கடுமையான இரைப்பை குடல் அழற்சி / நீரிழப்பு அபாயம் (Gastroenteritis)",
        hi: "तीव्र गैस्ट्रोएंटेराइटिस / निर्जलीकरण का खतरा"
      },
      risk: score > 50 ? "Moderate" : "Low",
      rationale: {
        en: "Requires oral rehydration solution (ORS) and electrolyte evaluation.",
        ta: "உடலில் நீர்ச்சத்து குறையாமல் இருக்க உடனடியாக ஓ.ஆர்.எஸ் (ORS) உப்பு சர்க்கரை கரைசல் கொடுக்கவும்.",
        hi: "मरीज को ओआरएस (ORS) घोल दें और डॉक्टर से संपर्क करें।"
      }
    });
  }

  if (selectedSymptoms.includes("maternal_flag")) {
    differentialConditions.push({
      name: {
        en: "High-Risk Obstetric Complication (Preeclampsia/Premature Labor)",
        ta: "கர்ப்பகால அதிதீவிர சிக்கல் / நஞ்சுக்கொடி உயர் ரத்த அழுத்தம் (Preeclampsia)",
        hi: "उच्च जोखिम वाली प्रसूति जटिलता (प्री-एक्लेम्पसिया)"
      },
      risk: "High",
      rationale: {
        en: "Urgent transfer to First Referral Unit (FRU) / Sub-District Hospital.",
        ta: "கர்ப்பிணிப் பெண்ணுக்கு அவசர மருத்துவ உதவி தேவை; அருகிலுள்ள மகப்பேறு மருத்துவமனைக்கு உடனடியாக மாற்றவும்.",
        hi: "गर्भवती महिला को तत्काल उच्च चिकित्सा केंद्र रेफर करने की आवश्यकता है।"
      }
    });
  }

  if (differentialConditions.length === 0) {
    differentialConditions.push({
      name: {
        en: "Early Viral Prodrome / General Malaise",
        ta: "ஆரம்ப வைரஸ் காய்ச்சல் / உடல் சோர்வு (Viral Malaise)",
        hi: "प्रारंभिक वायरल बुखार / सामान्य कमजोरी"
      },
      risk: "Low",
      rationale: {
        en: "Supportive symptomatic home care and hydration advised unless symptoms worsen.",
        ta: "வீட்டில் ஓய்வு எடுத்து, அதிக அளவில் திரவ உணவுகளை அருந்தவும். அறிகுறிகள் தீவிரமடைந்தால் மருத்துவரை அணுகவும்.",
        hi: "घर पर आराम करें और तरल पदार्थों का सेवन करें।"
      }
    });
  }

  // Recommended Action in all 3 languages
  const action = {
    en: "Patient shows stable vitals. Continue home hydration, rest, and monitor temperature twice daily. Consult PHC if not resolving in 48 hours.",
    ta: "நோயாளி நிலையான அளவீடுகளைக் கொண்டுள்ளார். வீட்டில் போதுமான நீர் அருந்தி ஓய்வெடுக்கவும். 48 மணி நேரத்தில் சரியாகாவிட்டால் ஆரம்ப சுகாதார நிலையத்தை அணுகவும்.",
    hi: "मरीज की स्थिति स्थिर है। भरपूर पानी पिएं और आराम करें। 48 घंटे में सुधार न होने पर नजदीकी पीएचसी डॉक्टर से परामर्श लें।"
  };

  if (level === "medium") {
    action.en = "Moderate clinical risk detected. Schedule an outpatient visit or teleconsultation with a PHC Medical Officer within 12-24 hours.";
    action.ta = "மிதமான அபாயம் கண்டறியப்பட்டது. அடுத்த 12-24 மணி நேரத்திற்குள் ஆரம்ப சுகாதார நிலைய மருத்துவர் ஆலோசனையைப் பெறவும்.";
    action.hi = "मध्यम जोखिम पाया गया। अगले 12-24 घंटे के भीतर पीएचसी मेडिकल ऑफिसर से जांच या टेली-कंसल्टेशन कराएं।";
  } else if (level === "high") {
    action.en = "URGENT CLINICAL ATTENTION REQUIRED: Initiate 108 Emergency ambulance dispatch or immediately transport patient to the nearest 24/7 Primary Health Centre (PHC).";
    action.ta = "உடனடி அவசர சிகிச்சை தேவை: 108 ஆம்புலன்ஸ் மூலமாக உடனடியாக அருகிலுள்ள 24 மணி நேர ஆரம்ப சுகாதார நிலையத்திற்கு நோயாளியை அழைத்துச் செல்லவும்.";
    action.hi = "अति-आवश्यक चिकित्सा: मरीज को तुरंत 108 एम्बुलेंस द्वारा निकटतम 24x7 प्राथमिक स्वास्थ्य केंद्र (PHC) या जिला अस्पताल पहुंचाएं।";
  }

  return {
    score,
    level,
    isEmergency: level === "high",
    criticalReasons,
    vitalFlags,
    differentialConditions,
    action
  };
}
