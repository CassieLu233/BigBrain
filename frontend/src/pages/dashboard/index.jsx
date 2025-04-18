//=============================================================================
// File: dashboard/index.jsx
// Purpose: Dashboard page with navbar, user menu, create-game modal, and game cards
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import { useEffect, useState } from "react";
import { Layout, Button, Avatar, Dropdown, message } from "antd";
import { PlusOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import logoImg from "../../assets/bigbrain.svg";
import { dashboardStyles as styles } from "./dashboardStyle.js";
import { CreateGameModal } from "./CreateGameModal.jsx";
import { GameCardList } from "./GameCardList.jsx";
import { put, get } from "../../utils/request.js";
import { isLogin } from "../../utils/auth.js";

export const Dashboard = () => {
  const navigate = useNavigate();
  // Game list status
  const [games, setGames] = useState([]);
  // Controls the display and hide of the "Create Game" pop-up window.
  const [modalVisible, setModalVisible] = useState(false);
  // AntD form instance, used to collect and verify "New Game" form data

  // Get the displayed username (local part of the email address) and avatar
  const currentUserEmail = window.localStorage.getItem("email") || "";
  const emailName = currentUserEmail.split("@")[0];
  const avatarLetter = emailName.charAt(0).toUpperCase();

  useEffect(() => {
    const loginStatus = isLogin();
    if (loginStatus) {
      fetchGames();
    } else {
      message.warning("No user login, redirect to login page!", 0.5, () => {
        navigate("/login");
      });
    }
  }, []);

  // Fetch games from backend
  const fetchGames = async () => {
    try {
      const data = await get("/admin/games");
      if (data && Array.isArray(data.games)) {
        setGames(data.games);
        console.log(data.games);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  // Logout handler
  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("email");
    message.success("Log Out successful! Go to Login Page");
    navigate("/login");
  };

  // Create-game modal OK handler
  const handleCreateGame = async (newGameData) => {
    console.log("new game data is:", newGameData);
    const data = { games: [...games, newGameData] };
    try {
      const result = await put("/admin/games", data);
      if (result) {
        message.success("Create a game successfully");
        fetchGames();
      }
    } catch (err) {
      message.error(err.message);
    }
    setModalVisible(false);
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
            type="primary"
            icon={<PlusOutlined />}
            style={styles.createGameButton}
            onClick={() => setModalVisible(true)}
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
        <GameCardList games={games} />
        <CreateGameModal
          visible={modalVisible}
          onCreate={handleCreateGame}
          onCancel={() => setModalVisible(false)}
        />
      </Layout.Content>
    </Layout>
  );
};
