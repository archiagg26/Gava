import { cryptoService } from './cryptoService';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { storageService } from './storageService';

const AUTH_STORAGE_KEYS = {
  USERS_STORE: 'gharsetu_secure_users_v2',
  SESSION_TOKEN: 'gharsetu_secure_session_token_v2',
  ACTIVE_USER: 'gharsetu_secure_active_user_v2',
  LOGIN_ATTEMPTS: 'gharsetu_login_attempts_tracker_v2',
  ACTIVE_OTPS: 'gharsetu_active_otps_v2'
};

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

// Initial seed users with pre-computed salts and hashes (password is 'demo1234')
// We pre-compute them cleanly or generate them on first run
const getInitialSeedUsers = async () => {
  const salt1 = 'a1b2c3d4e5f67890';
  const hash1 = await cryptoService.hashPassword('demo1234', salt1);

  const salt2 = 'f0e1d2c3b4a56789';
  const hash2 = await cryptoService.hashPassword('demo1234', salt2);

  return [
    {
      id: 'usr_ramkishan',
      name: 'Ramkishan Yadav',
      email: 'demo@gharsetu.in',
      mobile: '9876543210',
      salt: salt1,
      passwordHash: hash1,
      state: 'Uttar Pradesh',
      district: 'Sitapur',
      village: 'Rampur Grant',
      isDemo: true,
      role: 'Rural Citizen',
      isWomanHead: false,
      createdAt: '2024-10-01T00:00:00.000Z'
    },
    {
      id: 'usr_geeta',
      name: 'Geeta Devi',
      email: 'geeta@gharsetu.in',
      mobile: '9876543211',
      salt: salt2,
      passwordHash: hash2,
      state: 'Madhya Pradesh',
      district: 'Sehore',
      village: 'Bilkisganj',
      isDemo: true,
      role: 'Woman Head of Household',
      isWomanHead: true,
      createdAt: '2024-10-01T00:00:00.000Z'
    }
  ];
};

export const authService = {
  // Check if live Supabase is active
  isRemoteBackend: () => isSupabaseConfigured(),

  // Load all users from secure storage
  getUsers: async () => {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEYS.USERS_STORE);
      if (data) {
        return JSON.parse(data);
      }
      const initial = await getInitialSeedUsers();
      localStorage.setItem(AUTH_STORAGE_KEYS.USERS_STORE, JSON.stringify(initial));
      return initial;
    } catch (e) {
      return getInitialSeedUsers();
    }
  },

  // Save users array
  saveUsers: (users) => {
    localStorage.setItem(AUTH_STORAGE_KEYS.USERS_STORE, JSON.stringify(users));
  },

  // Check rate-limiting / lockout state for an identifier
  checkLockout: (identifier) => {
    try {
      const attemptsData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEYS.LOGIN_ATTEMPTS) || '{}');
      const entry = attemptsData[identifier.toLowerCase()];
      if (!entry) return { locked: false, remainingSeconds: 0 };

      const now = Date.now();
      if (entry.count >= LOCKOUT_THRESHOLD) {
        const timePassed = now - entry.lastAttempt;
        if (timePassed < LOCKOUT_DURATION_MS) {
          const remainingSeconds = Math.ceil((LOCKOUT_DURATION_MS - timePassed) / 1000);
          return { locked: true, remainingSeconds };
        } else {
          // Lockout expired, reset counter
          delete attemptsData[identifier.toLowerCase()];
          localStorage.setItem(AUTH_STORAGE_KEYS.LOGIN_ATTEMPTS, JSON.stringify(attemptsData));
        }
      }
      return { locked: false, remainingSeconds: 0 };
    } catch (e) {
      return { locked: false, remainingSeconds: 0 };
    }
  },

  // Record a failed login attempt
  recordFailedAttempt: (identifier) => {
    try {
      const key = identifier.toLowerCase();
      const attemptsData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEYS.LOGIN_ATTEMPTS) || '{}');
      const entry = attemptsData[key] || { count: 0, lastAttempt: Date.now() };

      entry.count += 1;
      entry.lastAttempt = Date.now();
      attemptsData[key] = entry;

      localStorage.setItem(AUTH_STORAGE_KEYS.LOGIN_ATTEMPTS, JSON.stringify(attemptsData));
      return entry.count;
    } catch (e) {
      return 1;
    }
  },

  // Clear failed attempts on successful login
  clearFailedAttempts: (identifier) => {
    try {
      const key = identifier.toLowerCase();
      const attemptsData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEYS.LOGIN_ATTEMPTS) || '{}');
      delete attemptsData[key];
      localStorage.setItem(AUTH_STORAGE_KEYS.LOGIN_ATTEMPTS, JSON.stringify(attemptsData));
    } catch (e) {}
  },

  // 1. SIGN IN (Password based)
  signInWithPassword: async ({ identifier, password, rememberMe = true }) => {
    // If Supabase is configured, use live Supabase Auth
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password
        });
        if (error) throw error;

        const user = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          email: data.user.email,
          mobile: data.user.phone || '',
          role: 'Authenticated Citizen'
        };
        authService.setSession(user, data.session?.access_token, rememberMe);
        return { success: true, user, isRemote: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Cryptographic engine
    const cleanId = identifier.trim().toLowerCase();
    const lockout = authService.checkLockout(cleanId);
    if (lockout.locked) {
      return {
        success: false,
        error: `Too many failed attempts. Account temporarily locked for security. Please wait ${lockout.remainingSeconds}s.`,
        locked: true,
        remainingSeconds: lockout.remainingSeconds
      };
    }

    const users = await authService.getUsers();
    const matched = users.find(u =>
      u.email?.toLowerCase() === cleanId || u.mobile === cleanId
    );

    if (!matched) {
      const count = authService.recordFailedAttempt(cleanId);
      const remainingAttempts = Math.max(0, LOCKOUT_THRESHOLD - count);
      return {
        success: false,
        error: `Invalid credentials. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining before temporary lockout.` : 'Account locked.'}`
      };
    }

    const isPasswordValid = await cryptoService.verifyPassword(
      password,
      matched.salt,
      matched.passwordHash
    );

    if (!isPasswordValid) {
      const count = authService.recordFailedAttempt(cleanId);
      const remainingAttempts = Math.max(0, LOCKOUT_THRESHOLD - count);
      return {
        success: false,
        error: `Incorrect password. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining.` : 'Account temporarily locked.'}`
      };
    }

    // Login successful: clear failure history and create cryptographically secure session
    authService.clearFailedAttempts(cleanId);

    const sessionToken = cryptoService.generateSessionToken();
    const safeUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      mobile: matched.mobile,
      state: matched.state,
      district: matched.district,
      village: matched.village,
      isWomanHead: matched.isWomanHead,
      role: matched.role || 'Rural Citizen',
      isDemo: matched.isDemo || false
    };

    authService.setSession(safeUser, sessionToken, rememberMe);

    // Sync profile into storageService
    storageService.saveUserProfile({
      name: safeUser.name,
      state: safeUser.state || 'Uttar Pradesh',
      district: safeUser.district || 'Sitapur',
      village: safeUser.village || 'Rampur Grant',
      isRural: true,
      householdSize: 5,
      currentHouseType: 'kutcha',
      landOwnership: 'ancestral',
      isWomanHead: safeUser.isWomanHead || false,
      isDemo: safeUser.isDemo
    });

    return { success: true, user: safeUser };
  },

  // 2. SIGN UP (Registration with Salted SHA-256)
  signUp: async (userData) => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              full_name: userData.name,
              phone: userData.mobile,
              state: userData.state,
              district: userData.district
            }
          }
        });
        if (error) throw error;
        const user = {
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          state: userData.state,
          district: userData.district,
          role: 'Rural Citizen'
        };
        authService.setSession(user, data.session?.access_token);
        return { success: true, user, isRemote: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    const cleanEmail = userData.email?.trim().toLowerCase();
    const cleanMobile = userData.mobile?.trim();

    const users = await authService.getUsers();
    const exists = users.find(u =>
      (cleanEmail && u.email?.toLowerCase() === cleanEmail) ||
      (cleanMobile && u.mobile === cleanMobile)
    );

    if (exists) {
      return {
        success: false,
        error: 'An account with this Email or Mobile number already exists. Please Sign In.'
      };
    }

    // Generate cryptographic salt and hash password
    const salt = cryptoService.generateSalt();
    const passwordHash = await cryptoService.hashPassword(userData.password, salt);

    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail || '',
      mobile: cleanMobile || '',
      salt,
      passwordHash,
      state: userData.state || 'Uttar Pradesh',
      district: userData.district || 'Sitapur',
      village: userData.village || '',
      isWomanHead: Boolean(userData.isWomanHead),
      role: 'Rural Citizen',
      isDemo: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    authService.saveUsers(users);

    // Create session
    const sessionToken = cryptoService.generateSessionToken();
    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      state: newUser.state,
      district: newUser.district,
      village: newUser.village,
      isWomanHead: newUser.isWomanHead,
      role: newUser.role,
      isDemo: false
    };

    authService.setSession(safeUser, sessionToken, true);

    storageService.saveUserProfile({
      name: safeUser.name,
      state: safeUser.state,
      district: safeUser.district,
      village: safeUser.village || 'Rampur Grant',
      isRural: true,
      householdSize: 4,
      currentHouseType: 'kutcha',
      landOwnership: 'ancestral',
      isWomanHead: safeUser.isWomanHead,
      isDemo: false
    });

    return { success: true, user: safeUser };
  },

  // 3. OTP WORKFLOW (Mobile/Email verification)
  requestOTP: async (identifier) => {
    const cleanId = identifier.trim().toLowerCase();
    const { otp, expiresAt } = cryptoService.generateOTP();

    const otps = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEYS.ACTIVE_OTPS) || '{}');
    otps[cleanId] = { otp, expiresAt, requestedAt: Date.now() };
    localStorage.setItem(AUTH_STORAGE_KEYS.ACTIVE_OTPS, JSON.stringify(otps));

    // Simulated SMS dispatch with audit log
    storageService.addActivity({
      title: `Generated OTP verification for ${cleanId}`,
      titleHi: `${cleanId} हेतु ओटीपी सत्यापन कोड प्रेषित`,
      type: 'auth'
    });

    return {
      success: true,
      otp, // surfaced for test/demo convenience
      expiresAt,
      message: `OTP sent successfully to ${identifier}. Valid for 5 minutes.`
    };
  },

  verifyOTP: async (identifier, enteredOtp) => {
    const cleanId = identifier.trim().toLowerCase();
    const otps = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEYS.ACTIVE_OTPS) || '{}');
    const record = otps[cleanId];

    if (!record) {
      return { success: false, error: 'No active OTP found. Please request a new code.' };
    }

    if (new Date(record.expiresAt) < new Date()) {
      delete otps[cleanId];
      localStorage.setItem(AUTH_STORAGE_KEYS.ACTIVE_OTPS, JSON.stringify(otps));
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    if (record.otp !== enteredOtp.trim()) {
      return { success: false, error: 'Incorrect OTP. Please enter the valid 6-digit code.' };
    }

    // OTP verified: clear it
    delete otps[cleanId];
    localStorage.setItem(AUTH_STORAGE_KEYS.ACTIVE_OTPS, JSON.stringify(otps));
    return { success: true };
  },

  // 4. SIGN IN WITH MOBILE + OTP (Standard for rural government portals)
  signInWithOTP: async (identifier, enteredOtp) => {
    const verifyRes = await authService.verifyOTP(identifier, enteredOtp);
    if (!verifyRes.success) return verifyRes;

    const cleanId = identifier.trim().toLowerCase();
    const users = await authService.getUsers();
    let matched = users.find(u => u.email?.toLowerCase() === cleanId || u.mobile === cleanId);

    // If mobile user doesn't exist yet, auto-create basic citizen profile
    if (!matched) {
      const isMobile = /^[6-9]\d{9}$/.test(cleanId);
      const salt = cryptoService.generateSalt();
      const passwordHash = await cryptoService.hashPassword('otp_login', salt);

      matched = {
        id: `usr_${Date.now()}`,
        name: isMobile ? `Citizen (${cleanId.slice(-4)})` : cleanId.split('@')[0],
        email: isMobile ? '' : cleanId,
        mobile: isMobile ? cleanId : '',
        salt,
        passwordHash,
        state: 'Uttar Pradesh',
        district: 'Sitapur',
        role: 'Verified Rural Citizen',
        isDemo: false,
        createdAt: new Date().toISOString()
      };
      users.push(matched);
      authService.saveUsers(users);
    }

    const sessionToken = cryptoService.generateSessionToken();
    const safeUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      mobile: matched.mobile,
      state: matched.state,
      district: matched.district,
      role: matched.role || 'Rural Citizen',
      isDemo: matched.isDemo || false
    };

    authService.setSession(safeUser, sessionToken, true);
    return { success: true, user: safeUser };
  },

  // 5. RESET PASSWORD
  resetPassword: async ({ identifier, otp, newPassword }) => {
    const verifyRes = await authService.verifyOTP(identifier, otp);
    if (!verifyRes.success) return verifyRes;

    const cleanId = identifier.trim().toLowerCase();
    const users = await authService.getUsers();
    const userIndex = users.findIndex(u => u.email?.toLowerCase() === cleanId || u.mobile === cleanId);

    if (userIndex === -1) {
      return { success: false, error: 'No user registered with this email or mobile number.' };
    }

    const salt = cryptoService.generateSalt();
    const passwordHash = await cryptoService.hashPassword(newPassword, salt);

    users[userIndex].salt = salt;
    users[userIndex].passwordHash = passwordHash;
    authService.saveUsers(users);

    return { success: true, message: 'Password has been successfully updated. You may now Sign In.' };
  },

  // 6. CHANGE PASSWORD (for active logged-in user)
  changePassword: async (userId, oldPassword, newPassword) => {
    const users = await authService.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'User not found.' };

    const valid = await cryptoService.verifyPassword(oldPassword, user.salt, user.passwordHash);
    if (!valid) {
      return { success: false, error: 'Current password does not match.' };
    }

    const newSalt = cryptoService.generateSalt();
    const newHash = await cryptoService.hashPassword(newPassword, newSalt);

    user.salt = newSalt;
    user.passwordHash = newHash;
    authService.saveUsers(users);

    return { success: true, message: 'Password changed successfully.' };
  },

  // 7. SESSION MANAGEMENT
  setSession: (user, token, rememberMe = true) => {
    const expiresAt = new Date(
      Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
    ).toISOString();

    const sessionObj = {
      user,
      token,
      expiresAt,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(AUTH_STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    localStorage.setItem(AUTH_STORAGE_KEYS.SESSION_TOKEN, JSON.stringify(sessionObj));
  },

  getSession: () => {
    try {
      const tokenData = localStorage.getItem(AUTH_STORAGE_KEYS.SESSION_TOKEN);
      if (!tokenData) return null;

      const session = JSON.parse(tokenData);
      if (new Date(session.expiresAt) < new Date()) {
        authService.clearSession();
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  },

  clearSession: () => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACTIVE_USER);
    localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION_TOKEN);
  }
};
