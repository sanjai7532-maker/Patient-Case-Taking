// Multilingual AI Health Assistant Chatbot Component
// Complete Natural Tamil NLP Comprehension, Tamil Voice Input (STT), and Tamil Speech Narration (TTS)
import { speechService, speechRecognitionService } from '../speech.js';

export function renderChatbot(container, { currentLang, t, onTriggerEmergency }) {
  // Initial greetings per language
  const greetings = {
    en: "Namaste! I am your AI Rural Health Assistant. Ask me anything about symptoms, medication safety, mother-child care, or emergency first aid in English, Tamil, or Hindi.",
    ta: "வணக்கம்! நான் உங்கள் கிராமப்புற செயற்கை நுண்ணறிவு நல்வாழ்வு உதவியாளர். உங்கள் உடல்நலக் கோளாறுகள், காய்ச்சல், நெஞ்சு வலி, கர்ப்பகால பராமரிப்பு, வாந்தி பேதி அல்லது அவசர முதலுதவி பற்றி தமிழில் தட்டச்சு செய்தோ அல்லது மைக் மூலம் பேசியோ கேட்கலாம்.",
    hi: "नमस्ते! मैं आपका ग्रामीण स्वास्थ्य एआई सहायक हूँ। बुखार, सर्दी, शिशु देखभाल या आपातकालीन प्राथमिक चिकित्सा के बारे में हिंदी में पूछें या बोलें।"
  };

  let messages = [
    {
      sender: "bot",
      text: greetings[currentLang] || greetings.en,
      time: currentLang === 'ta' ? "சற்றுமுன்" : "Just now",
      lang: currentLang
    }
  ];

  let isRecording = false;
  let autoSpeakEnabled = true;

  // Detect whether text is primarily Tamil (Tamil Unicode block: U+0B80 to U+0BFF) or Tanglish
  function detectLanguage(userText, defaultLang) {
    if (/[\u0B80-\u0BFF]/.test(userText)) {
      return 'ta';
    }
    if (/[\u0900-\u097F]/.test(userText)) {
      return 'hi';
    }
    const lower = userText.toLowerCase();
    const tanglishWords = ['vanakkam', 'kaichal', 'pambu', 'kadi', 'nenju', 'vali', 'marbu', 'moochu', 'irumal', 'sali', 'vanthi', 'bethi', 'vayiru', 'karppam', 'thalai', 'sakkarai', 'maruthuvar', 'mathirai', 'udambu', 'thonda'];
    if (tanglishWords.some(w => lower.includes(w))) {
      return 'ta';
    }
    const hinglishWords = ['namaste', 'bukhar', 'dard', 'seene', 'saans', 'khansi', 'dast', 'ulti', 'dawa', 'doctor', 'garbhavastha'];
    if (hinglishWords.some(w => lower.includes(w))) {
      return 'hi';
    }
    return defaultLang || 'en';
  }

  // Comprehensive Clinical AI NLP Matcher for Tamil, English & Hindi
  function getAiResponse(userText, resolvedLang) {
    const text = userText.toLowerCase().trim();

    // 1. Snakebite / Poison / Venom / Scorpion
    if (
      text.includes("snake") || text.includes("bite") || text.includes("venom") || text.includes("poison") ||
      text.includes("பாம்பு") || text.includes("விஷம்") || text.includes("கடி") ||
      text.includes("பூச்சிக்கடி") || text.includes("தேள்") || text.includes("தேள்கடி") ||
      text.includes("pambu") || text.includes("visham") || text.includes("kadi") ||
      text.includes("सांप") || text.includes("जहर") || text.includes("काटना")
    ) {
      return {
        en: "🚨 URGENT SNAKEBITE PROTOCOL: 1. Keep the patient strictly calm and lying still; do not allow walking. 2. Do NOT cut the wound, suck venom, or tie tight ropes/tourniquets. 3. Immobilize the bitten limb with a splint below heart level. 4. Transport IMMEDIATELY to the nearest PHC/Hospital with Anti-Snake Venom (ASV). Dial 108 immediately.",
        ta: "🚨 பாம்புக்கடி அவசர முதலுதவி வழிகாட்டுதல்:\n1. நோயாளியை பதற்றமடையாமல் படுக்க வைக்கவும்; நடக்கவோ ஓடவோ விடாதீர்கள்.\n2. கடித்த இடத்தை பிளேடால் கீறவோ, வாயால் உறிஞ்சவோ, கயிற்றால் இறுக்கமாக கட்டவோ கூடாது.\n3. கடித்த காலையோ கையையோ அசையாமல் மரக்கட்டை வைத்து இதயத்திற்கு கீழ் மட்டத்தில் வைக்கவும்.\n4. எந்த தாமதமும் இன்றி உடனடியாக 108 ஆம்புலன்ஸை அழைத்து பாம்புக்கடி விஷமுறிவு மருந்து உள்ள அரசு ஆரம்ப சுகாதார நிலையத்திற்கு கொண்டு செல்லவும்.",
        hi: "🚨 सांप काटने पर तत्काल प्राथमिक उपचार:\n1. मरीज को शांत रखें और चलने न दें।\n2. घाव पर चीरा न लगाएं और न ही मुंह से चूसें।\n3. अंग को दिल के स्तर से नीचे स्थिर रखें।\n4. तुरंत 108 एम्बुलेंस से एंटी-स्नेक वेनम (ASV) वाले नजदीकी अस्पताल ले जाएं।"
      };
    }

    // 2. Chest pain / Heart / Dyspnea / Breathlessness
    if (
      text.includes("chest") || text.includes("heart") || text.includes("breath") || text.includes("tight") || text.includes("attack") ||
      text.includes("மார்பு") || text.includes("நெஞ்சு") || text.includes("மூச்சு") || text.includes("இதயம்") || text.includes("மாரடைப்பு") ||
      text.includes("nenju") || text.includes("marbu") || text.includes("moochu") || text.includes("valikuthu") ||
      text.includes("सीने") || text.includes("दिल") || text.includes("सांस") || text.includes("दौरा")
    ) {
      return {
        en: "⚠️ CRITICAL CARDIAC & RESPIRATORY ALERT: Chest pain radiating to the left arm, heaviness, breathlessness, or cold sweating can indicate an Acute Myocardial Infarction (Heart Attack). 1. Keep the patient comfortably seated upright. 2. Loosen tight collars and clothing. 3. Avoid any physical exertion. 4. Call 108 Emergency Ambulance right away or rush to the nearest 24/7 PHC.",
        ta: "⚠️ தீவிர இதய & சுவாச எச்சரிக்கை:\nநெஞ்சு வலி, இடது கை அல்லது தாடைக்கு வலி பரவுதல், மூச்சுத்திணறல் அல்லது குளிர்ந்த வியர்வை ஆகியவை மாரடைப்பின் அறிகுறியாக இருக்கலாம்.\n1. நோயாளியை படுக்க வைக்காமல் சாய்ந்த நிலையில் வசதியாக உட்கார வைக்கவும்.\n2. கழுத்து மற்றும் மார்புப் பகுதியில் இறுக்கமான ஆடைகளை தளர்த்தவும்.\n3. நோயாளியை நடக்கவோ அலையவோ விடாதீர்கள்.\n4. உடனடியாக 108 அவசர ஆம்புலன்ஸை அழைத்து ஆரம்ப சுகாதார நிலையத்திற்கு செல்லவும்.",
        hi: "⚠️ गंभीर हृदय संबंधी चेतावनी:\nसीने में दर्द, सांस लेने में कठिनाई या पसीना आना दिल के दौरे का संकेत हो सकता है।\n1. मरीज को सीधा आरामदायक स्थिति में बैठाएं।\n2. कपड़े ढीले करें और शारीरिक श्रम न करने दें।\n3. तुरंत 108 एम्बुलेंस को कॉल करें।"
      };
    }

    // 3. Fever / Chills / Dengue / Malaria / Children / Viral
    if (
      text.includes("fever") || text.includes("temp") || text.includes("chills") || text.includes("dengue") || text.includes("malaria") || text.includes("baby") || text.includes("child") ||
      text.includes("காய்ச்சல்") || text.includes("சுரம்") || text.includes("குளிர்") || text.includes("டெங்கு") || text.includes("குழந்தை") || text.includes("சூடு") ||
      text.includes("kaichal") || text.includes("suram") || text.includes("kulir") || text.includes("dengue") || text.includes("kozhandhai") ||
      text.includes("बुखार") || text.includes("तापमान") || text.includes("ठंड") || text.includes("बच्चे")
    ) {
      return {
        en: "🌡️ FEVER & INFECTION MANAGEMENT:\n1. For temperature >100°F, wipe forehead and body with normal lukewarm water (avoid ice water).\n2. Maintain continuous hydration with boiled cooled water, ORS, or tender coconut water.\n3. In children, monitor for seizure/convulsion signs. Do not give Aspirin.\n4. If fever lasts >48 hours with severe body pain or rashes, visit the PHC for Dengue (NS1/Platelets) and Malaria blood tests.",
        ta: "🌡️ காய்ச்சல் மற்றும் தொற்று பராமரிப்பு வழிகாட்டல்:\n1. 100°F-க்கு மேல் காய்ச்சல் இருந்தால், வெதுவெதுப்பான நீரில் நனைத்த துணியால் உடலை மென்மையாக துடைக்கவும் (ஐஸ் நீர் பயன்படுத்த வேண்டாம்).\n2. கொதித்து ஆறிய குடிநீர், கஞ்சி, இளநீர் அல்லது ஓ ஆர் எஸ் நீர் வழங்கி உடலை நீர்ச்சத்துடன் வைத்திருக்கவும்.\n3. குழந்தைகளுக்கு பாராசிட்டமால் மருந்தை மருத்துவர் அல்லது ஆஷா பணியாளர் குறிப்பிட்ட அளவில் மட்டுமே கொடுக்கவும்.\n4. காய்ச்சல் 48 மணி நேரத்திற்கு மேல் நீடித்தால், டெங்கு அல்லது மலேரியா பரிசோதனைக்காக உடனே ஆரம்ப சுகாதார நிலையத்திற்கு செல்லவும்.",
        hi: "🌡️ बुखार और संक्रमण की देखभाल:\n1. 100°F से अधिक बुखार होने पर गुनगुने पानी की पट्टी माथे व शरीर पर रखें।\n2. भरपूर पानी, ओआरएस या नारियल पानी पिलाएं।\n3. 48 घंटे से अधिक बुखार रहने पर डेंगू व मलेरिया जांच हेतु पीएचसी जाएं।"
      };
    }

    // 4. Cough / Cold / Phlegm / Throat Pain / TB
    if (
      text.includes("cough") || text.includes("cold") || text.includes("sore throat") || text.includes("phlegm") || text.includes("tb") ||
      text.includes("இருமல்") || text.includes("சளி") || text.includes("தொண்டை") || text.includes("கோழை") || text.includes("காசநோய்") ||
      text.includes("irumal") || text.includes("sali") || text.includes("thonde") ||
      text.includes("खांसी") || text.includes("जुकाम") || text.includes("गला") || text.includes("टीबी")
    ) {
      return {
        en: "🗣️ RESPIRATORY & COUGH CARE:\n1. Drink warm water and inhale mild steam with tulsi/mint leaves.\n2. Gargle with warm salt water for throat relief.\n3. WARNING: If cough lasts more than 2 weeks, produces blood, or causes night sweats, immediately get a Sputum (TB) test at the local government PHC under the National TB Elimination Program (Free testing & treatment).",
        ta: "🗣️ இருமல் மற்றும் சளி நிவாரண வழிகாட்டல்:\n1. வெதுவெதுப்பான சுடுநீரில் துளசி, மிளகு சேர்த்து அருந்தவும்; ஆவி பிடிக்கலாம்.\n2. உப்பு கலந்த வெதுவெதுப்பான நீரில் தொண்டையை கொப்பளிக்கவும்.\n3. எச்சரிக்கை: இருமல் 2 வாரங்களுக்கு மேல் நீடித்தால், சளியில் இரத்தம் வந்தால் அல்லது இரவில் வியர்த்தால், அரசு ஆரம்ப சுகாதார நிலையத்தில் இலவச காசநோய் சளிப் பரிசோதனை செய்துகொள்வது கட்டாயமாகும்.",
        hi: "🗣️ खांसी और जुकाम की देखभाल:\n1. गुनगुना पानी पिएं और भाप लें।\n2. नमक के पानी से गरारे करें।\n3. यदि खांसी 2 सप्ताह से अधिक रहे तो सरकारी स्वास्थ्य केंद्र में टीबी की मुफ्त जांच कराएं।"
      };
    }

    // 5. Vomiting / Diarrhea / Stomach pain / Dehydration / Loose motion
    if (
      text.includes("vomit") || text.includes("diarrhea") || text.includes("stomach") || text.includes("loose") || text.includes("dehydration") || text.includes("motion") ||
      text.includes("வாந்தி") || text.includes("பேதி") || text.includes("வயிற்றுப்போக்கு") || text.includes("வயிறு") || text.includes("வயிற்று வலி") ||
      text.includes("vanthi") || text.includes("bethi") || text.includes("vayiru") || text.includes("vayitru vali") ||
      text.includes("उल्टी") || text.includes("दस्त") || text.includes("पेट दर्द")
    ) {
      return {
        en: "🤢 GASTROENTERITIS & DEHYDRATION CARE:\n1. Immediate priority: Prevent dehydration. Mix 1 sachet of ORS in 1 Liter of clean boiled cooled water and sip frequently.\n2. Give light foods such as rice gruel (kanji) with salt and buttermilk.\n3. Watch for severe dehydration signs: dry tongue, sunken eyes, extreme lethargy, or inability to pass urine. If present, rush to PHC for IV fluids.",
        ta: "🤢 வாந்தி மற்றும் வயிற்றுப்போக்கு முதலுதவி:\n1. முதல் முக்கியத்துவம்: உடலில் நீர்ச்சத்து குறைவதை தடுத்தல். 1 லிட்டர் கொதித்து ஆறிய நீரில் 1 பாக்கெட் ஓ ஆர் எஸ் பொடியை கரைத்து அடிக்கடி சிறிது சிறிதாக குடிக்க கொடுக்கவும்.\n2. மோர், உப்புக் கஞ்சி, இளநீர் போன்ற எளிதில் செரிக்கும் உணவுகளை வழங்கவும்.\n3. எச்சரிக்கை அறிகுறிகள்: நாக்கு வறண்டு போதல், கண்கள் குழிவிழுதல், சிறுநீர் வெளியேறாமல் இருத்தல் அல்லது நோயாளி மயக்கமடைதல். இவை இருந்தால் உடனடியாக அரசு ஆரம்ப சுகாதார நிலையத்திற்கு கொண்டு சென்று குளுக்கோஸ் ஏற்றவும்.",
        hi: "🤢 उल्टी-दस्त और निर्जलीकरण का उपचार:\n1. 1 लीटर उबले ठंडे पानी में 1 पैकेट ओआरएस (ORS) घोलकर लगातार पिलाएं।\n2. हल्का दलिया, छाछ या नमक वाली कांजी दें।\n3. पेशाब कम आने या अत्यधिक कमजोरी पर तुरंत अस्पताल ले जाएं।"
      };
    }

    // 6. Pregnancy / Maternal Warning Signs / Trimester / Delivery
    if (
      text.includes("pregnancy") || text.includes("pregnant") || text.includes("maternal") || text.includes("baby movement") || text.includes("bleeding") ||
      text.includes("கர்ப்ப") || text.includes("பிரசவம்") || text.includes("தாய்") || text.includes("ரத்தப்போக்கு") || text.includes("குழந்தை அசைவு") || text.includes("கர்ப்பிணி") ||
      text.includes("karppam") || text.includes("garbham") || text.includes("prasavam") ||
      text.includes("गर्भावस्था") || text.includes("गर्भवती") || text.includes("प्रसव")
    ) {
      return {
        en: "🤰 MATERNAL HEALTH & HIGH-RISK WARNING SIGNS:\nUrgent danger signs during pregnancy:\n1. Severe headache or blurred vision.\n2. Sudden swelling of face, hands, and feet (Preeclampsia risk).\n3. Vaginal bleeding or fluid leakage.\n4. High fever with chills.\n5. Decreased or absent fetal movements.\n-> If ANY of these occur, immediately contact your local ASHA worker or call 104 / 108 to transfer to the nearest Community Health Centre / FRU Hospital.",
        ta: "🤰 கர்ப்பகால தாய்-சேய் அவசர எச்சரிக்கை அறிகுறிகள்:\nகர்ப்பிணிப் பெண்களுக்கு கீழ்கண்ட அறிகுறிகள் தென்பட்டால் உடனடியாக மருத்துவமனைக்கு செல்ல வேண்டும்:\n1. கடுமையான விடாத தலைவலி அல்லது பார்வை மங்குதல்.\n2. முகம், கைகள் மற்றும் பாதங்களில் திடீர் வீக்கம் (உயர் இரத்த அழுத்த அபாயம்).\n3. இரத்தப்போக்கு அல்லது பிறப்புறுப்பில் திரவக் கசிவு.\n4. கடுமையான காய்ச்சல் அல்லது வயிற்று வலி.\n5. வயிற்றில் குழந்தையின் அசைவு குறைதல் அல்லது நின்றுபோதல்.\n-> இந்த அறிகுறிகள் இருந்தால் தயங்காமல் உடனே ஆஷா பணியாளரை தொடர்பு கொள்ளவும் அல்லது 108 / 104 அவசர ஊர்தி மூலம் மருத்துவமனைக்கு செல்லவும்.",
        hi: "🤰 गर्भावस्था के खतरे के लक्षण:\nतेज सिरदर्द, धुंधला दिखना, चेहरे/पैरों में सूजन, रक्तस्राव या शिशु की हलचल कम होना गंभीर खतरे के संकेत हैं। तुरंत आशा कार्यकर्ता या 108 पर संपर्क करें।"
      };
    }

    // 7. Headache / Dizziness / Weakness / Stroke / Faint
    if (
      text.includes("headache") || text.includes("dizzy") || text.includes("faint") || text.includes("stroke") ||
      text.includes("தலைவலி") || text.includes("மயக்கம்") || text.includes("தலைச்சுற்றல்") || text.includes("பக்கவாதம்") ||
      text.includes("thalai vali") || text.includes("mayakkam") ||
      text.includes("सिरदर्द") || text.includes("चक्कर") || text.includes("बेहोशी")
    ) {
      return {
        en: "🧠 HEADACHE & NEUROLOGICAL CARE:\n1. Rest in a dark, quiet room and drink plenty of water.\n2. Check Blood Pressure immediately if available.\n3. FAST STROKE WARNING: If headache is accompanied by sudden face drooping, weakness in one arm/leg, or slurred speech, it is a MEDICAL EMERGENCY. Call 108 immediately.",
        ta: "🧠 தலைவலி மற்றும் நரம்பியல் பராமரிப்பு:\n1. அமைதியான இருண்ட அறையில் ஓய்வெடுக்கவும்; தாராளமாக தண்ணீர் குடிக்கவும்.\n2. வாய்ப்பிருந்தால் இரத்த அழுத்தத்தை உடனடியாக பரிசோதிக்கவும்.\n3. பக்கவாத எச்சரிக்கை: தலைவலியுடன் ஒரு பக்க கை/கால் பலவீனம், வாய் கோணுதல் அல்லது பேச முடியாமல் நாக்கு குழறுதல் ஏற்பட்டால் அது அவசர நிலை! ஒரு நொடியும் தாமதிக்காமல் 108 ஆம்புலன்ஸை அழைக்கவும்.",
        hi: "🧠 सिरदर्द और चक्कर का समाधान:\n1. शांत कमरे में आराम करें और पानी पिएं।\n2. रक्तचाप (BP) की जांच कराएं।\n3. यदि चेहरे में टेढ़ापन या हाथ-पैर में कमजोरी हो तो तुरंत 108 पर संपर्क करें।"
      };
    }

    // 8. Blood Pressure / Hypertension
    if (
      text.includes("bp") || text.includes("blood pressure") || text.includes("hypertension") ||
      text.includes("ரத்த அழுத்தம்") || text.includes("பிரஷர்") || text.includes("ரத்தக்கொதிப்பு") ||
      text.includes("ratha azhutham") || text.includes("pressure") ||
      text.includes("रक्तचाप") || text.includes("बीपी")
    ) {
      return {
        en: "🩺 BLOOD PRESSURE GUIDANCE:\nNormal BP is around 120/80 mmHg. Stage 2 Hypertension is ≥140/90 mmHg. If Systolic is >180 or Diastolic >110 mmHg, it is a Hypertensive Emergency requiring immediate PHC care. Take prescribed anti-hypertensive tablets daily without skipping and reduce dietary salt.",
        ta: "🩺 இரத்த அழுத்த வழிகாட்டல்:\nஇயல்பான இரத்த அழுத்தம் 120/80 ஆகும். 140/90-க்கு மேல் இருந்தால் அது உயர் இரத்த அழுத்தம். இரத்த அழுத்தம் 180/110-க்கு மேல் போனால் அது உடனடி அவசர சிகிச்சை தேவைப்படும் ஆபத்தான நிலையாகும்.\n1. மருத்துவர் பரிந்துரைத்த இரத்த அழுத்த மாத்திரைகளை ஒரு நாளும் மறக்காமல் உட்கொள்ளவும்.\n2. உணவில் உப்பின் அளவை வெகுவாக குறைக்கவும்.\n3. ஆரம்ப சுகாதார நிலையத்தில் வாரம் ஒருமுறை தவறாமல் இரத்த அழுத்த பரிசோதித்துக் கொள்ளவும்.",
        hi: "🩺 ब्लड प्रेशर (BP) सलाह:\nसामान्य बीपी 120/80 होता है। यदि 180/110 से ऊपर हो तो तुरंत डॉक्टर को दिखाएं। नमक कम खाएं और नियमित दवा लें।"
      };
    }

    // 9. Diabetes / Blood Sugar
    if (
      text.includes("sugar") || text.includes("diabetes") || text.includes("glucose") ||
      text.includes("சர்க்கரை") || text.includes("நீரிழிவு") || text.includes("சுகர்") ||
      text.includes("sakkarai") ||
      text.includes("मधुमेह") || text.includes("शुगर")
    ) {
      return {
        en: "🩸 DIABETES & BLOOD GLUCOSE MANAGEMENT:\nFasting Blood Sugar should ideally be 70–110 mg/dL, and HbA1c < 7.0%. High glucose (>250 mg/dL) can lead to microvascular complications and renal stress. Check feet daily for ulcers, avoid walking barefoot, take medications on time, and consult the PHC doctor.",
        ta: "🩸 சர்க்கரை நோய் பராமரிப்பு:\nவெறும் வயிற்று இரத்த சர்க்கரை அளவு 70-110 ஆகவும், உணவுக்குப் பின் 140-க்குள் இருக்க வேண்டும்.\n1. கால்களை தினமும் பரிசோதித்து புண்கள் வராமல் பார்த்துக் கொள்ளவும்; வெறும் காலில் நடக்க வேண்டாம்.\n2. மாத்திரை அல்லது இன்சுலினை உணவுக்கு முன் தவறாமல் எடுத்துக் கொள்ளவும்.\n3. அதிக இனிப்பு, கிழங்கு வகைகள் தவிர்த்து நார்ச்சத்து மிக்க கீரைகள், காய்கறிகள் சாப்பிடவும்.",
        hi: "🩸 मधुमेह (डायबिटीज) सलाह:\nखाली पेट शुगर 70-110 mg/dL होनी चाहिए। पैरों की देखभाल करें, नंगे पैर न चलें और समय पर दवा लें।"
      };
    }

    // 10. Doctor / Appointment / Hospital / PHC
    if (
      text.includes("doctor") || text.includes("appointment") || text.includes("hospital") || text.includes("phc") ||
      text.includes("மருத்துவர்") || text.includes("டாக்டர்") || text.includes("முன்பதிவு") || text.includes("ஆஸ்பத்திரி") || text.includes("ஆரம்ப சுகாதார") ||
      text.includes("maruthuvar") ||
      text.includes("डॉक्टर") || text.includes("अस्पताल")
    ) {
      return {
        en: "👨‍⚕️ DOCTOR & TELECONSULTATION ASSISTANCE:\nYou can directly schedule a teleconsultation with our Primary Health Centre doctors via the 'Doctor Appointments' tab in this application. For emergency inpatient care, visit the 24/7 Upgraded PHC at Kallakurichi.",
        ta: "👨‍⚕️ மருத்துவர் ஆலோசனை & முன்பதிவு உதவி:\nஇந்த தளத்தின் 'மருத்துவர் முன்பதிவு' பிரிவில் சென்று கிடைக்கும் ஆரம்ப சுகாதார நிலைய மருத்துவர்களுடன் நீங்கள் தொலைபேசி அல்லது வீடியோ ஆலோசனையை பதிவு செய்யலாம். அவசர சிகிச்சைக்கு 24 மணி நேரமும் செயல்படும் அரசு ஆரம்ப சுகாதார நிலையத்தை நேரடியாக அணுகவும்.",
        hi: "👨‍⚕️ डॉक्टर अपॉइंटमेंट सहायता:\nआप 'डॉक्टर अपॉइंटमेंट' टैब में जाकर तुरंत टेली-परामर्श बुक कर सकते हैं। आपातकाल में नजदीकी पीएचसी जाएं।"
      };
    }

    // 11. Greeting / Vanakkam / Hello
    if (
      text.includes("hello") || text.includes("hi") || text.includes("namaste") ||
      text.includes("வணக்கம்") || text.includes("ஹலோ") || text.includes("நன்றி") ||
      text.includes("vanakkam") ||
      text.includes("नमस्ते")
    ) {
      return {
        en: "Hello! I am your AI Rural Health Assistant. How can I help you today? You can describe any symptoms (like fever, body pain, cough, or BP issues) or ask for first-aid guidance in English, Tamil, or Hindi.",
        ta: "வணக்கம்! நான் உங்கள் கிராமப்புற செயற்கை நுண்ணறிவு நல்வாழ்வு உதவியாளர். உங்களுக்கு இன்று நான் எவ்வாறு உதவ முடியும்? உங்களுக்கு ஏதேனும் காய்ச்சல், இருமல், நெஞ்சு வலி, இரத்த அழுத்தம், அல்லது முதலுதவி சந்தேகங்கள் இருந்தால் தமிழில் தட்டச்சு செய்தோ அல்லது மைக் மூலம் பேசியோ கேட்கலாம்.",
        hi: "नमस्ते! मैं आपका ग्रामीण स्वास्थ्य एआई सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ? अपने लक्षण बताएं या बोलकर पूछें।"
      };
    }

    // Default intelligent clinical guidance
    return {
      en: `Thank you for sharing your symptoms regarding "${userText}". Please ensure adequate hydration and rest. You can use the 'Symptom Checker' tab to enter exact vitals (BP, SpO2, Temperature) for an automated clinical risk assessment, or consult a Medical Officer if symptoms worsen.`,
      ta: `உங்கள் தகவலுக்கு நன்றி. "${userText}" தொடர்பான அறிகுறிகளுக்கு போதுமான ஓய்வு மற்றும் நீர்ச்சத்து மிக அவசியமாகும். உங்கள் இரத்த அழுத்தம், ஆக்சிஜன் அளவு, உடல் வெப்பநிலை ஆகியவற்றை 'அறிகுறி பரிசோதனை' பிரிவில் உள்ளிட்டு முழுமையான செயற்கை நுண்ணறிவு அபாய மதிப்பீட்டைக் கண்டறியலாம். அறிகுறிகள் தொடர்ந்தால் உடனே ஆரம்ப சுகாதார நிலைய மருத்துவரை அணுகவும்.`,
      hi: `जानकारी साझा करने के लिए धन्यवाद। "${userText}" के लिए पर्याप्त आराम और पानी पिएं। सटीक जोखिम स्कोर हेतु 'लक्षण जांच' में जाकर वाइटल्स दर्ज करें।`
    };
  }

  // Localized prompt chips
  const promptChips = {
    en: [
      { text: "Baby has 102°F fever for 2 days", icon: "🌡️" },
      { text: "Chest heaviness and shortness of breath", icon: "💔" },
      { text: "Emergency: Snakebite first aid steps", icon: "🐍" },
      { text: "Warning signs during 3rd trimester", icon: "🤰" },
      { text: "Severe diarrhea and dehydration relief", icon: "🤢" },
      { text: "High BP reading 170/100 guidance", icon: "🩺" }
    ],
    ta: [
      { text: "குழந்தைக்கு 2 நாட்களாக 102°F காய்ச்சல் உள்ளது", icon: "🌡️" },
      { text: "நெஞ்சு பாரம் மற்றும் கடுமையான மூச்சுத்திணறல்", icon: "💔" },
      { text: "பாம்புக்கடி அவசர முதலுதவி என்ன செய்ய வேண்டும்?", icon: "🐍" },
      { text: "கர்ப்ப காலத்தில் தோன்றும் எச்சரிக்கை அறிகுறிகள்", icon: "🤰" },
      { text: "வாந்தி மற்றும் வயிற்றுப்போக்குக்கு முதலுதவி என்ன?", icon: "🤢" },
      { text: "இரத்த அழுத்தம் 170/100 ஆக உயர்ந்தால் என்ன செய்வது?", icon: "🩺" }
    ],
    hi: [
      { text: "बच्चे को 2 दिन से 102°F तेज बुखार है", icon: "🌡️" },
      { text: "सीने में जकड़न और सांस लेने में कठिनाई", icon: "💔" },
      { text: "सांप काटने पर आपातकालीन प्राथमिक उपचार", icon: "🐍" },
      { text: "गर्भावस्था की तीसरी तिमाही में खतरे के संकेत", icon: "🤰" },
      { text: "उल्टी और दस्त में निर्जलीकरण से बचाव", icon: "🤢" },
      { text: "हाई ब्लड प्रेशर 170/100 पर क्या करें?", icon: "🩺" }
    ]
  };

  const activeChips = promptChips[currentLang] || promptChips.en;
  const stopVoiceLabel = currentLang === 'ta' ? 'குரலை நிறுத்து' : currentLang === 'hi' ? 'आवाज़ बंद करें' : 'Stop Audio';
  const listenLabel = currentLang === 'ta' ? 'தமிழில் கேட்க' : currentLang === 'hi' ? 'बोलकर सुनें' : 'Listen';
  const micPrompt = currentLang === 'ta' ? 'தமிழில் பேச மைக் தொடவும்' : currentLang === 'hi' ? 'बोलने के लिए माइक दबाएं' : 'Click mic to speak';
  const listeningText = currentLang === 'ta' ? '🎙️ தமிழில் பேசுங்கள்... கேட்கிறது...' : currentLang === 'hi' ? '🎙️ बोलिए... सुन रहे हैं...' : '🎙️ Listening... Speak now...';

  function render() {
    container.innerHTML = `
      <div class="page-intro">
        <div>
          <h2 class="page-title">
            <span>💬</span> ${t('chat_title')}
          </h2>
          <p class="page-description">${t('chat_desc')}</p>
        </div>
      </div>

      <div class="chat-container">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">🌿</div>
            <div>
              <strong style="font-size:0.95rem; display:block;">Swasthya Sahayak (சுகாதாரத் தோழன்)</strong>
              <small style="color:var(--primary); font-weight:600; display:inline-flex; align-items:center; gap:4px;">
                <span class="status-dot-pulse"></span>
                ${currentLang === 'ta' ? 'தமிழ் குரல் வழி உரையாடல் செயல்படுகிறது' : currentLang === 'hi' ? 'हिंदी वॉयस चैट सक्रिय' : 'Live Multilingual Voice AI (Tamil / Hindi / English)'}
              </small>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button id="chat-auto-speak-btn" class="btn btn-secondary btn-sm ${autoSpeakEnabled ? 'active-voice-mode' : ''}" title="Toggle Auto-Speak">
              ${autoSpeakEnabled ? '🔊 ' + (currentLang === 'ta' ? 'தானியங்கி குரல்: ஆன்' : 'Auto-Speak: ON') : '🔈 ' + (currentLang === 'ta' ? 'தானியங்கி குரல்: ஆஃப்' : 'Auto-Speak: OFF')}
            </button>
            <button id="chat-stop-speech-btn" class="btn btn-secondary btn-sm" title="Stop Audio Playback">
              🔇 ${stopVoiceLabel}
            </button>
          </div>
        </div>

        <!-- Voice Recognition Status Bar (Hidden until Mic clicked) -->
        <div id="chat-voice-status" class="chat-voice-status hidden">
          <div class="voice-pulse-ring"></div>
          <span id="voice-status-text">${listeningText}</span>
          <button id="voice-cancel-btn" class="btn-voice-cancel">✕</button>
        </div>

        <!-- Chat Messages Log -->
        <div class="chat-messages" id="chat-messages-log">
          ${messages.map((m, idx) => renderMessageItem(m, idx)).join('')}
        </div>

        <!-- Quick Prompts Chips Bar -->
        <div class="quick-prompts-bar">
          ${activeChips.map(c => `
            <button class="quick-chip" data-text="${c.text}">
              ${c.icon} ${c.text}
            </button>
          `).join('')}
        </div>

        <!-- Input Bar with Voice Mic -->
        <form class="chat-input-row" id="chat-form">
          <button 
            type="button" 
            id="chat-mic-btn" 
            class="btn-mic ${isRecording ? 'recording' : ''}" 
            title="${micPrompt}"
            aria-label="${micPrompt}"
          >
            <span class="mic-icon">🎙️</span>
          </button>
          <input 
            type="text" 
            id="chat-input-text" 
            class="form-input chat-text-field" 
            placeholder="${currentLang === 'ta' ? 'தமிழில் தட்டச்சு செய்யவும் அல்லது மைக் மூலம் பேசவும்...' : t('chat_placeholder')}" 
            autocomplete="off" 
          />
          <button type="submit" class="btn btn-primary" id="chat-send-btn">
            <span>🚀</span> ${t('send_btn')}
          </button>
        </form>
      </div>
    `;

    attachEvents();
    scrollToBottom();
  }

  function renderMessageItem(m, idx) {
    const isBot = m.sender === 'bot';
    const formattedText = m.text.replace(/\n/g, '<br />');
    const msgLang = m.lang || (detectLanguage(m.text, currentLang));

    return `
      <div class="message-bubble ${isBot ? 'message-bot' : 'message-user'}" data-index="${idx}">
        <div class="message-content">${formattedText}</div>
        <div class="message-meta">
          <span class="message-time">${m.time || ''}</span>
          ${isBot ? `
            <button class="btn-tts msg-tts-btn" data-msg-idx="${idx}" data-msg-lang="${msgLang}">
              <span class="tts-icon">🔊</span>
              <span>${msgLang === 'ta' ? 'தமிழில் கேட்க' : listenLabel}</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  function scrollToBottom() {
    const log = container.querySelector('#chat-messages-log');
    if (log) {
      log.scrollTop = log.scrollHeight;
    }
  }

  function handleSend(userText) {
    if (!userText || !userText.trim()) return;

    const detectedLang = detectLanguage(userText, currentLang);

    // Add user message
    messages.push({
      sender: "user",
      text: userText,
      time: detectedLang === 'ta' ? "சற்றுமுன்" : "Just now",
      lang: detectedLang
    });

    const aiRespObj = getAiResponse(userText, detectedLang);
    const aiText = aiRespObj[detectedLang] || aiRespObj[currentLang] || aiRespObj.en;

    messages.push({
      sender: "bot",
      text: aiText,
      time: detectedLang === 'ta' ? "சற்றுமுன்" : "Just now",
      lang: detectedLang
    });

    render();

    // Trigger voice readout in the detected Tamil/Hindi/English language if auto-speak is enabled
    if (autoSpeakEnabled) {
      speechService.speak(aiText, detectedLang);
    }
  }

  function startVoiceInput() {
    const voiceStatus = container.querySelector('#chat-voice-status');
    const statusText = container.querySelector('#voice-status-text');
    const input = container.querySelector('#chat-input-text');
    const micBtn = container.querySelector('#chat-mic-btn');

    if (voiceStatus) voiceStatus.classList.remove('hidden');
    if (micBtn) micBtn.classList.add('recording');
    isRecording = true;

    const success = speechRecognitionService.startListening({
      lang: currentLang === 'ta' ? 'ta' : currentLang === 'hi' ? 'hi' : 'en',
      onInterim: (text) => {
        if (input) input.value = text;
        if (statusText) statusText.textContent = `🎙️ "${text}"...`;
      },
      onResult: (text) => {
        if (input) input.value = text;
        stopVoiceInput();
        handleSend(text);
      },
      onError: (err) => {
        console.warn("STT error:", err);
        stopVoiceInput();
        if (statusText) statusText.textContent = currentLang === 'ta' ? "குரல் பதிவு பிழை. மீண்டும் முயற்சிக்கவும்." : "Mic error. Please try again.";
      },
      onEnd: () => {
        stopVoiceInput();
      }
    });

    if (!success) {
      stopVoiceInput();
      alert(currentLang === 'ta' 
        ? "உங்கள் உலாவியில் குரல் அறிதல் (Speech Recognition) ஆதரிக்கப்படவில்லை. தயவுசெய்து Google Chrome அல்லது Microsoft Edge உலாவியைப் பயன்படுத்தவும்."
        : "Speech recognition is not supported or microphone access was blocked in this browser. Please use Google Chrome or Microsoft Edge.");
    }
  }

  function stopVoiceInput() {
    isRecording = false;
    speechRecognitionService.stopListening();
    const voiceStatus = container.querySelector('#chat-voice-status');
    const micBtn = container.querySelector('#chat-mic-btn');
    if (voiceStatus) voiceStatus.classList.add('hidden');
    if (micBtn) micBtn.classList.remove('recording');
  }

  function attachEvents() {
    const form = container.querySelector('#chat-form');
    const input = container.querySelector('#chat-input-text');
    const micBtn = container.querySelector('#chat-mic-btn');
    const cancelVoiceBtn = container.querySelector('#voice-cancel-btn');
    const autoSpeakBtn = container.querySelector('#chat-auto-speak-btn');
    const stopBtn = container.querySelector('#chat-stop-speech-btn');

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = input.value;
        input.value = '';
        handleSend(val);
      });
    }

    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (isRecording) {
          stopVoiceInput();
        } else {
          startVoiceInput();
        }
      });
    }

    if (cancelVoiceBtn) {
      cancelVoiceBtn.addEventListener('click', () => {
        stopVoiceInput();
      });
    }

    if (autoSpeakBtn) {
      autoSpeakBtn.addEventListener('click', () => {
        autoSpeakEnabled = !autoSpeakEnabled;
        render();
      });
    }

    container.querySelectorAll('.quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-text');
        handleSend(text);
      });
    });

    container.querySelectorAll('.msg-tts-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-msg-idx'));
        const lang = btn.getAttribute('data-msg-lang') || currentLang;
        if (messages[idx]) {
          speechService.toggle(messages[idx].text, lang, btn);
        }
      });
    });

    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        speechService.stop();
        container.querySelectorAll('.btn-tts').forEach(b => b.classList.remove('speaking'));
      });
    }
  }

  render();
}
