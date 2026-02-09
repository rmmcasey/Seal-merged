/**
 * Seal Receiver - Extension popup with authentication and .seal file viewer
 *
 * Screens: loading → login (if needed) → drop → info → error
 * Fixes: login in extension, user email display, safe file handling (no chrome.storage for payloads)
 */

(function () {
  'use strict';

  // --- State ---
  let currentSealFile = null;   // Parsed .seal metadata (without payload for display)
  let currentRawText = null;    // Raw file text kept in memory (never stored in chrome.storage)
  let userEmail = null;

  // --- DOM Elements ---
  const screens = {
    loading: document.getElementById('screen-loading'),
    login: document.getElementById('screen-login'),
    drop: document.getElementById('screen-drop'),
    info: document.getElementById('screen-info'),
    error: document.getElementById('screen-error')
  };

  const els = {
    // Login
    loginForm: document.getElementById('login-form'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    loginError: document.getElementById('login-error'),
    btnLoginSubmit: document.getElementById('btn-login-submit'),
    btnLoginWeb: document.getElementById('btn-login-web'),
    // Drop screen
    dropZone: document.getElementById('drop-zone'),
    fileInput: document.getElementById('file-input'),
    btnBrowse: document.getElementById('btn-browse'),
    userEmailDisplay: document.getElementById('user-email-display'),
    btnLogout: document.getElementById('btn-logout'),
    // Info screen
    infoFilename: document.getElementById('info-filename'),
    infoSize: document.getElementById('info-size'),
    infoDate: document.getElementById('info-date'),
    infoExpires: document.getElementById('info-expires'),
    infoRecipients: document.getElementById('info-recipients'),
    infoAccess: document.getElementById('info-access'),
    accessRow: document.getElementById('access-row'),
    btnOpenViewer: document.getElementById('btn-open-viewer'),
    btnBack: document.getElementById('btn-back'),
    // Error
    errorMessage: document.getElementById('error-message'),
    btnErrorBack: document.getElementById('btn-error-back')
  };

  // --- Screen Management ---
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  // --- Messaging to background ---
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response && response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response || {});
        }
      });
    });
  }

  // --- Initialization ---
  async function init() {
    showScreen('loading');

    try {
      const authResult = await sendMessage({ action: 'checkAuth' });
      if (authResult.authenticated && authResult.email) {
        userEmail = authResult.email;
        els.userEmailDisplay.textContent = authResult.email;
        showScreen('drop');
      } else {
        showScreen('login');
      }
    } catch (err) {
      console.warn('[Seal] Auth check failed:', err);
      showScreen('login');
    }

    setupEventListeners();
  }

  // --- Event Listeners ---
  function setupEventListeners() {
    // Login form
    els.loginForm.addEventListener('submit', handleLogin);
    els.btnLoginWeb.addEventListener('click', (e) => {
      e.preventDefault();
      sendMessage({ action: 'openLogin' });
    });

    // Logout
    els.btnLogout.addEventListener('click', handleLogout);

    // Drop zone events
    els.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      els.dropZone.classList.add('drag-over');
    });

    els.dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      els.dropZone.classList.remove('drag-over');
    });

    els.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      els.dropZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    });

    els.dropZone.addEventListener('click', (e) => {
      if (e.target.closest('#btn-browse') || e.target === els.dropZone || e.target.closest('.drop-zone-icon') || e.target.closest('h2') || e.target.closest('.drop-text')) {
        els.fileInput.click();
      }
    });
    els.btnBrowse.addEventListener('click', (e) => {
      e.stopPropagation();
      els.fileInput.click();
    });

    els.fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) handleFile(e.target.files[0]);
    });

    // Info screen buttons
    els.btnOpenViewer.addEventListener('click', openInViewer);
    els.btnBack.addEventListener('click', () => {
      currentSealFile = null;
      currentRawText = null;
      els.fileInput.value = '';
      showScreen('drop');
    });

    // Error screen
    els.btnErrorBack.addEventListener('click', () => {
      currentSealFile = null;
      currentRawText = null;
      els.fileInput.value = '';
      showScreen('drop');
    });
  }

  // --- Login ---
  async function handleLogin(e) {
    e.preventDefault();
    const email = els.loginEmail.value.trim();
    const password = els.loginPassword.value;

    els.loginError.hidden = true;
    els.btnLoginSubmit.disabled = true;
    els.btnLoginSubmit.textContent = 'Signing in...';

    try {
      // Call the auth/login endpoint directly from the background service worker
      const result = await sendMessage({
        action: 'loginWithCredentials',
        email,
        password
      });

      if (result.authenticated && result.email) {
        userEmail = result.email;
        els.userEmailDisplay.textContent = result.email;
        showScreen('drop');
      } else {
        els.loginError.textContent = result.error || 'Login failed. Check your email and password.';
        els.loginError.hidden = false;
      }
    } catch (err) {
      els.loginError.textContent = err.message || 'Login failed. Check your email and password.';
      els.loginError.hidden = false;
    } finally {
      els.btnLoginSubmit.disabled = false;
      els.btnLoginSubmit.textContent = 'Sign in';
    }
  }

  async function handleLogout() {
    try {
      await sendMessage({ action: 'logout' });
    } catch (err) {
      // Ignore
    }
    userEmail = null;
    currentSealFile = null;
    currentRawText = null;
    showScreen('login');
  }

  // --- File Handling ---
  async function handleFile(file) {
    // Validate file extension
    if (!file.name.endsWith('.seal')) {
      showError('Please select a .seal file. This file type is not supported.');
      return;
    }

    // Size guard: warn on files > 10MB (base64 inflates ~33%)
    if (file.size > 10 * 1024 * 1024) {
      showError('This file is too large to open in the extension. Please use seal.email/viewer instead.');
      return;
    }

    try {
      const text = await file.text();

      // Quick sanity check before full parse
      if (!text.startsWith('{')) {
        showError('This file is not a valid .seal file.');
        return;
      }

      const sealFile = JSON.parse(text);

      // Validate structure
      if (!sealFile.version || !sealFile.fileId || !sealFile.payload) {
        showError('This file is not a valid .seal file. It may be corrupted or incomplete.');
        return;
      }

      currentSealFile = sealFile;
      currentRawText = text;  // Keep in JS memory, NOT chrome.storage
      displayFileInfo(sealFile, file.size);

    } catch (err) {
      if (err instanceof SyntaxError) {
        showError('Could not read this file. It may be corrupted.');
      } else {
        showError('An unexpected error occurred: ' + err.message);
      }
    }
  }

  // --- Display File Info ---
  function displayFileInfo(sealFile, fileSize) {
    const meta = sealFile.metadata || {};

    els.infoFilename.textContent = meta.originalName || 'Unknown file';
    els.infoSize.textContent = formatFileSize(meta.originalSize || fileSize);

    // Encrypted date
    if (meta.encryptedAt) {
      els.infoDate.textContent = new Date(meta.encryptedAt).toLocaleDateString();
    } else {
      els.infoDate.textContent = 'Unknown';
    }

    // Expiration
    let isExpired = false;
    if (meta.expiresAt) {
      const expiresAt = new Date(meta.expiresAt);
      isExpired = expiresAt < new Date();
      if (isExpired) {
        els.infoExpires.innerHTML = '<span class="expired-badge">Expired</span>';
      } else {
        els.infoExpires.textContent = expiresAt.toLocaleDateString();
      }
    } else {
      els.infoExpires.textContent = 'Never';
    }

    // Recipients
    if (sealFile.recipients && sealFile.recipients.length > 0) {
      const emails = sealFile.recipients.map(r => r.email);
      els.infoRecipients.textContent = emails.length <= 2
        ? emails.join(', ')
        : `${emails[0]} +${emails.length - 1} more`;
      els.infoRecipients.title = emails.join(', ');
    } else {
      els.infoRecipients.textContent = 'Unknown';
    }

    // User access check
    let hasAccess = false;
    if (userEmail && sealFile.recipients) {
      hasAccess = sealFile.recipients.some(
        r => r.email.toLowerCase() === userEmail.toLowerCase()
      );
    }

    if (userEmail) {
      els.accessRow.hidden = false;
      if (hasAccess) {
        els.infoAccess.innerHTML = '<span class="access-granted">Authorized</span>';
      } else {
        els.infoAccess.innerHTML = '<span class="access-denied">Not a recipient</span>';
      }
    } else {
      els.accessRow.hidden = true;
    }

    // Button state
    if (isExpired) {
      els.btnOpenViewer.disabled = true;
      els.btnOpenViewer.textContent = 'File has expired';
    } else if (!hasAccess && userEmail) {
      els.btnOpenViewer.disabled = true;
      els.btnOpenViewer.textContent = 'You are not a recipient';
    } else {
      els.btnOpenViewer.disabled = false;
      els.btnOpenViewer.textContent = 'Open in Secure Viewer';
    }

    showScreen('info');
  }

  // --- Open in Viewer ---
  function openInViewer() {
    if (!currentSealFile) return;

    // Instead of storing the entire payload in chrome.storage (which crashes),
    // we download the .seal file so the user can upload it to the viewer.
    // This avoids the chrome.storage size limit entirely.
    const blob = new Blob([currentRawText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = (currentSealFile.metadata?.originalName || 'file') + '.seal';

    // Download the file so the user has it locally
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: false
    }, () => {
      // Open the viewer - user can upload the downloaded .seal file
      chrome.tabs.create({
        url: `https://seal.email/viewer`
      });
      URL.revokeObjectURL(url);
    });
  }

  // --- Error ---
  function showError(message) {
    els.errorMessage.textContent = message;
    showScreen('error');
  }

  // --- Helpers ---
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // --- Start ---
  init();
})();
