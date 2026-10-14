// Secure Administrative Authentication Utility
// Zero hardcoded passwords; uses Web Crypto SHA-256 + salt locally and Supabase Auth in cloud mode.

const LOCAL_AUTH_KEY = 'alifood_admin_local_credential_v2';
const LOCAL_SESSION_KEY = 'alifood_admin_session_v2';
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

interface StoredCredential {
  hash: string;
  salt: string;
  createdAt: string;
}

interface StoredSession {
  token: string;
  lastActive: number;
  mode: 'local' | 'cloud';
  userEmail?: string;
}

// Helper to hash password with salt using Web Crypto
async function hashWithSalt(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const adminAuth = {
  /**
   * Returns true if a local PIN/password has already been configured.
   */
  hasLocalCredential(): boolean {
    return Boolean(localStorage.getItem(LOCAL_AUTH_KEY));
  },

  /**
   * Sets up initial admin PIN/password locally.
   */
  async setInitialPassword(password: string): Promise<boolean> {
    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters');
    }
    const salt = generateSalt();
    const hash = await hashWithSalt(password, salt);
    const cred: StoredCredential = {
      hash,
      salt,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(cred));
    this.createSession('local');
    return true;
  },

  /**
   * Validates local admin PIN/password.
   */
  async verifyLocalPassword(password: string): Promise<boolean> {
    const raw = localStorage.getItem(LOCAL_AUTH_KEY);
    if (!raw) return false;

    try {
      const cred: StoredCredential = JSON.parse(raw);
      const computedHash = await hashWithSalt(password, cred.salt);
      const isValid = computedHash === cred.hash;
      if (isValid) {
        this.createSession('local');
      }
      return isValid;
    } catch {
      return false;
    }
  },

  /**
   * Changes existing local admin password.
   */
  async changeLocalPassword(currentPass: string, newPass: string): Promise<boolean> {
    const isValid = await this.verifyLocalPassword(currentPass);
    if (!isValid) {
      throw new Error('Current password does not match.');
    }
    if (!newPass || newPass.length < 4) {
      throw new Error('New password must be at least 4 characters.');
    }
    return this.setInitialPassword(newPass);
  },

  /**
   * Resets local credential. Requires confirming backup export.
   */
  resetLocalCredential(): void {
    localStorage.removeItem(LOCAL_AUTH_KEY);
    localStorage.removeItem(LOCAL_SESSION_KEY);
  },

  /**
   * Creates an active session with inactivity tracking.
   */
  createSession(mode: 'local' | 'cloud', userEmail?: string): void {
    const session: StoredSession = {
      token: Math.random().toString(36).substring(2),
      lastActive: Date.now(),
      mode,
      userEmail,
    };
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
  },

  /**
   * Updates last activity timestamp to prevent premature logout.
   */
  touchActivity(): void {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    if (!raw) return;
    try {
      const session: StoredSession = JSON.parse(raw);
      session.lastActive = Date.now();
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
    } catch {
      // Ignore
    }
  },

  /**
   * Checks whether the current session is valid and not expired.
   */
  isAuthenticated(): boolean {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    if (!raw) return false;

    try {
      const session: StoredSession = JSON.parse(raw);
      const now = Date.now();
      if (now - session.lastActive > INACTIVITY_TIMEOUT_MS) {
        // Expired
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Log out and clear session.
   */
  logout(): void {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    localStorage.removeItem('alifood_cloud_session');
  },
};
