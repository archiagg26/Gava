import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../services/authService';
import { cryptoService } from '../services/cryptoService';

// Lightweight localStorage polyfill for Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  let store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
}

describe('GharSetu Production Authentication Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('evaluates password strength accurately', () => {
    expect(cryptoService.evaluatePasswordStrength('').score).toBe(0);
    expect(cryptoService.evaluatePasswordStrength('123').score).toBe(1); // Weak
    expect(cryptoService.evaluatePasswordStrength('Pass123').score).toBe(2); // Moderate
    expect(cryptoService.evaluatePasswordStrength('PassWord123!').score).toBe(4); // Strong
  });

  it('verifies salted SHA-256 password hashing correctly', async () => {
    const salt = cryptoService.generateSalt();
    const hash = await cryptoService.hashPassword('Secret@123', salt);

    const isMatch = await cryptoService.verifyPassword('Secret@123', salt, hash);
    const isMismatch = await cryptoService.verifyPassword('WrongPass', salt, hash);

    expect(isMatch).toBe(true);
    expect(isMismatch).toBe(false);
  });

  it('initializes default seeded demo accounts with hashes', async () => {
    const users = await authService.getUsers();
    expect(users.length).toBeGreaterThanOrEqual(2);

    const ramkishan = users.find(u => u.email === 'demo@gharsetu.in');
    expect(ramkishan).toBeDefined();
    expect(ramkishan.passwordHash).toBeDefined();
    expect(ramkishan.salt).toBeDefined();

    // Verify demo password matches
    const valid = await cryptoService.verifyPassword('demo1234', ramkishan.salt, ramkishan.passwordHash);
    expect(valid).toBe(true);
  });

  it('signs in successfully with valid credentials and creates session', async () => {
    const res = await authService.signInWithPassword({
      identifier: 'demo@gharsetu.in',
      password: 'demo1234'
    });

    expect(res.success).toBe(true);
    expect(res.user.name).toBe('Ramkishan Yadav');

    const session = authService.getSession();
    expect(session).not.toBeNull();
    expect(session.user.id).toBe(res.user.id);
  });

  it('enforces lockout protection after repeated failed password attempts', async () => {
    const fakeId = 'attacker@example.com';

    // 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await authService.signInWithPassword({ identifier: fakeId, password: 'wrong' });
    }

    const lockoutCheck = authService.checkLockout(fakeId);
    expect(lockoutCheck.locked).toBe(true);
    expect(lockoutCheck.remainingSeconds).toBeGreaterThan(0);

    const attemptDuringLock = await authService.signInWithPassword({ identifier: fakeId, password: 'any' });
    expect(attemptDuringLock.success).toBe(false);
    expect(attemptDuringLock.locked).toBe(true);
  });

  it('generates, verifies, and expires OTP codes', async () => {
    const mobile = '9876543210';
    const otpRes = await authService.requestOTP(mobile);

    expect(otpRes.success).toBe(true);
    expect(otpRes.otp.length).toBe(6);

    // Incorrect code fails
    const failVerify = await authService.verifyOTP(mobile, '000000');
    expect(failVerify.success).toBe(false);

    // Correct code succeeds
    const successVerify = await authService.verifyOTP(mobile, otpRes.otp);
    expect(successVerify.success).toBe(true);

    // Reusing consumed OTP fails
    const secondVerify = await authService.verifyOTP(mobile, otpRes.otp);
    expect(secondVerify.success).toBe(false);
  });

  it('allows mobile OTP login directly without password', async () => {
    const mobile = '9876543210';
    const otpRes = await authService.requestOTP(mobile);

    const loginRes = await authService.signInWithOTP(mobile, otpRes.otp);
    expect(loginRes.success).toBe(true);
    expect(loginRes.user.mobile).toBe(mobile);

    const session = authService.getSession();
    expect(session.user.mobile).toBe(mobile);
  });

  it('successfully resets password using verified OTP', async () => {
    const email = 'demo@gharsetu.in';
    const otpRes = await authService.requestOTP(email);

    const resetRes = await authService.resetPassword({
      identifier: email,
      otp: otpRes.otp,
      newPassword: 'newSecurePassword99!'
    });

    expect(resetRes.success).toBe(true);

    // Old password should now fail
    const oldLogin = await authService.signInWithPassword({ identifier: email, password: 'demo1234' });
    expect(oldLogin.success).toBe(false);

    // New password should succeed
    const newLogin = await authService.signInWithPassword({ identifier: email, password: 'newSecurePassword99!' });
    expect(newLogin.success).toBe(true);
  });

  it('registers user through full mobile OTP verification flow', async () => {
    const mobile = '9811223344';
    // 1. Request OTP
    const otpRes = await authService.requestOTP(mobile);
    expect(otpRes.success).toBe(true);

    // 2. Verify OTP
    const verifyRes = await authService.verifyOTP(mobile, otpRes.otp);
    expect(verifyRes.success).toBe(true);

    // 3. Register citizen account
    const signupRes = await authService.signUp({
      name: 'Sunita Devi',
      mobile,
      password: 'SecurePass123!',
      district: 'Sitapur',
      state: 'Uttar Pradesh',
      isWomanHead: true
    });

    expect(signupRes.success).toBe(true);
    expect(signupRes.user.name).toBe('Sunita Devi');
    expect(signupRes.user.mobile).toBe(mobile);
  });
});
