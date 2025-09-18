//=============================================================================
// File: utils/update.js
// Purpose: Processing functions related to update data to backend
// Created: 2025-04-21
// ==============================================================================
import { message } from "antd";
import { get, put } from "./request";

/**
 * Fetches all games from the backend.
 * @returns {Promise<Array<Object>>|undefined} - Resolves to an array of game objects, or undefined on error.
 */
export const fetchGames = async () => {
  try {
    const data = await get("/admin/games");
    if (data && Array.isArray(data.games)) {
      return data.games;
    }
  } catch (err) {
    message.error(err.message);
  }
};

/**
 * Retrieves a specific game by its ID.
 * @param {string|number} gameId - The ID of the game to retrieve.
 * @returns {Promise<Object>|undefined} - Resolves to the game object, or undefined if not found or on error.
 */
export const getCurrentGame = async (gameId) => {
  try {
    const games = await fetchGames();
    // get the current game
    const currentGame = games.find((game) => game.id === parseInt(gameId));
    if (currentGame) {
      return currentGame;
    } else {
      message.warning("Game not found");
    }
  } catch (err) {
    message.error(err.message);
  }
};

/**
 * Retrieves a specific question from a given game.
 * @param {string|number} gameId - The ID of the game containing the question.
 * @param {string|number} questionId - The ID of the question to retrieve.
 * @returns {Promise<Object>|undefined} - Resolves to the question object, or undefined if not found or on error.
 */
export const getCurrentQuestion = async (gameId, questionId) => {
  try {
    const currentGame = await getCurrentGame(gameId);
    const currentQuestion = currentGame.questions.find(
      (question) => question.id === parseInt(questionId)
    );
    if (currentQuestion) {
      return currentQuestion;
    } else {
      message.warning("Question not found");
    }
  } catch (err) {
    message.error(err.message);
  }
};

/**
 * Sends the updated games list to the backend.
 * @param {Array<Object>} updatedGames - The array of updated game objects.
 * @returns {Promise<boolean|undefined>} - Resolves to true if successful, or undefined on error.
 */
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

/**
 * Updates a single game's "active" status flag.
 * @param {string|number} gameId - The ID of the game to update.
 * @param {boolean} activeStatus - The new active status.
 * @returns {Promise<boolean|undefined>} - Resolves to true if successful, or undefined on error.
 */
export const updateGameActive = async (gameId, activeStatus) => {
  const games = await fetchGames();
  const filteredGames = games.filter((game) => game.id !== parseInt(gameId));

  // Update current game's avtive status
  const currentGame = await getCurrentGame(gameId);
  currentGame.active = activeStatus;

  const updatedGames = [...filteredGames, currentGame];

  // Put data to backend
  try {
    const result = await put("/admin/games", { games: updatedGames });
    if (result) {
      return true;
    } else {
      throw new Error("Update game active status failed");
    }
  } catch (err) {
    message.error(err.message);
  }
};

/**
 * Updates or deletes a specific question within a game on the backend.
 * @param {string|number} currentGameId - The ID of the game containing the question.
 * @param {string|number} currentQuestionId - The ID of the question to update or delete.
 * @param {Object|Array} updatedQuestion - The updated question object, or an empty array to delete the question.
 * @returns {Promise<boolean|undefined>} - Resolves to true if successful, or undefined on error.
 */
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
    (question) => question.id !== parseInt(currentQuestionId)
  );

  // if updatedQuestion is [], delete the question
  let updatedQuestions = [];
  if (updatedQuestion.length === 0) {
    updatedQuestions = filteredQuestions;
  } else {
    updatedQuestions = [...filteredQuestions, updatedQuestion];
  }

  // Update current game
  currentGame.questions = updatedQuestions;

  // Update games
  const filteredGames = games.filter(
    (game) => game.id !== parseInt(currentGameId)
  );
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
