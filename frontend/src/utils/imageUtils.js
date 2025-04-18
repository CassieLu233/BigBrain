//=============================================================================
// File: utils/imageUtils.js
// Purpose: Utility functions for converting between image Files and Base64 or displayable URLs
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-19
// ==============================================================================

/**
 * Converts an image File object to a Base64 data URL string.
 * Supports JPEG, PNG, JPG, SVG files.
 * @param {File} file - Image file to convert
 * @returns {Promise<string>} - Promise resolving to "data:image/...;base64,..." or "data:image/svg+xml;utf8,..."
 */
export const fileToDataUrl = (file) => {
  const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml"];
  if (!validTypes.includes(file.type)) {
    return Promise.reject(
      new Error("File type not supported. Must be JPEG, PNG, JPG, or SVG.")
    );
  }
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

/**
 * Converts a Base64 data URL or SVG text URL string into a Blob object.
 * @param {string} dataUrl - "data:image/...;base64,..." or "data:image/svg+xml;utf8,..."
 * @returns {Blob} - Blob representing the decoded image data
 */
export const dataUrlToBlob = (dataUrl) => {
  const [header, base64Data] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);base64/);
  if (!mimeMatch) {
    throw new Error("Invalid Base64 data URL");
  }
  const mime = mimeMatch[1];
  // atob to Base64
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buffer[i] = binaryString.charCodeAt(i);
  }
  return new Blob([buffer], { type: mime });
};

/**
 * Generates an object URL from a Blob, suitable for <img src={url}> display.
 * @param {Blob} blob - Blob object to create URL for
 * @returns {string} - Object URL (e.g. "blob:http://...")
 */
export const blobToObjectUrl = (blob) => URL.createObjectURL(blob);

/**
 * Convenience: Convert Base64 data URL or SVG text URL directly to object URL.
 * @param {string} dataUrl - Data URL string
 * @returns {string} - Object URL for display
 */
export const dataUrlToObjectUrl = (dataUrl) =>
  blobToObjectUrl(dataUrlToBlob(dataUrl));
