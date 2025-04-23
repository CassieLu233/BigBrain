//=============================================================================
// File: dashboard/index.jsx
// Purpose: Dashboard page with navbar, user menu, create-game modal, and game cards
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import { useEffect, useState, useRef } from "react";
import { Layout, Button, Avatar, Dropdown, message } from "antd";
import { PlusOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import logoImg from "../../assets/bigbrain.svg";
import { dashboardStyles as styles } from "./dashboardStyle.js";
import { CreateGameModal } from "./CreateGameModal.jsx";
import { GameCardList } from "./GameCardList.jsx";
import { isLogin } from "../../utils/auth.js";
import { fileToDataUrl } from "../../utils/imageUtils.js";
import {
  fetchGames,
  updateGameActive,
  updateGames,
} from "../../utils/update.js";
import { post } from "../../utils/request.js";
import { CreateSessionModal } from "../session/CreateSessionModal.jsx";
import { EndSessionModal } from "../session/EndSessionModal.jsx";

export const Dashboard = () => {
  const navigate = useNavigate();
  const createBtnRef = useRef(null);
  const [games, setGames] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState("");
  // Controls the display and hide of the "Create Game" pop-up window.
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [endSessionModalVisible, setEndSessionModalVisible] = useState(false);
  // Get the displayed username (local part of the email address) and avatar
  const currentUserEmail = window.localStorage.getItem("email") || "";
  const emailName = currentUserEmail.split("@")[0];
  const avatarLetter = emailName.charAt(0).toUpperCase();

  const initialdashBoard = async () => {
    const loginStatus = isLogin();
    if (loginStatus) {
      const games = await fetchGames();
      setGames(games);
    } else {
      message.warning("No user login, redirect to login page!", 0.5, () => {
        navigate("/login");
      });
    }
  };

  // Logout handler
  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("sessionId");
    window.localStorage.removeItem("sessionStatus");
    window.localStorage.removeItem("startedSessionGameId");
    message.success("Log Out successful! Go to Login Page");
    navigate("/login");
  };

  // Create-game modal OK handler
  const handleCreateGame = async (newGame) => {
    // If user does not upload image, get a default image
    if (newGame.image === "") {
      const defaultFile = logoImg;
      const response = await fetch(defaultFile);
      const svgBlob = await response.blob();
      const defaultFileBase64 = await fileToDataUrl(svgBlob);
      newGame.image = defaultFileBase64;
    }
    if (newGame.description === "") {
      newGame.description = "No Description";
    }
    const newGames = [...games, newGame];
    try {
      const result = await updateGames(newGames);
      if (result) {
        message.success("Create a game successfully");
        const games = await fetchGames();
        setGames(games);
      }
    } catch (err) {
      message.error(err.message);
    }
    setModalVisible(false);
    createBtnRef.current?.blur();
  };

  // Start a game handler
  const handleStartGame = async (gameId) => {
    console.log("current game id is:", gameId);
    try {
      // Get the session from backend
      const response = await post(`/admin/game/${gameId}/mutate`, {
        mutationType: "START",
      });

      // If start game sucessfully, popup game session
      const data = response.data;
      if (data.status === "started" && data.sessionId) {
        // Refresh game page
        const result = await updateGameActive(gameId, true);
        if (result) {
          const games = await fetchGames();
          setGames(games);
        }

        message.success("The game session has started");
        setCurrentSessionId(data.sessionId);
        window.localStorage.setItem("sessionId", data.sessionId);
        window.localStorage.setItem("sessionStatus", data.status);
        window.localStorage.setItem("startedSessionGameId", gameId);
        setSessionModalVisible(true);
        console.log("==========start session data is:", data);
      } else {
        message.error("Failed to start the game");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  // Copy game link to clipboard
  const copyGameLink = async () => {
    if (!currentSessionId) return;
    const link = `${window.location.origin}/play/${currentSessionId}`;
    try {
      const result = await navigator.clipboard.writeText(link);
      if (result) {
        message.success("Game link has been copied to the clipboard");
      }
    } catch (err) {
      message.error("Copy failed: " + err.message);
    }
  };

  // End a game handler
  const handleEndGame = async (gameId) => {
    try {
      const response = await post(`/admin/game/${gameId}/mutate`, {
        mutationType: "END",
      });
      const data = response.data;

      // Refresh game page
      const result = await updateGameActive(gameId, false);
      if (result) {
        const games = await fetchGames();
        setGames(games);
      }
      console.log("==========end session data is:", data);
      if (data?.status === "ended") {
        setEndSessionModalVisible(true);
        window.localStorage.setItem("sessionStatus", data.status);
      } else {
        message.error("Failed to stop the game session");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleViewResult = async () => {
    const sessionId = window.localStorage.getItem("sessionId");
    const startedSessionGameId = window.localStorage.getItem(
      "startedSessionGameId"
    );
    navigate(`/session/${sessionId}?gameId=${startedSessionGameId}`);
  };

  const handleClickManagementSession = async (gameId) => {
    const sessionId = window.localStorage.getItem("sessionId");
    navigate(`/session/${sessionId}?gameId=${gameId}`);
  };

  // Delete Game
  const handleDeleteGame = async (gameId) => {
    console.log("current game id is: ", gameId);
    const newGames = games.filter((game) => game.id !== gameId);
    try {
      const result = await updateGames(newGames);
      if (result) {
        message.success("Delete the game successfully");
        const games = await fetchGames();
        setGames(games);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  // Dropdown menu for user
  const userMenuItems = [
    {
      key: "logout",
      label: (
        <div
          style={styles.logoutLabel}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = styles.logoutHoverColor)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = styles.logoutLabel.color)
          }
        >
          <LogoutOutlined style={{ marginRight: 8, color: "inherit" }} />
          Log Out
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    initialdashBoard();
  }, []);

  return (
    <Layout style={styles.container}>
      {/* Navbar */}
      <Layout.Header style={styles.header}>
        {/* Left: logo + title */}
        <div style={styles.logo}>
          <img src={logoImg} alt="Logo Img" style={styles.logoImage} />
          <span style={styles.logoTitle}>BigBrain</span>
        </div>

        {/* Right: create button + user avatar/name + dropdown */}
        <div style={styles.actions}>
          <Button
            ref={createBtnRef}
            type="primary"
            icon={<PlusOutlined />}
            style={styles.createGameButton}
            onClick={() => setModalVisible(true)}
            onMouseDown={(e) => e.preventDefault()}
          >
            Create Game
          </Button>

          <Dropdown
            menu={{
              items: userMenuItems,
              selectable: false,
            }}
            trigger={["click"]}
            dropdownMatchSelectWidth={true}
          >
            <div style={styles.userContainer}>
              <Avatar style={styles.avatar}>{avatarLetter || "A"}</Avatar>
              <span style={styles.username}>{emailName || "Admin"}</span>
              <DownOutlined style={styles.dropdownIcon} />
            </div>
          </Dropdown>
        </div>
      </Layout.Header>

      {/* Main content */}
      <Layout.Content style={styles.content}>
        <GameCardList
          games={games}
          onDelete={handleDeleteGame}
          onStart={handleStartGame}
          onEnd={handleEndGame}
          onClickManagementSession={handleClickManagementSession}
        />
        <CreateGameModal
          visible={modalVisible}
          onCreate={handleCreateGame}
          onCancel={() => {
            setModalVisible(false);
            createBtnRef.current?.blur();
          }}
        />
        <CreateSessionModal
          visible={sessionModalVisible}
          sessionId={currentSessionId}
          onCancel={() => setSessionModalVisible(false)}
          onClick={copyGameLink}
          destroyOnClose
        />
        <EndSessionModal
          visible={endSessionModalVisible}
          onCancel={() => setEndSessionModalVisible(false)}
          onClick={handleViewResult}
        />
      </Layout.Content>
    </Layout>
  );
};
