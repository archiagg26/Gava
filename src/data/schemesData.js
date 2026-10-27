export const schemesData = [
  {
    id: "pmay-g",
    name: "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
    nameHi: "प्रधानमंत्री आवास योजना - ग्रामीण (पीएमएवाई-जी)",
    authority: "Ministry of Rural Development, Government of India",
    authorityHi: "ग्रामीण विकास मंत्रालय, भारत सरकार",
    type: "central",
    category: "Grant / Direct Financial Assistance",
    targetBeneficiaries: "Houseless rural families and those living in kutcha/dilapidated houses based on SECC 2011 and Awaas+ surveys.",
    targetBeneficiariesHi: "बेघर ग्रामीण परिवार एवं कच्चे/जीर्ण-शीर्ण मकानों में रहने वाले परिवार (SECC 2011 एवं आवास+ सर्वेक्षण आधार पर)।",
    applicability: "All States & Union Territories (Rural areas only, except Delhi & Chandigarh)",
    applicabilityHi: "सभी राज्य एवं केंद्रशासित प्रदेश (केवल ग्रामीण क्षेत्र)",
    financialAssistance: {
      plains: "₹1,20,000 direct DBT grant",
      hillyNE: "₹1,30,000 direct DBT grant (Hilly, North-Eastern, Himalayan states & IAP districts)",
      mgnregaWage: "90 days (plains) / 95 days (hilly) of unskilled labour wages (~₹25,000 - ₹30,000)",
      sbmToilet: "₹12,000 under Swachh Bharat Mission - Gramin for household latrine",
      optionalLoan: "Institutional finance up to ₹70,000 at subsidized interest (optional)"
    },
    totalBenefitEstimate: "₹1,57,000 - ₹1,72,000 (Grant + MGNREGA wages + Toilet assistance)",
    eligibilitySummary: [
      "Must not own a pucca house anywhere in India.",
      "Must reside in a rural area / Gram Panchayat.",
      "Land must be available (self-owned, ancestral, or government-allotted patta).",
      "Household must not fall under the 13 exclusion criteria (e.g. motorized 4-wheeler, govt employee, mechanized agricultural equipment, income tax payer)."
    ],
    requiredDocuments: [
      "Aadhaar Card of all adult household members",
      "Consent for Aadhaar authentication",
      "Bank Account Passbook (Aadhaar-seeded & DBT enabled)",
      "MGNREGA Job Card (for unskilled labor wage transfer)",
      "Land Record / Khatauni / Jamabandi / Patta copy",
      "Swachh Bharat Mission (SBM) registration number (for toilet grant)"
    ],
    officialPortalUrl: "https://pmayg.nic.in",
    sourceCheckUrl: "https://rural.gov.in/en/scheme-programmes/pradhan-mantri-awas-yojana-gramin",
    lastVerifiedDate: "October 2024 (Cabinet approval for 2 crore additional rural houses under PMAY-G 2.0)",
    featured: true
  },
  {
    id: "rhiss",
    name: "Rural Housing Interest Subsidy Scheme (RHISS)",
    nameHi: "ग्रामीण आवास ब्याज सब्सिडी योजना (आरएचआईएसएस)",
    authority: "Ministry of Rural Development / National Housing Bank",
    authorityHi: "ग्रामीण विकास मंत्रालय / राष्ट्रीय आवास बैंक",
    type: "credit",
    category: "Interest Subsidy on Home Loan",
    targetBeneficiaries: "Rural households not covered under PMAY-G who want to construct a new pucca house or modify/expand an existing kutcha/semi-pucca house.",
    targetBeneficiariesHi: "वे ग्रामीण परिवार जो पीएमएवाई-जी में कवर नहीं हैं और नया पक्का मकान बनाना चाहते हैं या मौजूदा मकान का विस्तार करना चाहते हैं।",
    applicability: "All rural areas across India through scheduled commercial banks, RRBs, and cooperative banks.",
    applicabilityHi: "संपूर्ण भारत के ग्रामीण क्षेत्रों में बैंकों व सहकारी समितियों के माध्यम से।",
    financialAssistance: {
      interestSubsidyRate: "3.0% per annum interest subsidy",
      maxLoanAmountEligible: "Up to ₹2,00,000 principal eligible for subsidy",
      subsidyNPV: "Net Present Value (NPV) subsidy of approx. ₹38,359 credited upfront to loan account",
      maxTenure: "Up to 20 years tenure"
    },
    totalBenefitEstimate: "Up to ~₹38,359 upfront interest reduction on loan repayment",
    eligibilitySummary: [
      "Rural resident wishing to build new pucca dwelling or add rooms to kutcha house.",
      "No restriction based on caste, religion, or strict poverty line, provided repayment capacity is assessed by lending bank.",
      "Must not have availed interest subsidy under any other Central government housing scheme."
    ],
    requiredDocuments: [
      "Aadhaar Card and PAN Card / Form 60",
      "Proof of rural residence (Gram Panchayat certificate/Voter ID)",
      "Clear title or valid possession documents for construction land",
      "Income proof / agricultural land record / bank statement for loan underwriting",
      "House construction estimate and layout plan approved by Gram Panchayat"
    ],
    officialPortalUrl: "https://pmayg.nic.in",
    sourceCheckUrl: "https://mohua.gov.in/cms/rural-housing-interest-subsidy-scheme.php",
    lastVerifiedDate: "September 2024",
    featured: true
  },
  {
    id: "mmay-g",
    name: "Mukhya Mantri Awas Yojana - Gramin (State Rural Special Scheme)",
    nameHi: "मुख्यमंत्री आवास योजना - ग्रामीण (राज्य विशेष योजना)",
    authority: "State Rural Development Departments (UP, MP, Assam, Bihar, Rajasthan, etc.)",
    authorityHi: "राज्य ग्रामीण विकास विभाग (उत्तर प्रदेश, मध्य प्रदेश, असम, बिहार आदि)",
    type: "state",
    category: "State Direct Financial Grant",
    targetBeneficiaries: "Needy families ineligible for or left out of the SECC 2011/PMAY-G central list, including natural calamity victims, leprosy/kala-azar patients, and vulnerable tribal groups.",
    targetBeneficiariesHi: "वे जरूरतमंद परिवार जो केंद्रीय SECC सूची में छूट गए हैं—जैसे आपदा पीड़ित, कुष्ठ रोग प्रभावित या विशेष रूप से कमजोर जनजातीय समूह।",
    applicability: "Specific participating states (Rules and grant amounts harmonized with PMAY-G norms).",
    applicabilityHi: "संबंधित राज्य सरकार के ग्रामीण क्षेत्रों में।",
    financialAssistance: {
      plains: "₹1,20,000 direct state grant (100% state funded)",
      mgnregaWage: "90 days of MGNREGA employment wages (~₹25,000)",
      toiletGrant: "₹12,000 for toilet construction",
      solarKit: "Free solar home lighting kit (in select states like UP/MP)"
    },
    totalBenefitEstimate: "₹1,57,000 + Solar electrification support",
    eligibilitySummary: [
      "Must be a bonafide permanent resident of the respective state in a rural area.",
      "Must NOT have received benefits from PMAY-G or any other government housing scheme.",
      "Family name must be recommended and approved by the Gram Sabha / Block Verification Committee."
    ],
    requiredDocuments: [
      "State Domicile Certificate / Voter ID",
      "Aadhaar Card",
      "Gram Sabha Recommendation Resolution (प्रस्ताव)",
      "Land Ownership Document (Khatauni / Patta)",
      "Bank Account Passbook (IFSC & Aadhaar linked)"
    ],
    officialPortalUrl: "https://rdpr.up.gov.in",
    sourceCheckUrl: "https://data.gov.in/resource/state-wise-rural-housing-schemes",
    lastVerifiedDate: "October 2024",
    featured: false
  },
  {
    id: "biju-pucca-ghar",
    name: "Biju Pucca Ghar Yojana / State Kutcha-to-Pucca Initiatives",
    nameHi: "बीजू पक्का घर योजना / राज्य पक्का आवास पहल",
    authority: "State Panchayati Raj & Drinking Water Departments (e.g. Odisha)",
    authorityHi: "राज्य पंचायती राज एवं पेयजल विभाग",
    type: "state",
    category: "Kutcha House Replacement Grant",
    targetBeneficiaries: "Rural households living in kutcha dwellings who suffered natural disasters (floods, cyclones, fire) or belong to mining-affected or vulnerable clusters.",
    targetBeneficiariesHi: "कच्चे मकानों में रहने वाले ग्रामीण परिवार जो प्राकृतिक आपदा (बाढ़, चक्रवात, आगजनी) से प्रभावित हुए हों।",
    applicability: "State-specific districts",
    applicabilityHi: "संबंधित राज्य क्षेत्र",
    financialAssistance: {
      grant: "₹1,20,000 - ₹1,30,000 paid in 4 progress-linked installments",
      incentive: "₹20,000 fast-completion incentive if construction completed within 4 months"
    },
    totalBenefitEstimate: "Up to ₹1,50,000 including early completion incentive",
    eligibilitySummary: [
      "House must be completely kutcha (thatch/bamboo/mud/unburned brick walls).",
      "Applicant must have title or valid long-term possession of the building plot.",
      "Must not have received any pucca house assistance in the past."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "RoR (Record of Rights / Land Patta)",
      "MGNREGA Job Card",
      "Disaster / Kutcha House geo-tagged verification photograph"
    ],
    officialPortalUrl: "https://rhodisha.gov.in",
    sourceCheckUrl: "https://rhodisha.gov.in/guidelines",
    lastVerifiedDate: "August 2024",
    featured: false
  },
  {
    id: "pmay-g-women-title",
    name: "PMAY-G Women Ownership & Social Equity Priority Window",
    nameHi: "पीएमएवाई-जी महिला स्वामित्व एवं सामाजिक न्याय प्राथमिकता खिड़की",
    authority: "Ministry of Rural Development & State Revenue Departments",
    authorityHi: "ग्रामीण विकास मंत्रालय एवं राज्य राजस्व विभाग",
    type: "central",
    category: "Mandatory Gender Equity Provision",
    targetBeneficiaries: "All rural women, single mothers, widows, and households where house sanction is issued in the sole name of the female member or joint ownership with spouse.",
    targetBeneficiariesHi: "ग्रामीण महिलाएं, एकल माताएं, विधवाएं एवं वे परिवार जहां आवास स्वीकृति महिला के एकल नाम या पति-पत्नी के संयुक्त नाम पर होती है।",
    applicability: "Nationwide under PMAY-G guidelines (Statutory requirement)",
    applicabilityHi: "राष्ट्रव्यापी (पीएमएवाई-जी दिशानिर्देशों के तहत अनिवार्य)",
    financialAssistance: {
      standardBenefit: "Full PMAY-G financial grant (₹1.20L - ₹1.30L) + MGNREGA wages",
      stampDutyConcession: "100% stamp duty exemption on registry/patta in name of female member (in participating states)",
      prioritySanction: "First priority in Gram Sabha waitlists under category A/B"
    },
    totalBenefitEstimate: "₹1,60,000+ plus zero-cost land titling benefits",
    eligibilitySummary: [
      "All eligible PMAY-G families must mandate house title in the woman's name or joint title, except in all-male households.",
      "Widows and female-headed households receive top ranking in priority categorization."
    ],
    requiredDocuments: [
      "Aadhaar of female applicant",
      "Joint bank account passbook with spouse or individual account",
      "Gram Panchayat certificate of family structure"
    ],
    officialPortalUrl: "https://pmayg.nic.in",
    sourceCheckUrl: "https://pmayg.nic.in/netiay/PMAYG_Guidelines.pdf",
    lastVerifiedDate: "October 2024",
    featured: true
  }
];
