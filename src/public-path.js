// src/public-path.js (in every MFE project)
if (window.__remotes__) {
  // If the host app defined a public path, use it.
  // This ensures the MFE loads its chunks from its own production domain.
  __webpack_public_path__ = window.__remotes__[process.env.MFE_NAME];
} else if (process.env.NODE_ENV === 'production') {
  // Fallback for standalone MFE access in production
  __webpack_public_path__ = '/';
}