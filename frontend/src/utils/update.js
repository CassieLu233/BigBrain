//=============================================================================
// File: update.js
// Purpose: Processing functions related to update data to backend
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-17
// ==============================================================================
import { message } from "antd";
import { get, put } from "./request";

// Fetch games from backend
export const fetchGames = async () => {
  try {
    const data = await get("/admin/games");
    if (data && Array.isArray(data.games)) {
      console.log("games are:", data.games);
      return data.games;
    }
  } catch (err) {
    message.error(err.message);
  }
};

export const getCurrentGame = async (gameId) => {
  try {
    const games = await fetchGames();
    // get the current game
    const currentGame = games.find((game) => game.id === parseInt(gameId));
    if (currentGame) {
      console.log("current game is:", currentGame);
      return currentGame;
    } else {
      message.warning("Game not found");
    }
  } catch (err) {
    message.error(err.message);
  }
};

export const getCurrentQuestion = async (gameId, questionId) => {
  try {
    const currentGame = await getCurrentGame(gameId);
    const currentQuestion = currentGame.questions.find(
      (question) => question.id === parseInt(questionId)
    );
    if (currentQuestion) {
      console.log("current question is:", currentQuestion);
      return currentQuestion;
    } else {
      message.warning("Question not found");
    }
  } catch (err) {
    message.error(err.message);
  }
};

export const updateGames = async (updatedGames) => {
  try {
    const result = await put("/admin/games", { games: updatedGames });
    if (result) {
      return true;
    } else {
      throw new Error("Update games failed");
    }
  } catch (err) {
    message.error(err.message);
  }
};

export const updateCurrentQuestion = async (
  currentGameId,
  currentQuestionId,
  updatedQuestion
) => {
  // Replace in game
  const games = await fetchGames();
  const currentGame = await getCurrentGame(currentGameId);

  // Update questions
  const filteredQuestions = currentGame.questions.filter(
    (question) => question.id !== currentQuestionId
  );
  let updatedQuestions = [];
  if (updatedQuestion.length === 0) {
    updatedQuestions = filteredQuestions;
  } else {
    updatedQuestions = [...filteredQuestions, updatedQuestion];
  }

  // Update current game
  currentGame.questions = updatedQuestions;

  // Update games
  const filteredGames = games.filter((game) => game.id !== currentGameId);
  const updatedGames = [...filteredGames, currentGame];

  // Put data to backend
  try {
    const result = await put("/admin/games", { games: updatedGames });
    if (result) {
      return true;
    } else {
      throw new Error("Update questions failed");
    }
  } catch (err) {
    message.error(err.message);
  }
};
