export const defaultRequiredDocs = [
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    nameHi: "आधार कार्ड",
    description: "Proof of identity and resident biometric authentication for all adult family members.",
    descriptionHi: "परिवार के सभी वयस्क सदस्यों की पहचान एवं बायोमेट्रिक प्रमाणीकरण हेतु।",
    mandatory: true,
    category: "Identity",
    acceptedFormats: ["PDF", "JPG", "PNG"],
    maxSizeMB: 5
  },
  {
    id: "land_record",
    name: "Land Ownership Record (Khatauni / Jamabandi / Patta)",
    nameHi: "ज़मीन का मालिकाना दस्तावेज़ (खतौनी / जमाबंदी / पट्टा)",
    description: "Certified land title or government allotment order proving ownership/possession of the construction plot.",
    descriptionHi: "निर्माण स्थल पर परिवार के मालिकाना हक या शासन द्वारा जारी आवासीय पट्टे का प्रमाणित रिकॉर्ड।",
    mandatory: true,
    category: "Land & Property",
    acceptedFormats: ["PDF", "JPG", "PNG"],
    maxSizeMB: 5
  },
  {
    id: "bank_passbook",
    name: "Bank Passbook (Aadhaar Seeded)",
    nameHi: "बैंक पासबुक (आधार व डीबीटी लिंक)",
    description: "First page of bank passbook showing Account Number, IFSC code, and DBT active confirmation for installment transfer.",
    descriptionHi: "पासबुक का पहला पन्ना जिसमें खाता संख्या, आईएफएससी कोड और डीबीटी सक्रिय होने का प्रमाण दिखे।",
    mandatory: true,
    category: "Financial",
    acceptedFormats: ["PDF", "JPG", "PNG"],
    maxSizeMB: 5
  },
  {
    id: "mgnrega_jobcard",
    name: "MGNREGA Job Card",
    nameHi: "मनरेगा जॉब कार्ड",
    description: "Required to receive 90 to 95 days of unskilled construction wages (~₹25,000) directly into your account.",
    descriptionHi: "मकान निर्माण के दौरान 90-95 दिन की मजदूरी (~₹25,000) सीधे खाते में प्राप्त करने हेतु।",
    mandatory: true,
    category: "Wages & Employment",
    acceptedFormats: ["PDF", "JPG", "PNG"],
    maxSizeMB: 5
  },
  {
    id: "ration_card",
    name: "Ration Card (BPL / Antyodaya / Priority Household)",
    nameHi: "राशन कार्ड (बीपीएल / अंत्योदय / पात्र गृहस्थी)",
    description: "Proof of household family members and socio-economic categorization.",
    descriptionHi: "परिवार के सदस्यों और सामाजिक-आर्थिक श्रेणी के प्रमाणीकरण हेतु।",
    mandatory: false,
    category: "Socio-Economic",
    acceptedFormats: ["PDF", "JPG", "PNG"],
    maxSizeMB: 5
  },
  {
    id: "kutcha_photo",
    name: "Existing Kutcha House / Land Site Photo with Applicant",
    nameHi: "वर्तमान कच्चे मकान / निर्माण स्थल का आवेदक सहित फोटो",
    description: "Geo-tagged clear photograph of the existing kutcha dwelling standing with the family.",
    descriptionHi: "परिवार के साथ वर्तमान कच्चे मकान अथवा खाली ज़मीन का स्पष्ट जियो-टैग्ड फोटो।",
    mandatory: true,
    category: "Verification",
    acceptedFormats: ["JPG", "PNG"],
    maxSizeMB: 5
  },
  {
    id: "gram_noc",
    name: "Gram Panchayat No-Pucca-House Certificate / Affidavit",
    nameHi: "ग्राम पंचायत प्रमाण पत्र / कोई पक्का मकान न होने का शपथ पत्र",
    description: "Declaration that neither the applicant nor any member owns a pucca house anywhere in India.",
    descriptionHi: "घोषणा कि आवेदक अथवा परिवार के किसी भी सदस्य के पास भारत में कहीं भी कोई पक्का मकान नहीं है।",
    mandatory: false,
    category: "Legal Declaration",
    acceptedFormats: ["PDF", "JPG"],
    maxSizeMB: 5
  }
];

export const defaultMilestones = [
  {
    id: 1,
    title: "1. Household Information & Eligibility Assessment",
    titleHi: "1. परिवार विवरण एवं प्रारंभिक पात्रता मूल्यांकन",
    description: "Completed profile assessment and matched against central & state rural housing exclusion rules.",
    descriptionHi: "प्रोफ़ाइल मूल्यांकन पूर्ण और सरकारी अपवर्जन नियमों के विरुद्ध जांच पूरी।",
    status: "completed",
    completedAt: "2024-10-15T10:30:00Z",
    actionRequired: "None - Eligibility confirmed",
    actionRequiredHi: "कुछ नहीं - पात्रता सत्यापित",
    officialRole: "Self / Assisted Kiosk"
  },
  {
    id: 2,
    title: "2. Document Preparation & Mismatch Check",
    titleHi: "2. दस्तावेज़ तैयारी एवं नाम/वर्तनी सुधार",
    description: "Gather Khatauni, Aadhaar, Bank Passbook, and ensure spelling matches across records.",
    descriptionHi: "खतौनी, आधार और बैंक पासबुक एकत्र करें तथा नामों में समानता सुनिश्चित करें।",
    status: "in_progress",
    completedAt: null,
    actionRequired: "Resolve minor name discrepancy in Khatauni with Gram Pradhan / Lekhpal certification.",
    actionRequiredHi: "खतौनी में नाम की छोटी वर्तनी त्रुटि हेतु लेखपाल/प्रधान से सत्यापन हलफनामा प्राप्त करें।",
    officialRole: "Family / Common Service Center (CSC)"
  },
  {
    id: 3,
    title: "3. Gram Sabha Prioritization & Resolution",
    titleHi: "3. ग्राम सभा प्राथमिकता सूची एवं प्रस्ताव पारित",
    description: "Annual Gram Sabha meeting reviews and ratifies the priority beneficiary list.",
    descriptionHi: "वार्षिक ग्राम सभा बैठक में पात्र लाभार्थियों की प्राथमिकता सूची की समीक्षा व अनुमोदन।",
    status: "pending",
    completedAt: null,
    actionRequired: "Attend upcoming Gram Sabha meeting to ensure name is in the approved proposal list.",
    actionRequiredHi: "आगामी ग्राम सभा बैठक में उपस्थित होकर प्रस्ताव सूची में नाम दर्ज कराना सुनिश्चित करें।",
    officialRole: "Gram Panchayat / Village Secretary (सचिव)"
  },
  {
    id: 4,
    title: "4. Awaas+ Portal Registration & Geotagging",
    titleHi: "4. आवास+ पोर्टल पंजीकरण एवं जियो-टैगिंग",
    description: "Gram Rozgar Sahayak takes geo-tagged photograph of existing kutcha house on official AwaasApp.",
    descriptionHi: "ग्राम रोजगार सहायक द्वारा आधिकारिक आवास ऐप से पुराने कच्चे मकान का जियो-टैग फोटो खींचना।",
    status: "pending",
    completedAt: null,
    actionRequired: "Coordinate with Gram Rozgar Sahayak for site visit and upload.",
    actionRequiredHi: "ग्राम रोजगार सहायक से संपर्क कर साइट विजिट और जियो-टैग फोटो अपलोड कराएं।",
    officialRole: "Gram Rozgar Sahayak (GRS) / Block Team"
  },
  {
    id: 5,
    title: "5. Block Development Office (BDO) Sanction Order",
    titleHi: "5. ब्लॉक विकास अधिकारी (BDO) द्वारा स्वीकृति आदेश",
    description: "Administrative approval issued with permanent Beneficiary Registration ID.",
    descriptionHi: "स्थायी लाभार्थी पंजीकरण आईडी के साथ प्रशासनिक स्वीकृति आदेश जारी।",
    status: "pending",
    completedAt: null,
    actionRequired: "Collect Sanction Letter copy and verify bank account seeding in PFMS.",
    actionRequiredHi: "स्वीकृति पत्र प्राप्त करें एवं पीएफएमएस पोर्टल पर बैंक खाता सीडिंग की पुष्टि करें।",
    officialRole: "Block Development Officer (BDO)"
  },
  {
    id: 6,
    title: "6. Direct Benefit Transfer (DBT) 1st Installment",
    titleHi: "6. प्रत्यक्ष लाभ अंतरण (DBT) पहली किस्त जारी",
    description: "First installment (~₹40,000) credited directly to bank account to begin plinth foundation.",
    descriptionHi: "नींव निर्माण प्रारंभ करने हेतु पहली किस्त (~₹40,000) सीधे बैंक खाते में प्रेषित।",
    status: "pending",
    completedAt: null,
    actionRequired: "Begin foundation construction and request plinth geo-tagging for 2nd installment.",
    actionRequiredHi: "नींव का कार्य शुरू करें और दूसरी किस्त हेतु प्लिंथ जियो-टैगिंग करवाएं।",
    officialRole: "Ministry of Rural Development / State Treasury via PFMS"
  }
];

export const demoHouseholdProfile = {
  isDemo: true,
  name: "Ramkishan Yadav",
  nameHi: "रामकिशन यादव",
  headGender: "male",
  isWomanHead: false,
  isDifferentlyAbled: false,
  state: "Uttar Pradesh",
  district: "Sitapur",
  block: "Maholi",
  village: "Rampur Grant",
  isRural: true,
  householdSize: 5,
  primaryEarner: "Agricultural Labour & Small Farmer",
  socialCategory: "OBC",
  currentHouseType: "kutcha",
  landOwnership: "ancestral",
  landArea: "850 sq. ft.",
  annualIncome: "₹72,000",
  rationCardType: "BPL / Priority Household (PHH)",
  hasMotorVehicle: false,
  hasKccLimit: false,
  hasGovtEmployee: false,
  hasNonAgriEnterprise: false
};

export const demoEligibilityAssessment = {
  isDemo: true,
  evaluatedAt: "2024-10-15T10:30:00Z",
  status: "eligible",
  score: 95,
  summaryText: "High Potential Eligibility for PMAY-G and Mukhya Mantri Awas Yojana.",
  summaryTextHi: "पीएमएवाई-ग्रामीण एवं मुख्यमंत्री आवास योजना हेतु उच्च संभावित पात्रता।",
  totalEstimatedAssistance: "₹1,57,000 - ₹1,69,000",
  reasons: [
    {
      factor: "Shelter Need",
      status: "positive",
      text: "Family currently resides in a Kutcha dwelling without pucca concrete roof.",
      textHi: "परिवार वर्तमान में कच्चे मकान में रहता है, कोई पक्की छत नहीं है।"
    },
    {
      factor: "Rural & Land Availability",
      status: "positive",
      text: "Land (850 sq. ft.) available in notified rural Gram Panchayat.",
      textHi: "अधिसूचित ग्राम पंचायत क्षेत्र में 850 वर्ग फुट ज़मीन उपलब्ध है।"
    },
    {
      factor: "PMAY-G 13 Exclusions Checked",
      status: "positive",
      text: "No motorized vehicle, no govt salary, no mechanized farm machinery, and income well within BPL criteria.",
      textHi: "13 अपवर्जन नियमों में से कोई भी लागू नहीं—न गाड़ी, न सरकारी नौकरी, न अधिक आय।"
    },
    {
      factor: "MGNREGA Wages Entitlement",
      status: "positive",
      text: "Eligible for 90 days of unskilled labour wages (~₹25,000) during house construction.",
      textHi: "मकान निर्माण के दौरान 90 दिनों की मनरेगा अकुशल मजदूरी (~₹25,000) का अधिकार।"
    }
  ],
  matchedSchemes: ["pmay-g", "mmay-g", "rhiss"],
  actionPlan: [
    "Verify spelling alignment between Khatauni (राम किशन) and Aadhaar (रामकिशन).",
    "Submit name in upcoming Gram Sabha priority listing.",
    "Ensure Bank Account has active Aadhaar NPCI mapper enabled for direct DBT."
  ]
};

export const demoUploadedDocs = {
  aadhaar: {
    id: "aadhaar",
    fileName: "Aadhaar_Card_Ramkishan.pdf",
    fileSize: "1.2 MB",
    fileType: "application/pdf",
    uploadedAt: "2024-10-15T11:00:00Z",
    status: "ready", // ready | review | missing
    extractedInfo: {
      name: "Ramkishan Yadav",
      dobOrYear: "1984",
      gender: "Male",
      uidLast4: "8472",
      addressDistrict: "Sitapur, Uttar Pradesh"
    },
    verificationNotes: "Valid Aadhaar format. Name and rural address match eligibility profile."
  },
  land_record: {
    id: "land_record",
    fileName: "Khatauni_Sitapur_Khasra_142.pdf",
    fileSize: "2.4 MB",
    fileType: "application/pdf",
    uploadedAt: "2024-10-15T11:05:00Z",
    status: "review",
    extractedInfo: {
      khasraNumber: "142/2",
      khataNumber: "00318",
      landType: "Agricultural / Residential Abadi",
      recordedName: "Ram Kishan s/o Shiv Prasad",
      village: "Rampur Grant"
    },
    verificationNotes: "Minor space variance: Name appears as 'Ram Kishan' instead of 'Ramkishan'. We recommend a simple self-affidavit or Patwari signature."
  },
  bank_passbook: {
    id: "bank_passbook",
    fileName: "Bank_Baroda_Passbook.jpg",
    fileSize: "850 KB",
    fileType: "image/jpeg",
    uploadedAt: "2024-10-15T11:12:00Z",
    status: "ready",
    extractedInfo: {
      bankName: "Bank of Baroda - Maholi Branch",
      accountLast4: "5912",
      ifsc: "BARB0MAHOLI",
      dbtStatus: "NPCI Seeded / Active"
    },
    verificationNotes: "Account is active and seeded with Aadhaar for DBT. No joint account conflict."
  },
  mgnrega_jobcard: {
    id: "mgnrega_jobcard",
    fileName: "MGNREGA_JobCard_UP_03.jpg",
    fileSize: "1.1 MB",
    fileType: "image/jpeg",
    uploadedAt: "2024-10-15T11:18:00Z",
    status: "ready",
    extractedInfo: {
      jobCardNo: "UP-28-004-012/941",
      familyHead: "Ramkishan Yadav",
      validity: "Active"
    },
    verificationNotes: "Active job card. Entitled to 90 days labour wages during house construction."
  },
  kutcha_photo: {
    id: "kutcha_photo",
    fileName: "Kutcha_House_Front_Photo.jpg",
    fileSize: "3.1 MB",
    fileType: "image/jpeg",
    uploadedAt: "2024-10-15T11:25:00Z",
    status: "ready",
    extractedInfo: {
      roofType: "Thatch / Mud Tiles",
      wallType: "Unplastered Mud / Clay Brick",
      geoTagged: "Lat 27.6534, Long 80.4812"
    },
    verificationNotes: "Clear geo-tagged photo showing kutcha structure with applicant. Complies with AwaasApp photography guidelines."
  }
};
