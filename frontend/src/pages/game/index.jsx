//=============================================================================
// File: game/index.jsx
// Purpose: The main page of a single game
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Layout, Button, message, Typography, Divider } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { get, put } from "../../utils/request";
import { dashboardStyles as styles } from "../dashboard/dashboardStyle.js";
import { CreateGameModal } from "../dashboard/CreateGameModal";
import { QuestionCardList } from "./QuestionCardList.jsx";
import { CustomCard } from "./CustomCard.jsx";
import { CreateQuestionModal } from "./CreateQuestionModal.jsx";

export const GamePage = () => {
  const { Text } = Typography;
  const [currentGame, setCurrentGame] = useState({ questions: [] });
  const navigate = useNavigate();
  const editBtnRef = useRef(null);
  const addQuestionBtnRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);

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
      const games = await fetchGames();
      // get the current game
      const currentGame = games.find((game) => game.id === parseInt(game_id));
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

  // Edit game modal OK handler
  const handleEditGame = async (newGame) => {
    // If value is "", no change backend data
    console.log("==========new game return:", newGame);
    const updataedGame = {
      ...currentGame,
      id: currentGame.id,
      image: newGame.image === "" ? currentGame.image : newGame.image,
      title: newGame.title === "" ? currentGame.title : newGame.title,
      description:
        newGame.description === ""
          ? currentGame.description
          : newGame.description,
      updateTime: newGame.updateTime,
    };

    console.log("=======updated data is:", updataedGame);
    // Fetch all games
    const games = await fetchGames();
    // Replace modified data
    const filtered = games.filter((game) => game.id !== newGame.id);
    const updatedGames = [...filtered, updataedGame];
    const data = { games: updatedGames };
    try {
      // Put data to backend
      const result = await put("/admin/games", data);
      if (result) {
        message.success("Edit the game successfully");
        getCurrentGame();
      }
    } catch (err) {
      message.error(err.message);
    }
    // Close update game modal
    setModalVisible(false);
    editBtnRef.current?.blur();
  };

  const handleAddQuestion = async ({ title, type }) => {
    // Update questions of current game
    const newQuestion = {
      id: Date.now(),
      title: title,
      type: type,
      // A new page to add answers
      answers: [],
    };
    const newGame = {
      ...currentGame,
      questions: [...(currentGame.questions || []), newQuestion],
    };

    // Fetch all games
    const games = await fetchGames();
    // Replace modified data
    const filtered = games.filter((game) => game.id !== newGame.id);
    const updatedGames = [...filtered, newGame];

    const data = { games: updatedGames };
    try {
      const result = await put("/admin/games", data);
      if (result) {
        message.success("Add a question successfully");
        getCurrentGame();
      }
    } catch (err) {
      message.error(err.message);
    }
    setQuestionModalVisible(false);
    addQuestionBtnRef.current?.blur();
  };

  // Delete Game
  const handleDeleteQuestion = async (questionId) => {
    console.log("current question id is: ", questionId);
    const questions = currentGame.questions;
    const newQuestions = questions.filter(
      (question) => question.id !== questionId
    );
    const newGame = {
      ...currentGame,
      questions: newQuestions,
    };

    // Fetch all games
    const games = await fetchGames();
    // Replace modified data
    const filtered = games.filter((game) => game.id !== currentGame.id);
    const updatedGames = [...filtered, newGame];

    const data = { games: updatedGames };
    try {
      const result = await put("/admin/games", data);
      if (result) {
        message.success("Delete the question successfully");
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
        {/* Left: back to dashboard btn and game title*/}
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Back to Dashboard
        </Button>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1677ff",
            whiteSpace: "nowrap",
            wordBreak: "break-word",
            overflow: "hidden",
          }}
          ellipsis={{ tooltip: currentGame.title }}
        >
          {currentGame.title}
        </Text>

        {/* Right: edit game btn and create question btn */}
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
            ref={addQuestionBtnRef}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 16 }}
            onClick={() => setQuestionModalVisible(true)}
            onMouseDown={(e) => e.preventDefault()}
          >
            Create Question
          </Button>
        </div>
      </Layout.Header>

      {/* Main content */}
      <Layout.Content style={styles.content}>
        <Divider
          style={{
            margin: "0 0 16px",
            borderColor: "#e1e1e1",
            color: "#969696",
          }}
        >
          Game Information
        </Divider>
        <CustomCard style={{ width: "100vw" }} game={currentGame}></CustomCard>
        <Divider
          style={{
            margin: "0 0 16px",
            borderColor: "#e1e1e1",
            color: "#969696",
          }}
        >
          Game Questions
        </Divider>
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
        <CreateQuestionModal
          visible={questionModalVisible}
          onCreate={handleAddQuestion}
          onCancel={() => {
            setQuestionModalVisible(false);
            addQuestionBtnRef.current?.blur();
          }}
        />
      </Layout.Content>
    </Layout>
  );
};
