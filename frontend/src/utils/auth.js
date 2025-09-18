//=============================================================================
// File: utils/auth.js
// Purpose: Processing functions related to authentication
// ==============================================================================

/**
 * Record the user's login status.
 * Returns: true(logged in) ; false(not logged in)
 */
export const isLogin = () => {
  return !!localStorage.getItem("token");
};
