/**
 * Seal Background Service Worker
 *
 * Handles:
 * - API calls to seal.email (auth, keys, metadata)
 * - Message routing between popup and content script
 * - Token-based authentication with the Seal API
 * - External message relay from seal.email for auth handoff
 */

const API_BASE = 'https://seal.email/api';

// --- Auth Token Management ---

/**
 * Get stored auth credentials from chrome.storage.local
 */
async function getStoredAuth() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['authToken', 'userEmail'], (data) => {
      resolve(data || {});
    });
  });
}

/**
 * Store auth credentials
 */
async function storeAuth(token, email) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ authToken: token, userEmail: email }, resolve);
  });
}

/**
 * Clear stored auth credentials
 */
async function clearAuth() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(['authToken', 'userEmail'], resolve);
  });
}

/**
 * Build fetch headers with auth token
 */
async function authHeaders() {
  const { authToken } = await getStoredAuth();
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

// --- API Functions ---

/**
 * Check if user is authenticated with Seal
 */
async function checkAuth() {
  try {
    const headers = await authHeaders();
    const response = await fetch(`${API_BASE}/auth/status`, {
      headers,
      credentials: 'include'
    });
    if (!response.ok) {
      await clearAuth();
      return { authenticated: false };
    }
    const data = await response.json();

    // If authenticated, ensure we have the email cached
    if (data.authenticated && data.email) {
      const stored = await getStoredAuth();
      if (stored.userEmail !== data.email) {
        await storeAuth(stored.authToken || '', data.email);
      }
    } else {
      await clearAuth();
    }

    return data;
  } catch (err) {
    console.error('[Seal] Auth check failed:', err);
    return { authenticated: false, error: err.message };
  }
}

/**
 * Fetch a recipient's public key
 */
async function fetchPublicKey(email) {
  try {
    const headers = await authHeaders();
    const response = await fetch(
      `${API_BASE}/users/public-key/${encodeURIComponent(email)}`,
      { headers, credentials: 'include' }
    );
    if (!response.ok) {
      if (response.status === 404) {
        return { found: false, email };
      }
      throw new Error(`Failed to fetch key for ${email}`);
    }
    const data = await response.json();
    return { found: true, email, publicKey: data.publicKey };
  } catch (err) {
    console.error(`[Seal] Key fetch failed for ${email}:`, err);
    return { found: false, email, error: err.message };
  }
}

/**
 * Save file metadata to Seal API
 */
async function saveFileMetadata(fileId, filename, recipientEmails, expiresAt, senderEmail) {
  try {
    const headers = await authHeaders();
    const response = await fetch(`${API_BASE}/files`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({
        fileId,
        filename,
        recipientEmails,
        expiresAt,
        senderEmail
      })
    });
    if (!response.ok) throw new Error('Failed to save file metadata');
    return await response.json();
  } catch (err) {
    console.error('[Seal] Metadata save failed:', err);
    throw err;
  }
}

// --- Internal Message Handlers (from popup / content script) ---

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handler = messageHandlers[request.action];
  if (handler) {
    handler(request, sender)
      .then(sendResponse)
      .catch(err => sendResponse({ error: err.message }));
    return true; // Keep message channel open for async response
  }
});

const messageHandlers = {
  /**
   * Check authentication status
   */
  async checkAuth() {
    return await checkAuth();
  },

  /**
   * Fetch public keys for multiple recipients
   */
  async fetchRecipientKeys(request) {
    const { emails } = request;
    const results = await Promise.all(emails.map(fetchPublicKey));
    return { recipients: results };
  },

  /**
   * Save encrypted file metadata
   */
  async saveMetadata(request) {
    const { fileId, filename, recipientEmails, expiresAt, senderEmail } = request;
    return await saveFileMetadata(fileId, filename, recipientEmails, expiresAt, senderEmail);
  },

  /**
   * Forward attach message to content script
   */
  async attachToGmail(request) {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
      url: 'https://mail.google.com/*'
    });

    if (tabs.length === 0) {
      throw new Error('No Gmail tab found');
    }

    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'attachSealFile',
        sealFile: request.sealFile,
        filename: request.filename
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  },

  /**
   * Open Seal login page with extension redirect hint
   */
  async openLogin() {
    await chrome.tabs.create({ url: 'https://seal.email/login?from=extension' });
    return { success: true };
  },

  /**
   * Get stored user email (for popup display without an API call)
   */
  async getStoredEmail() {
    const { userEmail } = await getStoredAuth();
    return { email: userEmail || null };
  },

  /**
   * Login with email/password directly from the extension.
   * Calls the /api/auth/login endpoint and stores the token.
   */
  async loginWithCredentials(request) {
    const { email, password } = request;
    if (!email || !password) {
      return { authenticated: false, error: 'Email and password are required' };
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.authenticated) {
        return { authenticated: false, error: data.error || 'Login failed' };
      }

      // Store the token and email
      await storeAuth(data.token, data.email);

      return {
        authenticated: true,
        email: data.email
      };
    } catch (err) {
      console.error('[Seal] Extension login failed:', err);
      return { authenticated: false, error: err.message };
    }
  },

  /**
   * Logout: clear stored credentials
   */
  async logout() {
    await clearAuth();
    return { success: true };
  }
};

// --- External Message Handler (from seal.email website) ---

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  // Only accept messages from seal.email or localhost (development)
  const allowedOrigins = ['https://seal.email', 'http://localhost:3000'];
  const senderOrigin = sender.url ? new URL(sender.url).origin : '';

  if (!allowedOrigins.includes(senderOrigin)) {
    console.warn('[Seal] Rejected external message from:', senderOrigin);
    sendResponse({ error: 'Unauthorized origin' });
    return;
  }

  if (message.type === 'SEAL_AUTH_TOKEN') {
    // Website sends auth token after successful login
    const { token, email } = message;
    if (token && email) {
      storeAuth(token, email)
        .then(() => {
          console.log('[Seal] Auth token received for:', email);
          sendResponse({ success: true });
        })
        .catch(err => sendResponse({ error: err.message }));
    } else {
      sendResponse({ error: 'Missing token or email' });
    }
    return true; // async response
  }

  if (message.type === 'SEAL_LOGOUT') {
    clearAuth()
      .then(() => {
        console.log('[Seal] Auth cleared via website logout');
        sendResponse({ success: true });
      })
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }

  if (message.type === 'SEAL_PING') {
    // Health check — website can verify extension is installed
    sendResponse({ installed: true, version: chrome.runtime.getManifest().version });
    return;
  }

  sendResponse({ error: 'Unknown message type' });
});

// --- Extension Lifecycle ---

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Seal] Extension installed');
  } else if (details.reason === 'update') {
    console.log('[Seal] Extension updated to', chrome.runtime.getManifest().version);
  }
});
