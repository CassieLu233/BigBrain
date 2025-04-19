//=============================================================================
// File: game/index.jsx
// Purpose: The main page of a single game
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Layout, Button, message, Typography } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { get, put } from "../../utils/request";
import { dashboardStyles as styles } from "../dashboard/dashboardStyle.js";
import { CreateGameModal } from "../dashboard/CreateGameModal";
import { QuestionCardList } from "./QuestionCardList.jsx";

export const GamePage = () => {
  const { Text } = Typography;
  const [currentGame, setCurrentGame] = useState([]);
  const navigate = useNavigate();
  const editBtnRef = useRef(null);
  // Controls the display and hide of the "Create Game" pop-up window.
  const [modalVisible, setModalVisible] = useState(false);

  const { game_id } = useParams();

  // Fetch games from backend
  const fetchGames = async () => {
    try {
      const data = await get("/admin/games");
      if (data && Array.isArray(data.games)) {
        console.log("data.games are:", data.games);
        return data.games;
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const getCurrentGame = async () => {
    try {
      const allGames = await fetchGames();
      // get the current game
      const currentGame = allGames.find(
        (game) => game.id === parseInt(game_id)
      );
      if (currentGame) {
        console.log("current game data are:", currentGame);
        setCurrentGame(currentGame);
      } else {
        message.warning("Game not found");
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  useEffect(() => {
    getCurrentGame();
  }, [game_id]);

  // Create-game modal OK handler
  const handleEditGame = async (newGames) => {
    // if value is "", no change backend data
    if (newGames.image === "") {
      newGames.image = currentGame.image;
    }
    if (newGames.title === "") {
      newGames.title = currentGame.title;
    }
    if (newGames.description === "") {
      newGames.description = currentGame.description;
    }
    newGames.id = currentGame.id;
    const games = await fetchGames();
    const data = { games: [...games, newGames] };
    try {
      const result = await put("/admin/games", data);
      if (result) {
        message.success("Edit the game successfully");
        getCurrentGame();
      }
    } catch (err) {
      message.error(err.message);
    }
    setModalVisible(false);
    editBtnRef.current?.blur();
  };

  // Delete Game
  const handleDeleteQuestion = async (gameId) => {
    console.log("current game id is: ", gameId);
    const games = await fetchGames();
    const newGames = games.filter((game) => game.id !== gameId);
    const data = { games: newGames };
    try {
      const result = await put("/admin/games", data);
      if (result) {
        message.success("Delete the game successfully");
        getCurrentGame();
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <Layout style={styles.container}>
      {/* Navbar */}
      <Layout.Header style={styles.header}>
        {/* Left */}
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Back to Dashboard
        </Button>
        <Text style={{ fontSize: 24, fontWeight: 700, color: "#1677ff" }}>
          {currentGame.title}
        </Text>

        {/* Right: create button + user avatar/name + dropdown */}
        <div style={styles.actions}>
          <Button
            ref={editBtnRef}
            type="default"
            icon={<EditOutlined />}
            style={{
              color: "#1677ff",
              borderColor: "#1677ff",
              marginRight: 16,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#b9d6ff")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ffffff")
            }
            onClick={() => setModalVisible(true)}
            onMouseDown={(e) => e.preventDefault()}
          >
            Edit Game
          </Button>
          <Button
            ref={editBtnRef}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 16 }}
            onClick={() => setModalVisible(true)}
            onMouseDown={(e) => e.preventDefault()}
          >
            Create Question
          </Button>
        </div>
      </Layout.Header>

      {/* Main content */}
      <Layout.Content style={styles.content}>
        <QuestionCardList
          questions={currentGame.questions}
          onDelete={handleDeleteQuestion}
        />
        <CreateGameModal
          title={`Update Game Information`}
          visible={modalVisible}
          onCreate={handleEditGame}
          onCancel={() => {
            setModalVisible(false);
            editBtnRef.current?.blur();
          }}
        />
      </Layout.Content>
    </Layout>
  );
};
