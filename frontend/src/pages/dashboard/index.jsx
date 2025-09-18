// ==============================================================================
// File: dashboard/index.jsx
// Purpose: Dashboard page with styled-components
// Created: 2025-04-18, Refactored: 2025-05-09
// ==============================================================================

import { message } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import logoImg from "../../assets/bigbrain.svg";

import {
  PageContainer,
  PageHeader,
  PageContent,
  LogoWrapper,
  LogoImg,
  LogoText,
  ActionWrapper,
  CreateButton,
  StyledDropdown,
  LogoutLabel,
  LogoutIcon,
  UserInfoContainer,
  StyledAvatar,
  StyledUsername,
  StyledDropdownIcon,
} from "styles";

import {
  CreateGameModal,
  GameCardList,
  CreateSessionModal,
  EndSessionModal,
} from "pages";

import {
  fetchGames,
  isLogin,
  post,
  fileToDataUrl,
  updateGameActive,
  updateGames,
} from "utils";

export const Dashboard = () => {
  const navigate = useNavigate();
  const createBtnRef = useRef(null);
  const [games, setGames] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [endSessionModalVisible, setEndSessionModalVisible] = useState(false);

  const currentUserEmail = localStorage.getItem("email") || "";
  const emailName = currentUserEmail.split("@")[0];
  const avatarLetter = emailName.charAt(0).toUpperCase();

  useEffect(() => {
    const init = async () => {
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
    init();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    message.success("Log Out successful! Go to Login Page");
    navigate("/login");
  };

  const handleCreateGame = async (newGameArr) => {
    const gamesWithCover = await Promise.all(
      newGameArr.map(async (game) => {
        if (!game.image) {
          const resp = await fetch(logoImg);
          const blob = await resp.blob();
          game.image = await fileToDataUrl(blob);
        }
        if (!game.description) {
          game.description = "No Description";
        }
        return game;
      })
    );

    const newGames = [...games, ...gamesWithCover];
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

  const handleStartGame = async (gameId) => {
    try {
      const response = await post(`/admin/game/${gameId}/mutate`, {
        mutationType: "START",
      });
      const data = response.data;
      if (data.status === "started" && data.sessionId) {
        await updateGameActive(gameId, true);
        const games = await fetchGames();
        setGames(games);
        message.success("The game session has started");
        setCurrentSessionId(data.sessionId);
        localStorage.setItem("sessionId", data.sessionId);
        localStorage.setItem("sessionStatus", data.status);
        localStorage.setItem("startedSessionGameId", gameId);
        setSessionModalVisible(true);
      } else {
        message.error("Failed to start the game");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleEndGame = async (gameId) => {
    try {
      const response = await post(`/admin/game/${gameId}/mutate`, {
        mutationType: "END",
      });
      const data = response.data;
      await updateGameActive(gameId, false);
      const games = await fetchGames();
      setGames(games);
      if (data?.status === "ended") {
        setEndSessionModalVisible(true);
        localStorage.setItem("sessionStatus", data.status);
        localStorage.setItem("endSessionTime", Date.now().toString());
      } else {
        message.error("Failed to stop the game session");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleViewResult = () => {
    const sessionId = localStorage.getItem("sessionId");
    const startedSessionGameId = localStorage.getItem("startedSessionGameId");
    navigate(`/session/${sessionId}?gameId=${startedSessionGameId}`);
  };

  const handleClickManagementSession = (gameId) => {
    const sessionId = localStorage.getItem("sessionId");
    navigate(`/session/${sessionId}?gameId=${gameId}`);
  };

  const handleDeleteGame = async (gameId) => {
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

  const userMenuItems = [
    {
      key: "logout",
      label: (
        <LogoutLabel onClick={handleLogout}>
          <LogoutIcon />
          Log Out
        </LogoutLabel>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <LogoWrapper>
          <LogoImg src={logoImg} alt="Logo Img" />
          <LogoText>BigBrain</LogoText>
        </LogoWrapper>

        <ActionWrapper>
          <CreateButton
            data-cy="createGameBtn"
            ref={createBtnRef}
            onClick={() => setModalVisible(true)}
            onMouseDown={(e) => e.preventDefault()}
          >
            Create Game
          </CreateButton>

          <StyledDropdown menu={{ items: userMenuItems }}>
            <UserInfoContainer>
              <StyledAvatar data-cy="userAvatar">
                {avatarLetter || "A"}
              </StyledAvatar>
              <StyledUsername>{emailName || "Admin"}</StyledUsername>
              <StyledDropdownIcon />
            </UserInfoContainer>
          </StyledDropdown>
        </ActionWrapper>
      </PageHeader>

      <PageContent>
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
          destroyOnClose
        />
        <EndSessionModal
          visible={endSessionModalVisible}
          onCancel={() => setEndSessionModalVisible(false)}
          onClick={handleViewResult}
        />
      </PageContent>
    </PageContainer>
  );
};
