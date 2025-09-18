// ==============================================================================
// File: game/index.jsx
// Purpose: The main page of a single game (fully styled-components version)
// Created: 2025-04-18, Refactored: 2025-05-09
// ==============================================================================

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { message } from "antd";
import {
  PageContainer,
  PageHeader,
  PageContent,
  BackButton,
  StyledText,
  StyledDivider,
  EditButton,
  CreateButton as CreateQuestionButton,
} from "styles";
import {
  CreateGameModal,
  QuestionCardList,
  CustomCard,
  CreateQuestionModal,
} from "pages";
import {
  fetchGames,
  getCurrentGame,
  updateCurrentQuestion,
  updateGames,
} from "utils";

export const GamePage = () => {
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState({ questions: [] });
  const editBtnRef = useRef(null);
  const addQuestionBtnRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);

  const { gameId } = useParams();

  const initialGamePage = async () => {
    try {
      const currentGame = await getCurrentGame(gameId);
      if (currentGame) {
        setCurrentGame(currentGame);
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  useEffect(() => {
    initialGamePage();
  }, [gameId]);

  // Edit game modal OK handler
  const handleEditGame = async (newGameArr) => {
    // If value is "", no change backend data
    const newGame = newGameArr[0];
    const updatedGame = {
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

    // Fetch all games
    const games = await fetchGames();

    // Replace modified data
    const filtered = games.filter((game) => game.id !== newGame.id);
    const updatedGames = [...filtered, updatedGame];

    // Update games
    const result = await updateGames(updatedGames);
    if (result) {
      message.success("Edit the game successfully");
      const curGame = await getCurrentGame(gameId);
      setCurrentGame(curGame);
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
      duration: 10,
      points: 1,
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

    const result = await updateGames(updatedGames);
    if (result) {
      message.success("Add a question successfully");
      const curGame = await getCurrentGame(gameId);
      setCurrentGame(curGame);
    }
    setQuestionModalVisible(false);
    addQuestionBtnRef.current?.blur();
  };

  const handleEditQuestion = async (questionId) => {
    navigate(`/game/${gameId}/question/${questionId}`);
  };

  // Delete question
  const handleDeleteQuestion = async (questionId) => {
    try {
      const result = await updateCurrentQuestion(gameId, questionId, []);
      if (result) {
        message.success("Delete the question successfully");
        const curGame = await getCurrentGame(gameId);
        setCurrentGame(curGame);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <PageContainer>
      {/* Navbar */}
      <PageHeader>
        <BackButton onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </BackButton>
        <StyledText ellipsis={{ tooltip: currentGame.title }}>
          {currentGame.title}
        </StyledText>
        <div style={{ display: "flex", alignItems: "center" }}>
          <EditButton
            ref={editBtnRef}
            onClick={() => setModalVisible(true)}
            onMouseDown={(e) => e.preventDefault()}
          >
            Edit Game
          </EditButton>
          <CreateQuestionButton
            ref={addQuestionBtnRef}
            onClick={() => setQuestionModalVisible(true)}
            onMouseDown={(e) => e.preventDefault()}
          >
            Create Question
          </CreateQuestionButton>
        </div>
      </PageHeader>

      {/* Main content */}
      <PageContent>
        <StyledDivider>Game Information</StyledDivider>
        <CustomCard game={currentGame} />
        <StyledDivider>Game Questions</StyledDivider>
        <QuestionCardList
          questions={currentGame.questions}
          onDelete={handleDeleteQuestion}
          onEdit={handleEditQuestion}
        />
        <CreateGameModal
          title="Update Game Information"
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
      </PageContent>
    </PageContainer>
  );
};
