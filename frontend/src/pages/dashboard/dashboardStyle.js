//=============================================================================
// File: dashboard/dashboardStyle.js
// Purpose: Styles for Dashboard page
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
export const dashboardStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#ffff00",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    background: "#fff",
    boxShadow: "0 2px 8px #f0f1f2",
  },
  content: {
    flex: 1,
    padding: 24,
    background: "#fafafa",
  },
  emptyContent: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  logoImage: {
    width: 40,
    height: 40,
    objectFit: "contain",
    marginRight: 8,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  actions: {
    display: "flex",
    alignItems: "center",
  },
  createGameButton: {
    marginRight: 16,
  },
  userContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  avatar: {
    backgroundColor: "#1677ff",
    verticalAlign: "middle",
    fontSize: 18,
  },
  username: {
    marginLeft: 8,
    fontSize: 18,
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#555",
    marginLeft: 4,
  },
  card: {
    width: 300,
  },
  logoutLabel: {
    color: "#000",
  },
  logoutHoverColor: "#1890ff",
};
