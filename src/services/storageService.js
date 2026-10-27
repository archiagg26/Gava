// Safe local persistence for GharSetu
// Adheres strictly to security rule: Never store raw document blobs or sensitive full identity numbers in localStorage.

const STORAGE_KEYS = {
  PROFILE: 'gharsetu_user_profile',
  ELIGIBILITY: 'gharsetu_eligibility_assessment',
  DOCUMENTS: 'gharsetu_documents_metadata',
  MILESTONES: 'gharsetu_milestones_progress',
  RECENT_ACTIVITY: 'gharsetu_recent_activity',
  AUTH_CURRENT_USER: 'gharsetu_auth_current_user',
  AUTH_USERS: 'gharsetu_auth_registered_users'
};

const DEFAULT_USERS = [
  {
    id: 'user_ramkishan',
    name: 'Ramkishan Yadav',
    email: 'demo@gharsetu.in',
    mobile: '9876543210',
    password: 'demo1234',
    state: 'Uttar Pradesh',
    district: 'Sitapur',
    village: 'Rampur Grant',
    isDemo: true,
    role: 'Rural Citizen'
  },
  {
    id: 'user_geeta',
    name: 'Geeta Devi',
    email: 'geeta@gharsetu.in',
    mobile: '9876543211',
    password: 'demo1234',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    village: 'Bilkisganj',
    isDemo: true,
    role: 'Woman Head of Household'
  }
];

export const storageService = {
  // Authentication & Users
  getRegisteredUsers: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USERS, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_USERS;
    }
  },

  registerUser: (newUser) => {
    try {
      const users = storageService.getRegisteredUsers();
      // Check if user already exists
      const existing = users.find(u => u.email === newUser.email || u.mobile === newUser.mobile);
      if (existing) {
        return { success: false, error: 'A user with this Email or Mobile number already exists.' };
      }

      const userToSave = {
        ...newUser,
        id: `user_${Date.now()}`,
        role: newUser.role || 'Rural Citizen',
        createdAt: new Date().toISOString()
      };

      const updated = [...users, userToSave];
      localStorage.setItem(STORAGE_KEYS.AUTH_USERS, JSON.stringify(updated));
      return { success: true, user: userToSave };
    } catch (e) {
      return { success: false, error: 'Failed to register user.' };
    }
  },

  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser: (user) => {
    try {
      if (!user) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_CURRENT_USER);
      } else {
        localStorage.setItem(STORAGE_KEYS.AUTH_CURRENT_USER, JSON.stringify(user));
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  // User Profile
  getUserProfile: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading profile from localStorage', e);
      return null;
    }
  },

  saveUserProfile: (profile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      storageService.addActivity({
        title: 'Profile Updated',
        titleHi: 'प्रोफ़ाइल अपडेट की गई',
        type: 'profile'
      });
      return true;
    } catch (e) {
      console.error('Error saving profile to localStorage', e);
      return false;
    }
  },

  // Eligibility Assessment
  getEligibilityAssessment: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ELIGIBILITY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading eligibility from localStorage', e);
      return null;
    }
  },

  saveEligibilityAssessment: (assessment) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ELIGIBILITY, JSON.stringify(assessment));
      storageService.addActivity({
        title: 'Eligibility Assessment Completed',
        titleHi: 'पात्रता मूल्यांकन पूर्ण हुआ',
        type: 'eligibility'
      });
      return true;
    } catch (e) {
      console.error('Error saving eligibility to localStorage', e);
      return false;
    }
  },

  // Documents Metadata (Only metadata & safe analysis notes, never raw binary/base64)
  getDocumentsMetadata: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error reading documents metadata', e);
      return {};
    }
  },

  saveDocumentsMetadata: (docsMap) => {
    try {
      const sanitized = {};
      Object.keys(docsMap).forEach(key => {
        const item = docsMap[key];
        sanitized[key] = {
          id: item.id,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          uploadedAt: item.uploadedAt,
          status: item.status,
          extractedInfo: item.extractedInfo || {},
          verificationNotes: item.verificationNotes || ''
        };
      });
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(sanitized));
      return true;
    } catch (e) {
      console.error('Error saving documents metadata', e);
      return false;
    }
  },

  // Milestones Progress
  getMilestones: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MILESTONES);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading milestones', e);
      return null;
    }
  },

  saveMilestones: (milestones) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
      return true;
    } catch (e) {
      console.error('Error saving milestones', e);
      return false;
    }
  },

  // Recent Activity Log
  getRecentActivity: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addActivity: ({ title, titleHi, type }) => {
    try {
      const activities = storageService.getRecentActivity();
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        title,
        titleHi,
        type
      };
      const updated = [newEntry, ...activities.slice(0, 9)];
      localStorage.setItem(STORAGE_KEYS.RECENT_ACTIVITY, JSON.stringify(updated));
    } catch (e) {
      // fail silent
    }
  },

  // Clear all
  clearAll: () => {
    try {
      const currentUser = storageService.getCurrentUser();
      Object.values(STORAGE_KEYS).forEach(k => {
        if (k !== STORAGE_KEYS.AUTH_USERS) {
          localStorage.removeItem(k);
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
};
