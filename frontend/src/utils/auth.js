//=============================================================================
// File: utils/auth.js
// Purpose: Processing functions related to authentication
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-17
// ==============================================================================

/**
 * Record the user's login status.
 * Returns: true(logged in) ; false(not logged in)
 */
export const isLogin = () => {
  return !!localStorage.getItem("token");
};
