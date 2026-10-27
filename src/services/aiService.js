// AI Housing Assistant Service
// Grounded in official PMAY-G guidelines, land registry conventions, and rural housing schemes.
// Supports Gemini API if VITE_GEMINI_API_KEY is present, with an extensive offline fallback engine.

const SYSTEM_GROUNDING_PROMPT = `
You are "GharSetu AI Sahayak", a helpful, empathetic, and knowledgeable rural housing advisor for Indian rural families.
Your mission is to guide rural families on turning their land into a permanent home through government housing schemes (such as PMAY-Gramin, Mukhya Mantri Awas Yojana, and RHISS).

CRITICAL OPERATIONAL RULES:
1. Ground all answers in verified government rules (PMAY-G guidelines by Ministry of Rural Development).
2. NEVER claim that an application has been officially submitted, verified, or approved. Clarify that you provide informational guidance to prepare applications for Gram Panchayat / Block Development review.
3. Support both simple Hindi and English. If the user writes in Hindi or Hinglish, answer in simple, warm Hindi.
4. Key PMAY-G facts to reference:
   - Direct financial grant: ₹1,20,000 in plains, ₹1,30,000 in hilly/NE/difficult regions.
   - Additional benefits: 90/95 days of MGNREGA wages (~₹25,000 to ₹30,000) for house construction + ₹12,000 under Swachh Bharat for toilet. Total: ~₹1.6 Lakhs.
   - PMAY-G requires house sanction in the woman's name or jointly with spouse.
   - 13 exclusions: Motorized 3/4-wheeler, motorized fishing boat, mechanized 3/4-blade farm equipment, Kisan Credit Card limit >= ₹50,000, government employee in household, income tax payer, etc.
   - Common land issues: Minor spelling discrepancies between Khatauni and Aadhaar can be resolved via an affidavit or Gram Pradhan/Lekhpal certificate before Gram Sabha ratification.
`;

const KNOWLEDGE_BASE_QA = [
  {
    keywords: ["pmay-g", "pmayg", "eligibility", "paatr", "rules", "शर्तें", "पात्रता", "नियम"],
    responseEn: `Under **Pradhan Mantri Awas Yojana - Gramin (PMAY-G)**, eligibility is based on SECC 2011 and Awaas+ surveys. Key criteria:

1. **Housing Condition:** Must not own a pucca house anywhere in India. Living in a kutcha (mud/thatch) or dilapidated home gives highest priority.
2. **Land Availability:** Must have a building plot (self-owned, ancestral, or government-allotted residential patta).
3. **13 Exclusion Criteria (Must NOT have):**
   - No motorized vehicle (two/three/four wheeler) or motorized boat.
   - No mechanized agricultural equipment (tractors, harvesters).
   - Kisan Credit Card (KCC) limit should not exceed ₹50,000.
   - No member in regular government service.
   - No member paying income or professional tax.
4. **Mandatory Female Titling:** House must be registered in the name of the female head or joint title with husband.

*Note: GharSetu provides guidance only. Official selection is finalized by your Gram Sabha and Block Development Officer (BDO).*`,
    responseHi: `**प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)** के तहत पात्रता के मुख्य नियम निम्नलिखित हैं:

1. **आवास स्थिति:** पूरे भारत में परिवार के किसी भी सदस्य के पास कोई पक्का मकान नहीं होना चाहिए। कच्चे (मिट्टी/घास-फूस/खपरैल) मकान में रहने वाले परिवारों को सर्वोच्च प्राथमिकता मिलती है।
2. **ज़मीन का स्वामित्व:** मकान निर्माण हेतु ज़मीन उपलब्ध होनी चाहिए (स्वयं के नाम, पैतृक हिस्सा, या सरकार द्वारा आवंटित आवासीय पट्टा)।
3. **13 अपवर्जन शर्तें (ये नहीं होना चाहिए):**
   - मोटर चालित दो/तीन/चार पहिया वाहन या बोट न हो।
   - ट्रैक्टर या अन्य यंत्रीकृत कृषि उपकरण न हों।
   - किसान क्रेडिट कार्ड (KCC) की सीमा ₹50,000 से अधिक न हो।
   - परिवार का कोई सदस्य सरकारी नौकरी में न हो।
   - कोई सदस्य आयकरदाता न हो।
4. **महिला स्वामित्व:** मकान की रजिस्ट्री/स्वीकृति महिला मुखिया के नाम अथवा पति-पत्नी के संयुक्त नाम पर अनिवार्य है।

*महत्वपूर्ण: अंतिम चयन आपकी ग्राम सभा की बैठक और ब्लॉक विकास अधिकारी (BDO) द्वारा ही सत्यापित होता है।*`
  },
  {
    keywords: ["grant", "amount", "money", "rupee", "kist", "installment", "anudan", "किस्त", "पैसा", "अनुदान", "रुपया"],
    responseEn: `Here is the verified financial assistance breakdown for **PMAY-G (2024-2025)**:

1. **Direct House Construction Grant (DBT):**
   - **Plains areas:** ₹1,20,000 (issued in 3-4 installments: plinth, lintel, roof, and completion).
   - **Hilly, North-Eastern & IAP districts:** ₹1,30,000.
2. **MGNREGA Wage Support:**
   - 90 days (plains) or 95 days (hilly) of unskilled construction wages credited directly to your job card account (~₹25,000 to ₹30,000 depending on state wage rates).
3. **Toilet Construction Grant:**
   - Additional ₹12,000 under Swachh Bharat Mission (Gramin).
4. **Total Benefit Package:**
   - Approximately **₹1,57,000 to ₹1,72,000** total direct financial assistance!
5. **Optional Bank Loan:** Up to ₹70,000 at subsidized interest if you want a larger house.`,
    responseHi: `**पीएमएवाई-ग्रामीण के तहत कुल वित्तीय सहायता का आधिकारिक विवरण:**

1. **सीधा आवास निर्माण अनुदान (DBT):**
   - **मैदानी क्षेत्र:** ₹1,20,000 (3 से 4 किस्तों में: नींव, दीवार/लिंटेल, छत और पूर्णता)।
   - **पहाड़ी एवं पूर्वोत्तर राज्य:** ₹1,30,000।
2. **मनरेगा मजदूरी सहायता:**
   - मकान निर्माण में 90 दिन (मैदानी) या 95 दिन (पहाड़ी) की अकुशल मजदूरी (~₹25,000 से ₹30,000) सीधे आपके जॉब कार्ड से जुड़े बैंक खाते में।
3. **शौचालय निर्माण अनुदान:**
   - स्वच्छ भारत मिशन (ग्रामीण) के तहत ₹12,000 का अतिरिक्त अनुदान।
4. **कुल वित्तीय लाभ:**
   - लगभग **₹1,57,000 से ₹1,72,000** की कुल सरकारी सहायता!
5. **वैकल्पिक बैंक ऋण:** यदि आप बड़ा मकान बनाना चाहते हैं, तो बैंक से ₹70,000 तक का कम ब्याज वाला ऋण भी ले सकते हैं।`
  },
  {
    keywords: ["khatauni", "spelling", "mismatch", "aadhaar", "name", "naam", "father", "खतौनी", "नाम", "स्पेलिंग", "गलती", "सुधार", "पिता"],
    responseEn: `Name or spelling mismatches between **Khatauni (Land Record)** and **Aadhaar** are the #1 cause of delay for rural families. Here is the official remedy:

1. **Minor Spelling Discrepancy (e.g. 'Ram Kishan' vs 'Ramkishan'):**
   - Get a **Self-Affidavit (शपथ पत्र)** on a ₹10 or ₹50 stamp paper declaring that both names refer to the same individual.
   - Request your **Gram Pradhan / Lekhpal (Patwari)** to sign an identification verification certificate.
2. **Ancestral Land in Late Father's / Grandfather's Name (Varisat):**
   - Apply for **Varasandi (उत्तराधिकार / वरासत दर्ज कराना)** online through your state's Revenue Board portal (e.g., e-District or Bhulekh) or at the Tehsil office. Lekhpal verifies the legal heirs within 15-30 days.
3. **Bank Account Name Mismatch:**
   - Ensure your bank account name matches your Aadhaar exactly, and that the bank has linked your Aadhaar to the **NPCI DBT mapping**. If not, money transfer will bounce on PFMS!`,
    responseHi: `**खतौनी और आधार में नाम या स्पेलिंग अलग होने पर क्या करें:**

यह ग्रामीण क्षेत्रों में सबसे आम समस्या है। इसे सुलझाने के 3 आसान कदम:

1. **छोटी वर्तनी त्रुटि (जैसे खतौनी में 'राम किशन' और आधार में 'रामकिशन'):**
   - ₹10 या ₹50 के स्टांप पेपर पर **शपथ पत्र (Affidavit)** बनवाएं जिसमें लिखा हो कि दोनों नाम एक ही व्यक्ति के हैं।
   - अपने **ग्राम प्रधान या लेखपाल (पटवारी)** से पहचान सत्यापन प्रमाण पत्र बनवा लें। ग्राम सभा प्रस्ताव के समय यह मान्य होता है।
2. **ज़मीन स्वर्गीय पिता या दादा के नाम पर होना (वरासत):**
   - अपने राज्य के राजस्व पोर्टल (जैसे भूलेख / ई-डिस्ट्रिक्ट) या तहसील में **वरासत (उत्तराधिकार)** दर्ज कराने का ऑनलाइन आवेदन करें। लेखपाल 15-30 दिनों में वारिसों का नाम खतौनी में दर्ज करता है।
3. **बैंक खाते में नाम की समानता:**
   - ध्यान रखें कि बैंक पासबुक में नाम आधार जैसा ही हो और खाता **NPCI / DBT मैपर** से लिंक हो, ताकि सरकारी किस्त अटक न जाए!`
  },
  {
    keywords: ["gram sabha", "meeting", "approval", "pradhan", "list", "ग्राम सभा", "बैठक", "प्रधान", "सूची", "प्रस्ताव"],
    responseEn: `**The Role of Gram Sabha in Rural Housing Sanction:**

1. **Priority List Ratification:** The Ministry prepares a preliminary list using SECC/Awaas+ data. The **Gram Sabha meeting is legally required** to review this list.
2. **Identifying Ineligible Claims:** Villagers can raise objections if an undeserving person (e.g., someone with a pucca house or government job) is on the list.
3. **Adding Omitted Families:** If a needy kutcha-house family was missed, the Gram Sabha can pass a resolution (प्रस्ताव) recommending their inclusion to the Block Development Officer (BDO).
4. **Action for you:** Always attend the open Gram Sabha meeting (usually held on 26th Jan, 15th Aug, 2nd Oct, or as notified) and obtain a copy of the passed priority resolution.`,
    responseHi: `**आवास स्वीकृति में ग्राम सभा की भूमिका:**

1. **प्राथमिकता सूची का अनुमोदन:** केंद्र सरकार आवास+ डेटा से प्रारंभिक सूची भेजती है। कानूनन **ग्राम सभा की खुली बैठक** में इस सूची को पढ़कर सुनाया और अनुमोदित किया जाता है।
2. **गलत नामों को हटाना:** यदि किसी अपात्र व्यक्ति (जिसका पहले से पक्का मकान हो) का नाम सूची में आ गया है, तो ग्रामीण ग्राम सभा में आपत्ति दर्ज करा सकते हैं।
3. **छूटे परिवारों का नाम जोड़ना:** यदि कोई पात्र गरीब परिवार छूट गया है, तो ग्राम सभा प्रस्ताव पारित करके बीडीओ (BDO) कार्यालय को सिफारिश भेज सकती है।
4. **आपको क्या करना चाहिए:** ग्राम सभा की बैठक (26 जनवरी, 15 अगस्त, 2 अक्टूबर आदि) में अवश्य जाएं और देखें कि आपका नाम अनुमोदित सूची में किस क्रमांक पर है!`
  },
  {
    keywords: ["track", "fto", "status", "awaassoft", "registration", "पंजीकरण", "स्टेटस", "ट्रैक", "एफटीओ"],
    responseEn: `**How to Track Your PMAY-G Application and Installment Status Online:**

1. Visit the official government portal: **https://pmayg.nic.in**
2. In the top navigation, click on **'Stakeholders'** → **'IAY/PMAYG Beneficiary'**.
3. Enter your **Registration Number** (provided by your block office, e.g., UP12345678).
4. You can see:
   - Your uploaded geo-tagged photos (old kutcha house, plinth, roof).
   - Sanctioned amount and Sanction Order Number.
   - **FTO (Fund Transfer Order) Details**: exact bank credit date and UTR transaction number.
5. If you do not have your registration number, click 'Advanced Search' and search by State, District, Block, and Panchayat.`,
    responseHi: `**पीएमएवाई-जी आवेदन और किस्त की स्थिति ऑनलाइन कैसे देखें:**

1. आधिकारिक सरकारी पोर्टल पर जाएं: **https://pmayg.nic.in**
2. ऊपर मेनू में **'Stakeholders'** पर क्लिक करें और **'IAY/PMAYG Beneficiary'** चुनें।
3. अपना **पंजीकरण नंबर (Registration Number)** दर्ज करें (जो ब्लॉक या प्रधान से मिलता है)।
4. 'Submit' दबाते ही आपके सामने पूरा ब्योरा आ जाएगा:
   - जियो-टैग्ड फोटो (कच्चा मकान, नींव, छत)।
   - स्वीकृति आदेश (Sanction Order) संख्या।
   - **एफटीओ (FTO) विवरण**: बैंक में पैसा पहुंचने की तारीख और यूटीआर नंबर।
5. यदि पंजीकरण नंबर नहीं है, तो 'Advanced Search' में जाकर अपना राज्य, ज़िला, ब्लॉक और ग्राम पंचायत चुनकर अपना नाम खोज सकते हैं।`
  }
];

export const aiService = {
  askAssistant: async (userMessage, conversationHistory = [], language = 'hi') => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // 1. If Gemini API Key is configured, use official Gemini API
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY') {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${SYSTEM_GROUNDING_PROMPT}\n\nUser Question (${language}): ${userMessage}` }]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) {
            return {
              text: candidate,
              source: 'gemini-live',
              disclaimer: language === 'hi'
                ? 'यह मार्गदर्शन एआई द्वारा सरकारी नियमों के आधार पर दिया गया है। अंतिम निर्णय आपकी ग्राम पंचायत व ब्लॉक कार्यालय का होगा।'
                : 'AI-generated guidance grounded in official housing rules. Final sanction rests with your Gram Panchayat & Block office.'
            };
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to grounded knowledge engine:', err);
      }
    }

    // 2. Offline Grounded Knowledge Engine (Fallback & Default)
    // Simulating natural response delay for UX
    await new Promise(res => setTimeout(res, 600));

    const cleanInput = userMessage.toLowerCase().trim();

    // Check keyword matching in grounded knowledge base
    let bestMatch = null;
    let highestScore = 0;

    KNOWLEDGE_BASE_QA.forEach(item => {
      let currentScore = 0;
      item.keywords.forEach(kw => {
        if (cleanInput.includes(kw)) {
          currentScore += 1;
        }
      });
      if (currentScore > highestScore) {
        highestScore = currentScore;
        bestMatch = item;
      }
    });

    if (bestMatch && highestScore > 0) {
      return {
        text: language === 'hi' ? bestMatch.responseHi : bestMatch.responseEn,
        source: 'grounded-knowledge-base',
        disclaimer: language === 'hi'
          ? 'सरकारी दिशानिर्देशों पर आधारित मार्गदर्शन। आधिकारिक स्वीकृति ग्राम पंचायत एवं ब्लॉक कार्यालय द्वारा दी जाती है।'
          : 'Grounded in official PMAY-G & State housing guidelines. Official approval is granted by the local Gram Panchayat & BDO.'
      };
    }

    // Default polite conversational response
    if (language === 'hi') {
      return {
        text: `नमस्ते! मैं आपका **घरसेतु एआई सहायक** हूँ। 

आप मुझसे ग्रामीण आवास योजनाओं (जैसे **पीएमएवाई-ग्रामीण**, मुख्यमंत्री आवास योजना), पात्रता शर्तों (13 अपवर्जन नियम), खतौनी या आधार में नाम सुधार, आवश्यक दस्तावेज़ या ग्राम सभा की प्रक्रिया के बारे में कोई भी सवाल पूछ सकते हैं।

उदाहरण के लिए आप पूछ सकते हैं:
• "पीएमएवाई-जी के लिए क्या-क्या दस्तावेज़ चाहिए?"
• "खतौनी और आधार में स्पेलिंग अलग है तो क्या करें?"
• "पीएमएवाई-जी में कुल कितना पैसा मिलता है?"
• "ऑनलाइन स्टेटस कैसे चेक करें?"`,
        source: 'grounded-knowledge-base',
        disclaimer: 'यह एक स्वतंत्र मार्गदर्शन मंच है, कोई आधिकारिक सरकारी पोर्टल नहीं।'
      };
    } else {
      return {
        text: `Hello! I am your **GharSetu AI Sahayak**.

You can ask me about rural housing schemes (like **PMAY-Gramin**, Mukhya Mantri Awas Yojana, RHISS), eligibility criteria, Khatauni or Aadhaar name corrections, required documents, or the Gram Sabha approval process.

Try asking:
• "What are the rules for PMAY-Gramin eligibility?"
• "My name spelling is different in Khatauni and Aadhaar, how to fix?"
• "How much total grant do I get under PMAY-G in 2024-2025?"
• "How to track application and FTO payment status online?"`,
        source: 'grounded-knowledge-base',
        disclaimer: 'Informational assistance tool. Official sanction is granted solely by the concerned Gram Panchayat & BDO.'
      };
    }
  }
};
