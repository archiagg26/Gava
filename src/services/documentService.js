import { defaultRequiredDocs } from '../data/demoData';

export const documentService = {
  getRequiredDocsList: () => {
    return defaultRequiredDocs;
  },

  // Calculate overall readiness score based on uploaded documents
  calculateReadiness: (uploadedDocs = {}) => {
    const required = defaultRequiredDocs;
    if (!required.length) return 0;

    let totalWeight = 0;
    let earnedWeight = 0;

    required.forEach(docDef => {
      const weight = docDef.mandatory ? 2 : 1;
      totalWeight += weight;

      const userDoc = uploadedDocs[docDef.id];
      if (userDoc) {
        if (userDoc.status === 'ready') {
          earnedWeight += weight;
        } else if (userDoc.status === 'review') {
          earnedWeight += weight * 0.6; // partial readiness if review needed
        }
      }
    });

    return Math.round((earnedWeight / totalWeight) * 100);
  },

  // Identify missing mandatory documents
  getMissingDocs: (uploadedDocs = {}) => {
    return defaultRequiredDocs.filter(docDef => {
      const doc = uploadedDocs[docDef.id];
      return !doc || doc.status === 'missing';
    });
  },

  // Validate file before processing
  validateFile: (file, docId) => {
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    const docDef = defaultRequiredDocs.find(d => d.id === docId);
    const maxBytes = (docDef ? docDef.maxSizeMB : 5) * 1024 * 1024;

    if (file.size > maxBytes) {
      return {
        valid: false,
        error: `File size exceeds ${docDef ? docDef.maxSizeMB : 5}MB limit. Current: ${(file.size / (1024 * 1024)).toFixed(1)}MB`
      };
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Unsupported file format. Please upload PDF, JPG, or PNG files only.'
      };
    }

    return { valid: true };
  },

  // Automated client-side simulated document scanner
  // Performs safe pattern checks on file names and extracted text simulations without exposing sensitive data
  analyzeDocument: async (file, docId, userProfile = {}) => {
    // Simulating realistic scan delay
    await new Promise(res => setTimeout(res, 800));

    const nameToMatch = userProfile.name || 'Ramkishan Yadav';
    const districtToMatch = userProfile.district || 'Sitapur';
    const villageToMatch = userProfile.village || 'Rampur';

    const baseResult = {
      id: docId,
      fileName: file.name,
      fileSize: file.size < 1024 * 1024
        ? `${Math.round(file.size / 1024)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: file.type,
      uploadedAt: new Date().toISOString()
    };

    switch (docId) {
      case 'aadhaar':
        return {
          ...baseResult,
          status: 'ready',
          extractedInfo: {
            detectedName: nameToMatch,
            uidMasked: 'XXXX-XXXX-8472',
            stateDistrict: `${districtToMatch}, ${userProfile.state || 'State'}`,
            authenticityCheck: 'Valid QR structure simulated'
          },
          verificationNotes: 'Automated Check: Aadhaar format valid. Name and address align with eligibility profile. Note: Official verification is carried out via UIDAI OTP during Gram Panchayat survey.'
        };

      case 'land_record': {
        // Test if file name hints at spelling or mismatch
        const isMismatchSimulation = file.name.toLowerCase().includes('mismatch') || file.name.toLowerCase().includes('review');
        if (isMismatchSimulation) {
          return {
            ...baseResult,
            status: 'review',
            extractedInfo: {
              khasraNumber: '142/2',
              khataNumber: '00318',
              recordedName: 'Ram Kishan (Space variance detected)',
              village: villageToMatch
            },
            verificationNotes: 'Attention Needed: Detected minor variation between Aadhaar and Khatauni name. In rural records, a space variance ("Ram Kishan" vs "Ramkishan") can cause PFMS rejection. Obtain a Lekhpal/Gram Pradhan identity certification or notary affidavit.'
          };
        }
        return {
          ...baseResult,
          status: 'ready',
          extractedInfo: {
            khasraNumber: '142/2',
            khataNumber: '00318',
            recordedName: nameToMatch,
            landCategory: 'Abadi / Agricultural Homestead'
          },
          verificationNotes: 'Automated Check: Land title matches applicant name. Valid record of rights detected.'
        };
      }

      case 'bank_passbook':
        return {
          ...baseResult,
          status: 'ready',
          extractedInfo: {
            accountHolder: nameToMatch,
            dbtStatus: 'DBT / Aadhaar NPCI Link Confirmed',
            ifscFormat: 'Valid RBI Bank IFSC'
          },
          verificationNotes: 'Automated Check: Single account with Aadhaar seeding. DBT ready for direct installment deposit.'
        };

      case 'mgnrega_jobcard':
        return {
          ...baseResult,
          status: 'ready',
          extractedInfo: {
            jobCardStatus: 'Active Status',
            wageEntitlement: '90-95 Days Unskilled Labour Eligible'
          },
          verificationNotes: 'Automated Check: Job card active. Labor wage integration enabled.'
        };

      case 'kutcha_photo':
        return {
          ...baseResult,
          status: 'ready',
          extractedInfo: {
            imageQuality: 'High Resolution (Passed)',
            roofDetected: 'Kutcha / Thatch / Non-Concrete',
            geotagStatus: 'GPS Coordinates Simulated'
          },
          verificationNotes: 'Automated Check: Image demonstrates non-pucca shelter with applicant present. Meets AwaasApp inspection prerequisites.'
        };

      default:
        return {
          ...baseResult,
          status: 'ready',
          extractedInfo: {
            documentType: docId,
            scanStatus: 'Processed successfully'
          },
          verificationNotes: 'Document accepted for preliminary verification.'
        };
    }
  }
};
