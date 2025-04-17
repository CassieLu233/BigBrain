//=============================================================================
// File: request.js
// Purpose: Processing functions related to backend API requests
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-17
// ==============================================================================
const BASE_HOST = "http://localhost:5005";

const defaultOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Sends a GET request to the backend.
 * - url: API endpoint path (e.g. "/users/1")
 * Returns: Promise resolving to parsed JSON data;
 *           throws Error if the response contains an `error` field.
 */
export const get = (url) => {
  return fetch(`${BASE_HOST}${url}`, {
    ...defaultOptions,
    headers: {
      ...defaultOptions.headers,
      // inject token from localStorage
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    });
};
