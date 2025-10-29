// src/index.js (NEW FILE - in every MFE project)

// --- A. Public Path Setup ---
// This code must execute BEFORE the dynamic import
if (window.__remotes__) {
  // If the host app defined a public path (from the HTML injection), use it.
  __webpack_public_path__ = window.__remotes__['creditCardMFE1']; 
} else if (process.env.NODE_ENV === 'production') {
  // Fallback for standalone MFE access in production
  __webpack_public_path__ = '/';
}
// --- End Public Path Setup ---


// --- B. Dynamic Import ---
// We use dynamic import to ensure the public path is set before the main code loads.
// Note: This must match the new name of your old entry file.
import('./bootstrap');