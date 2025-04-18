//=============================================================================
// File: registerStyle.js
// Purpose: Provide styles for register page
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
export const registerStyles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
  },
  card: {
    width: 360,
    textAlign: "center",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontSize: "20px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    cursor: "default",
  },
  logoImage: {
    width: 50,
    height: 50,
    objectFit: "contain",
  },
  logoTitle: {
    fontSize: 36,
    color: "#1677ff",
    marginLeft: 8,
    cursor: "default",
  },
  formItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: "20px",
  },
  input: {
    fontSize: "16px",
  },
  button: {
    fontSize: "16px",
  },
  loginWrapper: {
    display: "block",
    textAlign: "right",
    marginTop: 8,
  },
  loginTitle: {
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: 16,
    color: "#1890ff",
  },
};
