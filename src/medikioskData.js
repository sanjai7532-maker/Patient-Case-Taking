// MediKiosk AI Clinical History Data, Clinical Ontologies & ABDM Engine
// Implements Modules A, B, C, D per National Health Systems & ABDM guidelines

export const CHIEF_COMPLAINTS = [
  {
    id: "chest_pain",
    title: { en: "Chest Pain / Discomfort", ta: "மார்பு வலி / அசௌகரியம்", hi: "सीने में दर्द या बेचैनी" },
    icon: "💔",
    category: "cardiovascular",
    redFlagTrigger: true,
    socrates: {
      site: {
        question: { en: "Where exactly is the pain located?", ta: "வலி எங்கு சரியாக இருக்கிறது?", hi: "दर्द ठीक कहाँ पर महसूस हो रहा है?" },
        options: [
          { id: "substernal", label: { en: "Center of Chest (Behind Breastbone)", ta: "மார்பின் நடுப்பகுதி", hi: "सीने के ठीक बीच में" } },
          { id: "left_sided", label: { en: "Left side of chest", ta: "இடது பக்க மார்பு", hi: "सीने के बाईं तरफ" } },
          { id: "epigastric", label: { en: "Upper stomach / lower sternum", ta: "மேல் வயிறு / நெஞ்செரிச்சல் பகுதி", hi: "पेट के ऊपरी हिस्से में" } },
          { id: "diffuse", label: { en: "Diffuse / Across entire chest", ta: "மார்பு முழுவதும் பரவியுள்ளது", hi: "पूरे सीने में फैला हुआ" } }
        ]
      },
      onset: {
        question: { en: "How quickly did the discomfort start?", ta: "வலி எவ்வாறு தொடங்கியது?", hi: "दर्द की शुरुआत कैसे हुई?" },
        options: [
          { id: "sudden", label: { en: "Suddenly (within minutes)", ta: "திடீரென (சில நிமிடங்களில்)", hi: "अचानक (कुछ ही मिनटों में)" } },
          { id: "gradual", label: { en: "Gradually developed over hours", ta: "படிப்படியாக அதிகரித்தது", hi: "धीरे-धीरे घंटों में बढ़ा" } },
          { id: "exertion", label: { en: "Started right during physical activity / walking", ta: "நடக்கும் போது அல்லது உழைப்பின் போது தொடங்கியது", hi: "चलने या मेहनत करते समय शुरू हुआ" } }
        ]
      },
      character: {
        question: { en: "What does the pain feel like?", ta: "வலியின் தன்மை எப்படி உள்ளது?", hi: "दर्द किस प्रकार का महसूस होता है?" },
        options: [
          { id: "crushing", label: { en: "Heavy squeezing, crushing, or tight band", ta: "கனமான அழுத்தம் / இறுக்குவது போன்ற வலி", hi: "भारी दबाव / निचोड़ने जैसा दर्द" }, redFlag: true },
          { id: "burning", label: { en: "Burning sensation / acidity", ta: "நெஞ்செரிச்சல் போன்ற வலி", hi: "जलन या एसिडिटी जैसा" } },
          { id: "sharp", label: { en: "Sharp / stabbing on deep breath", ta: "மூச்சு விடும்போது குத்தும் வலி", hi: "गहरी सांस लेने पर चुभने वाला दर्द" } },
          { id: "dull", label: { en: "Dull ache", ta: "லேசான தொடர் வலி", hi: "हल्का लगातार मीठा दर्द" } }
        ]
      },
      radiation: {
        question: { en: "Does the pain travel or radiate anywhere?", ta: "வலி வேறு எங்காவது பரவுகிறதா?", hi: "क्या दर्द कहीं और भी फैल रहा है?" },
        options: [
          { id: "left_arm_jaw", label: { en: "To left shoulder, arm, or jaw", ta: "இடது தோள்பட்டை, கை அல்லது தாடைக்கு", hi: "बाएं कंधे, हाथ या जबड़े तक" }, redFlag: true },
          { id: "back", label: { en: "Straight through to the back", ta: "முதுகுப் பகுதிக்கு", hi: "पीठ के हिस्से में" } },
          { id: "none", label: { en: "Stays localized in chest only", ta: "மார்பில் மட்டுமே உள்ளது", hi: "सिर्फ सीने तक ही सीमित है" } }
        ]
      },
      associations: {
        question: { en: "Are you experiencing any accompanying symptoms?", ta: "வேறு ஏதேனும் உபாதைகள் சேர்ந்து உள்ளதா?", hi: "क्या इसके साथ अन्य लक्षण भी हैं?" },
        options: [
          { id: "sweating", label: { en: "Profuse cold sweating (Diaphoresis)", ta: "குளிர்ந்த வியர்வை கொட்டுதல்", hi: "ठंडा पसीना छूटना" }, redFlag: true },
          { id: "dyspnea", label: { en: "Breathlessness / Air hunger", ta: "மூச்சுத் திணறல்", hi: "सांस फूलना" }, redFlag: true },
          { id: "nausea", label: { en: "Nausea or Vomiting", ta: "குமட்டல் அல்லது வாந்தி", hi: "उल्टी या जी मिचलाना" } },
          { id: "palpitations", label: { en: "Heart racing / Thumping", ta: "நெஞ்சு படபடப்பு", hi: "दिल की तेज धड़कन" } }
        ]
      },
      timing: {
        question: { en: "How long has this pain been present?", ta: "இந்த வலி எவ்வளவு நேரமாக உள்ளது?", hi: "यह दर्द कितनी देर से बना हुआ है?" },
        options: [
          { id: "less_30m", label: { en: "Under 30 minutes (Active acute)", ta: "30 நிமிடங்களுக்கும் குறைவாக", hi: "30 मिनट से कम समय से" } },
          { id: "1_2h", label: { en: "1 to 2 hours", ta: "1 - 2 மணி நேரமாக", hi: "1 से 2 घंटे से" } },
          { id: "days", label: { en: "Intermittent over several days", ta: "பல நாட்களாக விட்டு விட்டு", hi: "कई दिनों से कभी-कभी" } }
        ]
      },
      exacerbating: {
        question: { en: "What makes it better or worse?", ta: "எது வலியை அதிகரிக்கிறது அல்லது குறைக்கிறது?", hi: "किस चीज़ से दर्द बढ़ता या घटता है?" },
        options: [
          { id: "rest_relieves", label: { en: "Worse on walking/stairs, better on rest", ta: "ஓய்வெடுத்தால் குறைகிறது, நடந்தால் கூடுகிறது", hi: "चलने पर बढ़ता है, आराम करने पर घटता है" } },
          { id: "unrelieved", label: { en: "Continuous even while sitting quietly", ta: "அமைதியாக அமர்ந்திருந்தாலும் குறையவில்லை", hi: "शांति से बैठने पर भी लगातार बना हुआ है" }, redFlag: true },
          { id: "antacid", label: { en: "Improves after antacids / drinking water", ta: "தண்ணீர் அல்லது மருந்து குடித்தால் குறைகிறது", hi: "पानी या एंटासिड लेने पर आराम मिलता है" } }
        ]
      },
      severity: {
        question: { en: "Rate your pain severity (1 to 10)", ta: "வலியின் தீவிரத்தை 1 முதல் 10 வரை மதிப்பிடுங்கள்", hi: "दर्द की तीव्रता 1 से 10 के पैमाने पर चुनें" },
        scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
    }
  },
  {
    id: "breathlessness",
    title: { en: "Shortness of Breath / Breathing Difficulty", ta: "மூச்சுத் திணறல் / சுவாசிப்பதில் சிரமம்", hi: "सांस लेने में तकलीफ या घबराहट" },
    icon: "🫁",
    category: "respiratory",
    redFlagTrigger: true,
    socrates: {
      site: {
        question: { en: "Where do you feel the restriction?", ta: "சிரமம் எங்கு அதிகமாக உணரப்படுகிறது?", hi: "सांस में रुकावट कहाँ महसूस हो रही है?" },
        options: [
          { id: "throat", label: { en: "Throat / windpipe choking", ta: "தொண்டை அடைப்பது போல்", hi: "गले में घुटन जैसा" } },
          { id: "chest_tight", label: { en: "Chest tightness / unable to expand lungs", ta: "மார்பு இறுக்கம், சுவாசிக்க முடியவில்லை", hi: "सीने में जकड़न, फेफड़े नहीं फूल रहे" } }
        ]
      },
      onset: {
        question: { en: "How did the breathing difficulty begin?", ta: "சுவாசப் பிரச்சனை எவ்வாறு தொடங்கியது?", hi: "सांस की तकलीफ कैसे शुरू हुई?" },
        options: [
          { id: "sudden_dyspnea", label: { en: "Sudden onset within minutes", ta: "திடீரென சில நிமிடங்களில்", hi: "अचानक कुछ ही मिनटों में" }, redFlag: true },
          { id: "chronic_worsening", label: { en: "Longstanding cough/asthma getting worse", ta: "நீண்ட நாள் ஆஸ்துமா/இருமல் அதிகரித்துள்ளது", hi: "पुरानी सांस की बीमारी या खांसी बढ़ी है" } }
        ]
      },
      character: {
        question: { en: "How does the breathing feel?", ta: "சுவாசம் எவ்வாறு உள்ளது?", hi: "सांस लेने में क्या आवाज या अहसास होता है?" },
        options: [
          { id: "wheezing", label: { en: "Wheezing / Whistling chest sounds", ta: "சீழ்க்கை ஒலி / வீசிங் சத்தம்", hi: "सीने से सीटी जैसी आवाज (घरघराहट)" } },
          { id: "gasping", label: { en: "Gasping for air even while speaking", ta: "பேசும் போதே மூச்சு வாங்குதல்", hi: "बात करते समय भी सांस फूलना" }, redFlag: true },
          { id: "shallow", label: { en: "Rapid, shallow breathing", ta: "வேகமான மேலோட்டமான சுவாசம்", hi: "तेज़ और उथली सांसें" } }
        ]
      },
      radiation: {
        question: { en: "Any swelling noticed in body?", ta: "உடலில் வீக்கம் ஏதேனும் உள்ளதா?", hi: "क्या शरीर या पैरों में सूजन है?" },
        options: [
          { id: "pedal_edema", label: { en: "Swelling in both feet / ankles", ta: "இரு கால்களிலும் பாத வீக்கம்", hi: "दोनों पैरों या टखनों में सूजन" } },
          { id: "facial_puffiness", label: { en: "Facial puffiness", ta: "முக வீக்கம்", hi: "चेहरे पर सूजन" } },
          { id: "none", label: { en: "No swelling", ta: "வீக்கம் இல்லை", hi: "कोई सूजन नहीं" } }
        ]
      },
      associations: {
        question: { en: "Do you have fever, cough, or sputum?", ta: "காய்ச்சல், இருமல் அல்லது சளி உள்ளதா?", hi: "क्या बुखार, खांसी या बलगम भी है?" },
        options: [
          { id: "fever_sputum", label: { en: "High fever + yellow/green sputum", ta: "காய்ச்சல் மற்றும் கெட்டி சளி", hi: "तेज बुखार और पीला/हरा बलगम" } },
          { id: "blood_sputum", label: { en: "Coughing up traces of blood (Hemoptysis)", ta: "இருமலில் இரத்தம் வருதல்", hi: "खांसी में खून आना" }, redFlag: true },
          { id: "dry_cough", label: { en: "Dry cough only", ta: "வறட்டு இருமல் மட்டும்", hi: "सिर्फ सूखी खांसी" } }
        ]
      },
      timing: {
        question: { en: "Is it worse when lying flat in bed?", ta: "படுக்கும் போது மூச்சுத் திணறல் அதிகமாகிறதா?", hi: "क्या बिस्तर पर सीधे लेटने पर सांस ज्यादा फूलती है?" },
        options: [
          { id: "orthopnea", label: { en: "Yes, need 2-3 pillows to sleep (Orthopnea)", ta: "ஆம், படுத்தால் மூச்சுத் திணறும் (2-3 தலையணை தேவை)", hi: "हाँ, लेटने पर सांस फूलती है (ऑर्थोपनिया)" } },
          { id: "pnd", label: { en: "Wakes up suffocating at 2 AM (PND)", ta: "நடு இரவில் மூச்சுத்திணறி விழிப்பு வருகிறது", hi: "आधी रात में सांस रुकने से अचानक नींद खुलना" }, redFlag: true },
          { id: "same", label: { en: "No difference with posture", ta: "படுத்தாலும் ஒரே மாதிரியாக உள்ளது", hi: "पोजीशन से कोई फर्क नहीं पड़ता" } }
        ]
      },
      exacerbating: {
        question: { en: "Triggers for this episode:", ta: "தூண்டும் காரணிகள்:", hi: "यह तकलीफ किस वजह से बढ़ती है:" },
        options: [
          { id: "dust_cold", label: { en: "Dust exposure, smoke, or cold weather", ta: "தூசி, புகை அல்லது குளிர் காற்று", hi: "धूल, धुआं या ठंडी हवा" } },
          { id: "minimal_exertion", label: { en: "Walking even 10 steps to the bathroom", ta: "10 அடிகள் நடந்தாலும் மூச்சு வாங்குதல்", hi: "कमरे में 10 कदम चलने पर भी सांस फूलना" } }
        ]
      },
      severity: {
        question: { en: "Rate breathing difficulty (1 to 10)", ta: "சிரமத்தின் தீவிரத்தை 1-10 வரை குறிக்கவும்", hi: "सांस की तकलीफ की तीव्रता (1 से 10)" },
        scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
    }
  },
  {
    id: "abdominal_pain",
    title: { en: "Severe Stomach / Abdominal Pain", ta: "கடுமையான வயிற்று வலி", hi: "पेट में तेज दर्द / मरोड़" },
    icon: "⚡",
    category: "gastrointestinal",
    redFlagTrigger: false,
    socrates: {
      site: {
        question: { en: "Which quadrant of your abdomen hurts most?", ta: "வயிற்றின் எந்தப் பகுதியில் அதிக வலி உள்ளது?", hi: "पेट के किस हिस्से में सबसे ज्यादा दर्द है?" },
        options: [
          { id: "right_lower", label: { en: "Right lower abdomen (McBurney point)", ta: "வலது அடிவயிறு", hi: "पेट के निचले दाएं हिस्से में (अपेंडिक्स क्षेत्र)" } },
          { id: "epigastrium", label: { en: "Upper middle abdomen", ta: "மேல் வயிறு நடுப்பகுதி", hi: "पेट के ऊपरी बीच के हिस्से में" } },
          { id: "right_upper", label: { en: "Right upper under ribcage (Gallbladder area)", ta: "வலது விலா எலும்புக்கு கீழ்", hi: "पसलियों के नीचे दाहिनी तरफ" } },
          { id: "generalized", label: { en: "All over abdomen with bloating", ta: "வயிறு முழுவதும் வீக்கத்துடன் வலி", hi: "पूरे पेट में भारीपन और दर्द" } }
        ]
      },
      onset: {
        question: { en: "When did this pain start?", ta: "எப்போது ஆரம்பித்தது?", hi: "यह दर्द कब शुरू हुआ?" },
        options: [
          { id: "few_hours", label: { en: "Past 4-8 hours with sudden cramp", ta: "கடந்த 4-8 மணி நேரத்திற்குள் திடீரென", hi: "पिछले 4-8 घंटों में अचानक" } },
          { id: "days", label: { en: "Developing over 2-3 days", ta: "2-3 நாட்களாக படிப்படியாக", hi: "2-3 दिनों से धीरे-धीरे" } }
        ]
      },
      character: {
        question: { en: "What kind of abdominal pain is it?", ta: "வலி எப்படிப்பட்டது?", hi: "दर्द की प्रकृति कैसी है?" },
        options: [
          { id: "colicky", label: { en: "Colicky (comes in intense waves)", ta: "அலை அலையாக வரும் பிடிப்பு வலி", hi: "मरोड़ वाला दर्द (लहरों की तरह आता है)" } },
          { id: "burning", label: { en: "Constant burning gnawing ache", ta: "எரியும் போன்ற தொடர் வலி", hi: "लगातार तेज जलन वाला दर्द" } },
          { id: "rigid", label: { en: "Severe rigid, cannot touch abdomen", ta: "வயிறு விறைத்து தொட்டாலே வலி", hi: "पेट एकदम कड़ा और छूने पर बहुत दर्द" }, redFlag: true }
        ]
      },
      radiation: {
        question: { en: "Does it radiate to back or groin?", ta: "முதுகு அல்லது இடுப்புப் பகுதிக்கு பரவுகிறதா?", hi: "क्या दर्द पीठ या कमर की तरफ जाता है?" },
        options: [
          { id: "groin", label: { en: "Down to groin / testes (Renal colic suspect)", ta: "இடுப்பு/பிறப்புறுப்பு பகுதி வரை", hi: "नीचे कमर व जांघ की ओर (पथरी का संकेत)" } },
          { id: "shoulder", label: { en: "Up to right shoulder blade", ta: "வலது தோள்பட்டை வரை", hi: "दाहिने कंधे के पीछे तक" } },
          { id: "none", label: { en: "No radiation", ta: "பரவவில்லை", hi: "कहीं नहीं फैलता" } }
        ]
      },
      associations: {
        question: { en: "Any vomiting, fever, or black stools?", ta: "வாந்தி, காய்ச்சல் அல்லது கருப்பு மலம் உள்ளதா?", hi: "क्या उल्टी, बुखार या काला मल आया है?" },
        options: [
          { id: "hematemesis", label: { en: "Vomiting blood or black coffee-ground material", ta: "இரத்த வாந்தி அல்லது கருப்பு வாந்தி", hi: "उल्टी में खून आना या काला खून" }, redFlag: true },
          { id: "fever_vomit", label: { en: "Fever + repeated vomiting", ta: "காய்ச்சல் மற்றும் தொடர் வாந்தி", hi: "बुखार और बार-बार उल्टी" } },
          { id: "none", label: { en: "None of these", ta: "இவை எதுவும் இல்லை", hi: "इनमें से कोई नहीं" } }
        ]
      },
      timing: {
        question: { en: "Relation to food intake:", ta: "உணவுக்கும் வலிக்கும் உள்ள தொடர்பு:", hi: "खाने से दर्द का क्या संबंध है:" },
        options: [
          { id: "empty_stomach", label: { en: "Worse on empty stomach, relieved by food", ta: "வெறும் வயிற்றில் கூடுகிறது, சாப்பிட்டால் குறைகிறது", hi: "खाली पेट बढ़ता है, खाना खाने पर आराम" } },
          { id: "after_fatty", label: { en: "Severe 30 mins after oily/fatty meal", ta: "எண்ணெய் உணவு உண்ட 30 நிமிடங்களில்", hi: "तले-भुने खाने के 30 मिनट बाद तेज दर्द" } },
          { id: "no_relation", label: { en: "Constant regardless of food", ta: "உணவுக்கும் தொடர்பு இல்லை", hi: "खाने से कोई लेना-देना नहीं" } }
        ]
      },
      exacerbating: {
        question: { en: "Does moving or coughing worsen the pain?", ta: "இருமல் அல்லது அசைவு வலியை கூட்டுகிறதா?", hi: "क्या खांसने या हिलने पर दर्द तेज होता है?" },
        options: [
          { id: "rebound", label: { en: "Agonizing when car bumps or walking (Peritoneal sign)", ta: "வண்டி அசைவு அல்லது நடக்கும்போது தாங்க முடியாத வலி", hi: "झटके लगने या चलने पर असहनीय दर्द" }, redFlag: true },
          { id: "tolerable", label: { en: "Tolerable with gentle walking", ta: "மெதுவாக நடக்க முடிகிறது", hi: "हल्का चलने पर बर्दाश्त हो जाता है" } }
        ]
      },
      severity: {
        question: { en: "Rate pain severity (1 to 10)", ta: "வலியின் அளவை தெரிவு செய்க", hi: "दर्द की तीव्रता (1 से 10)" },
        scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
    }
  },
  {
    id: "fever_rigors",
    title: { en: "High Fever with Chills & Bodyache", ta: "குளிர் நடுக்கத்துடன் கூடிய அதிக காய்ச்சல்", hi: "कंपकंपी के साथ तेज बुखार व बदन दर्द" },
    icon: "🌡️",
    category: "infectious",
    redFlagTrigger: false,
    socrates: {
      site: {
        question: { en: "Where is the body ache most concentrated?", ta: "உடல் வலி எங்கு அதிகமாக உள்ளது?", hi: "बदन में दर्द मुख्य रूप से कहाँ है?" },
        options: [
          { id: "retro_orbital", label: { en: "Behind the eyes and back of head (Dengue pattern)", ta: "கண்களின் பின்புறம் & தலைப்பகுதி", hi: "आंखों के पीछे और सिर में (डेंगू पैटर्न)" } },
          { id: "joints", label: { en: "Severe multiple joint pain (Chikungunya pattern)", ta: "கை, கால் மூட்டுகளில் கடுமையான வலி", hi: "जोड़ों में असहनीय दर्द (चिकनगुनिया पैटर्न)" } },
          { id: "generalized", label: { en: "General whole-body malaise", ta: "உடல் முழுவதும் சோர்வு", hi: "पूरे शरीर में भारीपन और थकान" } }
        ]
      },
      onset: {
        question: { en: "How did the fever begin?", ta: "காய்ச்சல் எப்படி ஆரம்பித்தது?", hi: "बुखार कैसे शुरू हुआ?" },
        options: [
          { id: "sudden_high", label: { en: "Sudden high spike >103°F with teeth chattering", ta: "திடீரென பல் கிட்டிக்கும் நடுக்கத்துடன்", hi: "दांत किटकिटाने और कंपकंपी के साथ 103°F+" } },
          { id: "step_ladder", label: { en: "Gradual step-ladder rise over several days", ta: "படிப்படியாக நாளுக்கு நாள் கூடியது", hi: "दिन-ब-दिन सीढ़ी की तरह बढ़ता गया (टाइफाइड)" } }
        ]
      },
      character: {
        question: { en: "Fever pattern during the day:", ta: "நாளின் காய்ச்சல் முறை:", hi: "बुखार का दैनिक चक्र कैसा रहता है:" },
        options: [
          { id: "alternate_day", label: { en: "Comes every alternate day / specific time (Malaria)", ta: "ஒரு நாள் விட்டு ஒரு நாள் குறிப்பிட்ட நேரத்தில்", hi: "एक दिन छोड़कर या निश्चित समय पर आता है (मलेरिया)" } },
          { id: "continuous", label: { en: "Continuous fever without sweating", ta: "வியர்க்காமல் தொடர் காய்ச்சல்", hi: "लगातार तेज बुखार बना रहता है" } }
        ]
      },
      radiation: {
        question: { en: "Any rash or bleeding spots noticed?", ta: "தோலில் தடிப்புகள் அல்லது இரத்தப் புள்ளிகள் உள்ளதா?", hi: "क्या त्वचा पर लाल दाने या खून के चकत्ते दिखे हैं?" },
        options: [
          { id: "petechiae", label: { en: "Tiny red dots on skin / bleeding gums", ta: "ஈறுகளில் இரத்தம் / தோலில் சிவப்பு புள்ளிகள்", hi: "त्वचा पर लाल चकत्ते या मसूड़ों से खून" }, redFlag: true },
          { id: "none", label: { en: "No rash or bleeding", ta: "புள்ளிகள் இல்லை", hi: "कोई चकत्ते नहीं" } }
        ]
      },
      associations: {
        question: { en: "Any altered sensorium or extreme lethargy?", ta: "மயக்க நிலை அல்லது கடுமையான சோர்வு உள்ளதா?", hi: "क्या अत्यधिक बेहोशी या भ्रम की स्थिति है?" },
        options: [
          { id: "confusion", label: { en: "Patient drowsy, confused, or talking irrelevantly", ta: "நோயாளி மயக்கமாக உள்ளார் அல்லது குழப்பமாக பேசுகிறார்", hi: "मरीज बेहोश हो रहा है या बहकी बातें कर रहा है" }, redFlag: true },
          { id: "alert", label: { en: "Fully conscious and alert", ta: "முழு சுயநினைவுடன் உள்ளார்", hi: "पूरी तरह होश में है" } }
        ]
      },
      timing: {
        question: { en: "How many days has fever lasted?", ta: "காய்ச்சல் எத்தனை நாட்களாக உள்ளது?", hi: "बुखार कितने दिनों से चल रहा है?" },
        options: [
          { id: "1_2_days", label: { en: "1 to 2 days", ta: "1 - 2 நாட்கள்", hi: "1 से 2 दिन" } },
          { id: "3_5_days", label: { en: "3 to 5 days", ta: "3 - 5 நாட்கள்", hi: "3 से 5 दिन" } },
          { id: "more_7_days", label: { en: "More than 7 days (Prolonged fever)", ta: "7 நாட்களுக்கு மேல்", hi: "7 दिनों से अधिक (लगातार बुखार)" } }
        ]
      },
      exacerbating: {
        question: { en: "Did fever respond to Paracetamol?", ta: "பாராசிட்டமால் மாத்திரைக்கு காய்ச்சல் குறைந்ததா?", hi: "क्या पैरासिटामोल से बुखार उतरा?" },
        options: [
          { id: "temporary", label: { en: "Drops for 4 hours then spikes right back", ta: "4 மணி நேரம் மட்டும் குறைகிறது, பின் ஏறுகிறது", hi: "4 घंटे उतरता है फिर तेज हो जाता है" } },
          { id: "unresponsive", label: { en: "Does not come down at all", ta: "மாத்திரை போட்டும் குறையவில்லை", hi: "दवा से बिल्कुल नहीं उतर रहा" } }
        ]
      },
      severity: {
        question: { en: "Rate severity of weakness (1 to 10)", ta: "பலவீனத்தின் தீவிரத்தை மதிப்பிடுங்கள்", hi: "कमजोरी का स्तर चुनें (1 से 10)" },
        scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
    }
  }
];

// AYUSH (Ayurveda) Dashavidha Pariksha & Ahara-Vihara Framework
export const AYUSH_FRAMEWORK = {
  title: { en: "Ayurvedic Clinical Assessment (Dashavidha Pariksha)", ta: "ஆயுர்வேத தசவித பரிசோதனை", hi: "आयुर्वेदिक दशविध परीक्षा एवं आहार-विहार" },
  parikshaList: [
    {
      id: "prakriti",
      title: { en: "1. Prakriti (Inherent Constitution)", ta: "பிரகிருதி (இயற்கை உடலமைப்பு)", hi: "1. प्रकृति (मौलिक शारीरिक प्रकृति)" },
      description: { en: "Constitutional dosha balance since birth", ta: "பிறவி தோஷ அமைப்பு", hi: "जन्मजात वात-पित्त-कफ गठन" },
      options: [
        { id: "vataja", label: { en: "Vataja (Lean, quick moving, dry skin, light sleep)", ta: "வாதம் (மெலிந்த உடல், வறண்ட தோல்)", hi: "वातज (दुबला, चंचल, रूखी त्वचा, कम नींद)" } },
        { id: "pittaja", label: { en: "Pittaja (Medium build, warm body, sharp appetite, irritable)", ta: "பித்தம் (நடுத்தர உடல், உஷ்ணம், பசி அதிகம்)", hi: "पित्तज (मध्यम देह, उष्णता, तीव्र भूख, तीखा स्वभाव)" } },
        { id: "kaphaja", label: { en: "Kaphaja (Broad build, calm mind, heavy limbs, slow digestion)", ta: "கபம் (பருத்த உடல், அமைதி, மந்த செரிமானம்)", hi: "कफज (स्थूल देह, शांत मन, भारी अंग, मंद पाचन)" } },
        { id: "dvandvaja", label: { en: "Vata-Pitta / Pitta-Kapha (Dual Prakriti)", ta: "இரட்டை தோஷ பிரகிருதி", hi: "द्वन्द्वज (वात-पित्त या पित्त-कफ मिश्रित)" } }
      ]
    },
    {
      id: "vikriti",
      title: { en: "2. Vikriti (Current Morbid Imbalance)", ta: "விகிருதி (தற்போதைய தோஷக் கேடு)", hi: "2. विकृति (वर्तमान दोष असंतुलन)" },
      description: { en: "Active doshic aggravation causing illness", ta: "நோய் உண்டாக்கும் தோஷ மாறுபாடு", hi: "वर्तमान में कुपित हुआ दोष" },
      options: [
        { id: "vata_vridhi", label: { en: "Vata Vriddhi (Severe body ache, tremors, constipation, dry cough)", ta: "வாத அதிகரிப்பு (உடல் வலி, நடுக்கம், மலச்சிக்கல்)", hi: "वात वृद्धि (शूल/दर्द, कंपन, कब्ज, सूखापन)" } },
        { id: "pitta_vridhi", label: { en: "Pitta Vriddhi (Acid reflux, burning urine, skin inflammation, yellow eyes)", ta: "பித்த அதிகரிப்பு (எரிச்சல், அமிலத்தன்மை)", hi: "पित्त वृद्धि (अम्लपित्त, दाह/जलन, पीलापन, तृष्णा)" } },
        { id: "kapha_vridhi", label: { en: "Kapha Vriddhi (Heavy chest, thick phlegm, lethargy, loss of taste)", ta: "கப அதிகரிப்பு (மார்பு சளி, மந்தம்)", hi: "कफ वृद्धि (अंग गौरव, कफ निष्ठीवन, आलस्य, अरुचि)" } },
        { id: "sannipata", label: { en: "Sannipataja (All three doshas disturbed)", ta: "சன்னிபாதம் (முத்தோஷ பாதிப்பு)", hi: "सन्निपातज (तीनों दोषों का त्रिदोषज प्रकोप)" } }
      ]
    },
    {
      id: "sara",
      title: { en: "3. Sara (Dhatu Essence / Tissue Purity)", ta: "சாரம் (தாது வளம்)", hi: "3. सार (सप्त धातुओं की गुणवत्ता)" },
      description: { en: "Quality of Rasa, Rakta, Mamsa, Meda, Asthi, Majja, Shukra", ta: "உடல் தாதுக்களின் உறுதி", hi: "रस-रक्त-मांस-मेद-अस्थि-मज्जा-शुक्र सारता" },
      options: [
        { id: "pravara_sara", label: { en: "Pravara Sara (Superior tissue vitality / high resilience)", ta: "உயர்ந்த தாது வளம் (அதிக நோய் எதிர்ப்பு சக்தி)", hi: "प्रवर सार (उत्कृष्ट धातु बल, उत्तम रोग प्रतिरोधक)" } },
        { id: "madhyama_sara", label: { en: "Madhyama Sara (Moderate tissue vitality)", ta: "நடுத்தர தாது வளம்", hi: "मध्यम सार (मध्यम धातु बल)" } },
        { id: "avara_sara", label: { en: "Avara Sara (Depleted tissue vitality / frail constitution)", ta: "குறைந்த தாது வளம் (எளிதில் நோய்வாய்ப்படுதல்)", hi: "अवर सार (अल्प धातु बल, शीघ्र रोगग्रस्त होने वाला)" } }
      ]
    },
    {
      id: "samhanana",
      title: { en: "4. Samhanana (Body Compactness & Skeletal Build)", ta: "சம்ஹனனம் (உடல் கட்டமைப்பு)", hi: "4. संहनन (शरीर का गठन व सुदृढ़ता)" },
      description: { en: "Symmetry and muscle-bone compactness", ta: "எலும்பு, தசை சமச்சீர் தன்மை", hi: "अस्थि-संधि-मांस की सुगठितता" },
      options: [
        { id: "su_samhata", label: { en: "Su-samhata (Well-proportioned, solid compact frame)", ta: "நன்கு அமைந்த திடகாத்திர உடல்", hi: "सुसंहत (सुगठित व संतुलित शारीरिक ढांचा)" } },
        { id: "madhyama_samhata", label: { en: "Madhyama (Average frame)", ta: "சாதாரண உடல் வடிவம்", hi: "मध्यम संहनन (सामान्य ढांचा)" } },
        { id: "hina_samhata", label: { en: "Hina Samhanana (Weak, loose joints, asymmetrical)", ta: "தளர்ந்த கட்டமைப்பு / பலவீன மூட்டுகள்", hi: "हीन संहनन (शिथिल संधि व कमजोर जोड़)" } }
      ]
    },
    {
      id: "pramana",
      title: { en: "5. Pramana (Anthropometric Proportion / Body Mass)", ta: "பிரமாணம் (உடல் அளவு & நிறை)", hi: "5. प्रमाण (शरीर का माप एवं भार)" },
      description: { en: "Height, weight, and limb proportion", ta: "உயரம் மற்றும் எடை விகிதம்", hi: "ऊंचाई, भार एवं अंग-प्रत्यंग का अनुपात" },
      options: [
        { id: "sama_pramana", label: { en: "Yathokta Pramana (Normal BMI & balanced proportions)", ta: "சரியான உடல் எடை & உயரம்", hi: "यथोक्त प्रमाण (सामान्य बीएमआई, संतुलित भार)" } },
        { id: "krisha", label: { en: "Ati-Krisha (Severely underweight / emaciated)", ta: "மிகக் குறைந்த எடை (மெலிவு)", hi: "अतिकृश (अत्यधिक कम वजन/कमजोर)" } },
        { id: "sthula", label: { en: "Ati-Sthula (Obese / high adiposity)", ta: "அதிக எடை (பருமனான உடல்)", hi: "अतिस्थूल (मोटापा / अत्यधिक मेद संचय)" } }
      ]
    },
    {
      id: "satmya",
      title: { en: "6. Satmya (Habituation & Wholesomeness)", ta: "சாத்மியம் (பழக்கவழக்க சகிப்புத்தன்மை)", hi: "6. सात्म्य (अनुकूलता व सहनशीलता)" },
      description: { en: "Adaptability to tastes, climatic changes, and foods", ta: "பல்வேறு உணவு மற்றும் தட்பவெப்ப சகிப்புத்தன்மை", hi: "षड्रस एवं जलवायु अनुकूलता" },
      options: [
        { id: "sarva_rasa", label: { en: "Sarva-Rasa Satmya (Tolerates all 6 tastes & climates well)", ta: "அனைத்து சுவைகளும் ஏற்புடையவர்", hi: "सर्वरस सात्म्य (सभी 6 रसों को पचाने में सक्षम)" } },
        { id: "madhyama_satmya", label: { en: "Eka-Dvi Rasa Satmya (Sensitive to sour/spicy/dairy)", ta: "குறிப்பிட்ட உணவுகளுக்கு ஒவ்வாமை", hi: "मध्यम सात्म्य (खट्टा/तीखा/दूध आदि से संवेदनशीलता)" } },
        { id: "asatmya", label: { en: "Vyadhi-Hetu Asatmya (Prone to recurrent allergies)", ta: "அடிக்கடி ஒவ்வாமை ஏற்படுபவர்", hi: "अवर सात्म्य (एलर्जी व असहिष्णुता प्रवण)" } }
      ]
    },
    {
      id: "sattva",
      title: { en: "7. Sattva (Mental Endurance & Psychological Strength)", ta: "சத்துவம் (மன உறுதி)", hi: "7. सत्त्व (मानसिक बल व धैर्य)" },
      description: { en: "Tolerance to pain, emotional shock, and illness", ta: "வலியை தாங்கும் மனபலம்", hi: "पीड़ा सहन करने की मानसिक क्षमता" },
      options: [
        { id: "pravara_sattva", label: { en: "Pravara Sattva (High courage, calm in crisis, high pain threshold)", ta: "அதிக மன தைரியம், வலியை தாங்குபவர்", hi: "प्रवर सत्त्व (उत्तम धैर्यवान, शांत, उच्च दर्द सहिष्णुता)" } },
        { id: "madhyama_sattva", label: { en: "Madhyama Sattva (Manageable with reassurance)", ta: "நடுத்தர மன உறுதி", hi: "मध्यम सत्त्व (आश्वासन देने पर संभलने वाला)" } },
        { id: "avara_sattva", label: { en: "Avara Sattva (Anxious, terrified of needles, low threshold)", ta: "அச்சம், குறைந்த மன உறுதி", hi: "अवर सत्त्व (भयभीत, अधीर, सुई या दर्द से घबराने वाला)" } }
      ]
    },
    {
      id: "ahara_shakti",
      title: { en: "8. Ahara Shakti (Digestive & Intake Capacity)", ta: "ஆகார சக்தி (செரிமான வலிமை)", hi: "8. आहार शक्ति (अभ्यवहरण एवं जरण शक्ति)" },
      description: { en: "Appetite (Abhyavaharana) & Digestion speed (Jarana Shakti)", ta: "பசி மற்றும் செரிமானத் திறன்", hi: "भूख की मात्रा और पचाने की क्षमता" },
      options: [
        { id: "sama_agni", label: { en: "Sama Agni (Timely hunger, complete smooth digestion in 4 hrs)", ta: "சம அக்னி (சரியான பசி, நல்ல செரிமானம்)", hi: "समाग्नि (उत्तम भूख, 4 घंटे में सुचारु पाचन)" } },
        { id: "manda_agni", label: { en: "Manda Agni (Poor appetite, heavy abdomen for 8+ hrs after small meal)", ta: "மந்த அக்னி (பசியின்மை, மந்தம்)", hi: "मंदाग्नि (भूख न लगना, खाना पेट में घंटों भारी रहना)" } },
        { id: "tikshna_agni", label: { en: "Tikshna Agni (Intense burning hunger, hyperacidity if delayed)", ta: "தீக்ஷ்ண அக்னி (அதிக பசி, நெஞ்செரிச்சல்)", hi: "तीक्ष्णाग्नि (अत्यधिक तीव्र भूख, समय पर न खाने पर दाह)" } },
        { id: "vishama_agni", label: { en: "Vishama Agni (Irregular — unpredictable hunger, bloating, gas)", ta: "விஷம அக்னி (நிலையற்ற பசி, வாயுத்தொல்லை)", hi: "विषमाग्नि (अनियमित कभी तेज तो कभी बिल्कुल नहीं, गैस)" } }
      ]
    },
    {
      id: "vyayama_shakti",
      title: { en: "9. Vyayama Shakti (Work Capacity & Physical Stamina)", ta: "வியாயாம சக்தி (உடல் உழைப்பு திறன்)", hi: "9. व्यायाम शक्ति (शारीरिक कार्य व सहनशक्ति)" },
      description: { en: "Endurance to physical labor, walking, and effort", ta: "உடல் உழைப்பை தாங்கும் திறன்", hi: "श्रम व परिश्रम सहन करने की क्षमता" },
      options: [
        { id: "pravara_vyayama", label: { en: "Pravara (Can do heavy manual work / walk long distances without fatigue)", ta: "அதிக உழைக்கும் திறன்", hi: "प्रवर (भारी श्रम व लंबी दूरी तय करने में सक्षम)" } },
        { id: "madhyama_vyayama", label: { en: "Madhyama (Moderate daily chores)", ta: "நடுத்தர உழைப்பு", hi: "मध्यम (सामान्य दैनिक कार्य करने योग्य)" } },
        { id: "avara_vyayama", label: { en: "Avara (Tires within 5 minutes of mild effort)", ta: "குறைந்த உழைப்பு திறன் (விரைவில் சோர்வு)", hi: "अवर (थोड़ा सा चलने या काम करने पर अत्यधिक थकान)" } }
      ]
    },
    {
      id: "vaya",
      title: { en: "10. Vaya (Age Category / Biological Phase)", ta: "வயது (வாழ்நாள் பருவம்)", hi: "10. वय (आयु काल)" },
      description: { en: "Balya (Kapha dominance), Madhyama (Pitta dominance), Vriddha (Vata dominance)", ta: "வாழ்வியல் பருவம்", hi: "बाल्यावस्था, मध्यमावस्था, वृद्धावस्था" },
      options: [
        { id: "balya", label: { en: "Balya Avastha (<16 yrs — Kapha dominant)", ta: "பால்ய பருவம் (<16 வயது)", hi: "बाल्यावस्था (16 वर्ष तक - कफ प्रधान काल)" } },
        { id: "madhyama_vaya", label: { en: "Madhyama Vaya (16–60 yrs — Pitta dominant)", ta: "மத்திம பருவம் (16-60 வயது)", hi: "मध्यमावस्था (16-60 वर्ष - पित्त प्रधान काल)" } },
        { id: "vriddha", label: { en: "Vriddha Avastha (>60 yrs — Vata dominant / Dhatu Kshaya)", ta: "முதுமைப் பருவம் (>60 வயது - வாத காலம்)", hi: "वृद्धावस्था (60+ वर्ष - वात प्रधान / धातु क्षय काल)" } }
      ]
    }
  ]
};

// Realistic Prior Medical Documents for OCR & Timeline Extraction
export const SAMPLE_DOCUMENTS = [
  {
    id: "doc_rx_govt",
    title: { en: "Govt District Hospital OPD Prescription (Handwritten)", ta: "அரசு மாவட்ட மருத்துவமனை புறநோயாளி மருந்துச் சீட்டு", hi: "सरकारी जिला चिकित्सालय ओपीडी पर्ची (हस्तलिखित)" },
    type: "prescription",
    date: "2025-11-14",
    facility: "District Apex Hospital, Ward 4 OPD",
    physician: "Dr. K. Senthil Nathan, MD (Gen Med)",
    ocrConfidence: "96.4%",
    badgeColor: "var(--primary)",
    extractedData: {
      diagnoses: [
        "Type 2 Diabetes Mellitus (E11.9)",
        "Essential Hypertension - Stage 2 (I10)",
        "Diabetic Peripheral Neuropathy suspect"
      ],
      medications: [
        { name: "Tab Metformin Hydrochloride", dose: "500 mg", frequency: "1-0-1 (Twice Daily After Food)", duration: "30 days" },
        { name: "Tab Telmisartan", dose: "40 mg", frequency: "1-0-0 (Morning)", duration: "30 days" },
        { name: "Tab Atorvastatin", dose: "20 mg", frequency: "0-0-1 (At Bedtime)", duration: "30 days" },
        { name: "Cap Methylcobalamin + Alpha Lipoic Acid", dose: "1500 mcg", frequency: "0-1-0 (Afternoon)", duration: "30 days" }
      ],
      allergies: ["No known food allergies stated"],
      notes: "Advised salt-restricted diet, daily 30m walk, fast blood sugar check every 3 months."
    }
  },
  {
    id: "doc_lab_biochem",
    title: { en: "State Public Health Lab - Comprehensive Biochemistry Panel", ta: "அரசு பொது சுகாதார ஆய்வக இரத்தப் பரிசோதனை அறிக்கை", hi: "राज्य जन स्वास्थ्य प्रयोगशाला - रक्त बायोकेमिस्ट्री रिपोर्ट" },
    type: "lab_report",
    date: "2026-01-22",
    facility: "National Accreditation Certified Public Health Diagnostic Lab",
    physician: "Dr. Sunita Sharma, MD (Pathology)",
    ocrConfidence: "99.1%",
    badgeColor: "var(--secondary)",
    extractedData: {
      investigations: [
        { test: "Fasting Blood Sugar (FBS)", value: "214", unit: "mg/dL", refRange: "70 - 100", status: "HIGH", critical: true },
        { test: "Postprandial Blood Sugar (PPBS)", value: "318", unit: "mg/dL", refRange: "100 - 140", status: "HIGH", critical: true },
        { test: "Glycated Hemoglobin (HbA1c)", value: "9.4", unit: "%", refRange: "4.0 - 5.6", status: "HIGH", critical: true },
        { test: "Serum Creatinine", value: "1.74", unit: "mg/dL", refRange: "0.7 - 1.2", status: "HIGH", critical: true },
        { test: "Estimated GFR (eGFR)", value: "41.8", unit: "mL/min/1.73m²", refRange: "> 60", status: "LOW", critical: true },
        { test: "Serum Potassium (K+)", value: "5.3", unit: "mEq/L", refRange: "3.5 - 5.1", status: "HIGH", critical: false },
        { test: "Hemoglobin (Hb)", value: "11.2", unit: "g/dL", refRange: "13.0 - 17.0", status: "LOW", critical: false }
      ],
      criticalAlerts: [
        "Severe Glycemic Dysregulation (HbA1c: 9.4%, Fasting: 214 mg/dL)",
        "Impaired Renal Clearance (Serum Creatinine: 1.74 mg/dL, eGFR: 41.8 mL/min - CKD Stage 3b pattern)"
      ]
    }
  },
  {
    id: "doc_discharge_surg",
    title: { en: "Apex Medical College Hospital - Surgical Discharge Summary", ta: "மருத்துவக் கல்லூரி மருத்துவமனை அறுவைசிகிச்சை விடுவிப்பு அறிக்கை", hi: "मेडिकल कॉलेज अस्पताल - सर्जिकल डिस्चार्ज सारांश" },
    type: "discharge_summary",
    date: "2024-06-18",
    facility: "Government Stanley Medical College Hospital, Chennai",
    physician: "Prof. Dr. R. Ramanathan, MS, MCh (Surg Gastro)",
    ocrConfidence: "97.8%",
    badgeColor: "var(--teal)",
    extractedData: {
      diagnoses: ["Calculous Cholecystitis with Biliary Colic (K80.1)"],
      procedures: ["Laparoscopic Cholecystectomy under General Anesthesia on 15/06/2024"],
      histopathology: "Benign chronic cholecystitis with cholelithiasis (multiple cholesterol stones)",
      allergies: ["DOCUMENTED DRUG ALLERGY: Severe Urticaria & Anaphylactoid rash to Ampicillin / Amoxicillin"],
      implants: ["Titanium hem-o-lok clips in cystic duct & artery bed"]
    }
  }
];

// Generates an ABDM FHIR R4 Bundle
export function generateFhirBundle(patientData, historySummary) {
  const bundleId = `bundle-medikiosk-${Date.now()}`;
  const timestamp = new Date().toISOString();

  return {
    resourceType: "Bundle",
    id: bundleId,
    meta: {
      lastUpdated: timestamp,
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClinicalArtifactBundle"]
    },
    identifier: {
      system: "https://abdm.gov.in/fhir/bundles",
      value: `ABDM-HIS-${patientData.abhaId || "91-4829-1029-4821"}`
    },
    type: "document",
    timestamp: timestamp,
    entry: [
      {
        fullUrl: `urn:uuid:patient-${patientData.abhaId || "ABHA-01"}`,
        resource: {
          resourceType: "Patient",
          id: `patient-${patientData.abhaId || "ABHA-01"}`,
          meta: { profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient"] },
          identifier: [
            {
              type: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "MR", display: "ABHA Number" }] },
              system: "https://healthid.ndhm.gov.in",
              value: patientData.abhaId || "91-4829-1029-4821"
            }
          ],
          name: [{ text: patientData.name || "Ramesh V. Patel" }],
          gender: patientData.gender || "male",
          birthDate: patientData.birthYear ? `${patientData.birthYear}-01-01` : "1968-04-12",
          telecom: [{ system: "phone", value: patientData.mobile || "+91 98765 43210" }]
        }
      },
      {
        fullUrl: `urn:uuid:encounter-${bundleId}`,
        resource: {
          resourceType: "Encounter",
          status: "in-progress",
          class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "Outpatient Ambulatory Intake"
          },
          subject: { reference: `urn:uuid:patient-${patientData.abhaId || "ABHA-01"}` },
          period: { start: timestamp }
        }
      },
      {
        fullUrl: `urn:uuid:condition-cc`,
        resource: {
          resourceType: "Condition",
          clinicalStatus: {
            coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }]
          },
          verificationStatus: {
            coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: "provisional" }]
          },
          category: [{ coding: [{ system: "http://snomed.info/sct", code: "404684003", display: "Clinical finding" }] }],
          code: { text: historySummary.chiefComplaintText || "Acute chest tightness radiating to arm" },
          subject: { reference: `urn:uuid:patient-${patientData.abhaId || "ABHA-01"}` }
        }
      },
      {
        fullUrl: `urn:uuid:allergy-penicillin`,
        resource: {
          resourceType: "AllergyIntolerance",
          clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", code: "active" }] },
          verificationStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification", code: "confirmed" }] },
          type: "allergy",
          category: ["medication"],
          criticality: "high",
          code: { text: "Penicillin / Ampicillin / Amoxicillin hypersensitivity" },
          patient: { reference: `urn:uuid:patient-${patientData.abhaId || "ABHA-01"}` }
        }
      },
      {
        fullUrl: `urn:uuid:docref-prior-records`,
        resource: {
          resourceType: "DocumentReference",
          status: "current",
          type: { coding: [{ system: "http://loinc.org", code: "34117-2", display: "History and Physical note" }] },
          subject: { reference: `urn:uuid:patient-${patientData.abhaId || "ABHA-01"}` },
          date: timestamp,
          description: "MediKiosk Multimodal Intake: SOCRATES HPI + Digitized Documents Timeline"
        }
      }
    ]
  };
}
