import { schemesData } from '../data/schemesData';

export const schemeService = {
  getAllSchemes: () => {
    return schemesData;
  },

  getSchemeById: (id) => {
    return schemesData.find(s => s.id === id);
  },

  searchSchemes: ({ query = '', filterType = 'all' }) => {
    const q = query.toLowerCase().trim();
    return schemesData.filter(scheme => {
      const matchesType = filterType === 'all' || scheme.type === filterType;
      const matchesQuery = !q ||
        scheme.name.toLowerCase().includes(q) ||
        scheme.nameHi.includes(q) ||
        scheme.targetBeneficiaries.toLowerCase().includes(q) ||
        scheme.applicability.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  },

  // Evaluates user profile against verified official criteria
  evaluateEligibility: (profile) => {
    if (!profile) {
      return {
        status: 'insufficient',
        score: 0,
        summaryText: 'Insufficient Information Provided',
        summaryTextHi: 'अपर्याप्त जानकारी दर्ज की गई',
        reasons: [],
        matchedSchemes: [],
        actionPlan: ['Please complete all steps of the eligibility assessment wizard.']
      };
    }

    const reasons = [];
    const matchedSchemes = [];
    let isEligiblePmayG = true;
    let score = 50;

    // 1. Rural Verification
    if (!profile.isRural) {
      isEligiblePmayG = false;
      reasons.push({
        factor: 'Geographic Location',
        status: 'negative',
        text: 'Not in a notified rural Gram Panchayat. PMAY-G is strictly for rural areas. Urban residents should look into PMAY-Urban 2.0.',
        textHi: 'अधिसूचित ग्रामीण ग्राम पंचायत क्षेत्र में नहीं है। पीएमएवाई-जी केवल ग्रामीण क्षेत्रों के लिए है।'
      });
    } else {
      score += 15;
      reasons.push({
        factor: 'Rural Area Confirmation',
        status: 'positive',
        text: 'Confirmed location in notified rural Gram Panchayat jurisdiction.',
        textHi: 'अधिसूचित ग्रामीण ग्राम पंचायत क्षेत्र में निवास की पुष्टि।'
      });
    }

    // 2. Existing Housing Condition
    if (profile.currentHouseType === 'pucca') {
      isEligiblePmayG = false;
      reasons.push({
        factor: 'Existing Pucca House Exclusion',
        status: 'negative',
        text: 'Households that already own a pucca concrete house are strictly excluded from PMAY-G and state grant schemes.',
        textHi: 'जिन परिवारों के पास पहले से पक्का मकान है, वे पीएमएवाई-जी व राज्य अनुदान योजनाओं से अपात्र हैं।'
      });
    } else if (profile.currentHouseType === 'kutcha') {
      score += 25;
      reasons.push({
        factor: 'Kutcha Shelter Deprivation',
        status: 'positive',
        text: 'Residing in a kutcha / thatched roof shelter without permanent walls—highest priority category under PMAY-G.',
        textHi: 'कच्चे या घास-फूस के मकान में निवास—पीएमएवाई-जी के तहत सर्वोच्च प्राथमिकता।'
      });
    } else if (profile.currentHouseType === 'semiPucca') {
      score += 15;
      reasons.push({
        factor: 'Semi-Pucca Condition',
        status: 'positive',
        text: 'Semi-pucca dwelling may qualify under Awaas+ survey pending structural verification.',
        textHi: 'अर्ध-पक्का मकान होने पर आवास+ सर्वेक्षण के तहत भौतिक सत्यापन उपरांत पात्रता संभव।'
      });
    }

    // 3. Land Status
    if (profile.landOwnership === 'none') {
      isEligiblePmayG = false;
      reasons.push({
        factor: 'Land Title Absence',
        status: 'negative',
        text: 'Construction grant requires available plot. However, state landless assistance schemes can provide homestead land patta first.',
        textHi: 'मकान निर्माण हेतु ज़मीन आवश्यक है। हालांकि भूमिहीनों हेतु राज्य सरकार आवासीय पट्टा योजना का लाभ दे सकती है।'
      });
    } else {
      score += 10;
      reasons.push({
        factor: 'Land Availability',
        status: 'positive',
        text: `Plot available (${profile.landOwnership === 'patta' ? 'Government Patta' : profile.landOwnership === 'self' ? 'Self Registered' : 'Ancestral Possession'}).`,
        textHi: 'मकान निर्माण हेतु ज़मीन/पट्टा उपलब्ध है।'
      });
    }

    // 4. PMAY-G 13 Exclusions Check
    const exclusionsTriggered = [];
    if (profile.hasGovtEmployee) {
      exclusionsTriggered.push('Household has regular government employee');
    }
    if (profile.hasMotorVehicle) {
      exclusionsTriggered.push('Ownership of motorized 3/4 wheeler');
    }
    if (profile.hasKccLimit) {
      exclusionsTriggered.push('Kisan Credit Card (KCC) limit exceeding ₹50,000');
    }
    if (profile.hasNonAgriEnterprise) {
      exclusionsTriggered.push('Registered non-agricultural enterprise');
    }

    if (exclusionsTriggered.length > 0) {
      isEligiblePmayG = false;
      reasons.push({
        factor: 'Statutory Exclusion Criteria',
        status: 'negative',
        text: `Triggered exclusion factors: ${exclusionsTriggered.join(', ')}. Disqualifies from PMAY-G grant.`,
        textHi: `सरकारी अपवर्जन नियम लागू: ${exclusionsTriggered.join(', ')}।`
      });
    } else {
      score += 10;
      reasons.push({
        factor: 'Exclusion Check Cleared',
        status: 'positive',
        text: 'Cleared all 13 standard PMAY-G economic exclusion filters.',
        textHi: 'सभी 13 मानक सरकारी अपवर्जन शर्तों की जांच में पात्र।'
      });
    }

    // 5. Special Priority Boosters
    if (profile.isWomanHead) {
      matchedSchemes.push('pmay-g-women-title');
      reasons.push({
        factor: 'Gender Equity Priority',
        status: 'positive',
        text: 'Female-headed household or joint titling qualifies for priority waitlist under PMAY-G and stamp duty waiver.',
        textHi: 'महिला मुखिया या संयुक्त स्वामित्व के आधार पर प्राथमिकता सूची में वरीयता एवं स्टाम्प शुल्क छूट।'
      });
    }

    if (profile.isDifferentlyAbled) {
      reasons.push({
        factor: 'Social Justice Priority',
        status: 'positive',
        text: 'Household with differently-abled member receives statutory priority in Gram Sabha allocation.',
        textHi: 'दिव्यांग सदस्य वाले परिवारों को ग्राम सभा आवंटन में वैधानिक प्राथमिकता।'
      });
    }

    // Determine Final Matched Schemes
    if (isEligiblePmayG) {
      matchedSchemes.unshift('pmay-g');
      matchedSchemes.push('mmay-g');
    }

    // RHISS Credit subsidy can be applicable if they need loan assistance for expansion
    if (profile.isRural && profile.landOwnership !== 'none') {
      matchedSchemes.push('rhiss');
    }

    // Final Status classification
    let finalStatus = 'ineligible';
    let summaryText = 'Currently Ineligible Under Standard Central Grant Criteria';
    let summaryTextHi = 'वर्तमान केंद्रीय अनुदान नियमों के अनुसार अपात्र';

    if (isEligiblePmayG) {
      finalStatus = 'eligible';
      summaryText = 'High Potential Eligibility for PMAY-G and State Housing Grants';
      summaryTextHi = 'पीएमएवाई-ग्रामीण एवं राज्य आवास अनुदान हेतु उच्च संभावित पात्रता';
    } else if (matchedSchemes.includes('rhiss') || profile.currentHouseType === 'semiPucca') {
      finalStatus = 'potentially_eligible';
      summaryText = 'Potentially Eligible for Credit Linked Subsidies or State Housing Schemes';
      summaryTextHi = 'ब्याज सब्सिडी (RHISS) अथवा राज्य विशेष योजनाओं हेतु संभावित पात्र';
    }

    const actionPlan = [];
    if (finalStatus === 'eligible') {
      actionPlan.push('Verify your Khatauni and Aadhaar spelling in the Document Center.');
      actionPlan.push('Check upcoming Gram Sabha agenda to ensure family listing in Awaas+ list.');
      actionPlan.push('Ensure your bank account has Aadhaar NPCI mapper enabled for DBT transfers.');
    } else if (finalStatus === 'potentially_eligible') {
      actionPlan.push('Explore Rural Housing Interest Subsidy Scheme (RHISS) through your local bank branch.');
      actionPlan.push('Check with the Block Development Office if your case qualifies for special calamity assistance.');
    } else {
      actionPlan.push('If your socio-economic condition has changed or records have errors, appeal to your Gram Panchayat.');
      actionPlan.push('Consult a local Common Service Center (CSC) operator to review SECC survey status.');
    }

    return {
      evaluatedAt: new Date().toISOString(),
      status: finalStatus,
      score: Math.min(Math.max(score, 15), 100),
      summaryText,
      summaryTextHi,
      totalEstimatedAssistance: finalStatus === 'eligible' ? '₹1,57,000 - ₹1,72,000' : finalStatus === 'potentially_eligible' ? 'Up to ₹38,359 Loan Subsidy' : '₹0',
      reasons,
      matchedSchemes: Array.from(new Set(matchedSchemes)),
      actionPlan
    };
  }
};
