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
 * - url: API backend path (e.g. "/admin/games")
 * Returns: Promise resolving to parsed JSON data;
 *           throws Error if the response contains an `error` field.
 */
export const get = async (url) => {
  const res = await fetch(`${BASE_HOST}${url}`, {
    ...defaultOptions,
    headers: {
      ...defaultOptions.headers,
      // inject token from localStorage
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

/**
 * Sends a POST request to the backend.
 * - url: API backend path (e.g. "/admin/auth/register")
 * Returns: Promise resolving to parsed JSON data;
 *           throws Error if the response contains an `error` field.
 */
export const post = async (url, data) => {
  const res = await fetch(`${BASE_HOST}${url}`, {
    ...defaultOptions,
    method: "POST",
    headers: {
      ...defaultOptions.headers,
      // inject token from localStorage
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (result.error) {
    throw new Error(result.error);
  }
  return result;
};

/**
 * Sends a PUT request to the backend.
 * - url: API backend path (e.g. "/admin/games")
 * Returns: Promise resolving to parsed JSON data;
 *           throws Error if the response contains an `error` field.
 */
export const put = async (url, data) => {
  const res = await fetch(`${BASE_HOST}${url}`, {
    ...defaultOptions,
    method: "PUT",
    headers: {
      ...defaultOptions.headers,
      // inject token from localStorage
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (result.error) {
    throw new Error(result.error);
  }
  return result;
};
