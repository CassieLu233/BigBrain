// ==============================================================================
// File: game/GameCard.jsx
// Purpose: Component for rendering a single game card
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18, Refactored: 2025-05-09
// ==============================================================================

import { Popconfirm, Tooltip } from "antd";
import { useNavigate } from "react-router";

import {
  GameCardContainer,
  GameCardCover,
  GameAvatar,
  GameTitleText,
  GameDivider,
  GameInfoTitle,
  GameInfoDescription,
  GameSessionLink,
  CardTopSection,
} from "styles/GameStyle";

import { StartIcon, StopIcon, EditIcon, DeleteIcon } from "styles";

export const GameCard = ({
  game,
  onDelete,
  onStart,
  onEnd,
  onClickManagementSession,
}) => {
  const navigate = useNavigate();

  return (
    <GameCardContainer
      data-cy={`gameCard${game.id}`}
      hoverable
      cover={<GameCardCover alt="Cover Image" src={game.image} />}
      actions={[
        game.active ? (
          <Tooltip key="endGame" title="End the game">
            <Popconfirm
              title="End the task"
              description="Are you sure to end this game?"
              okText="Yes"
              cancelText="No"
              okButtonProps={{ "data-cy": "confirmEndGameBtn" }}
              cancelButtonProps={{ "data-cy": "cancelEndGameBtn" }}
              onConfirm={() => onEnd(game.id)}
              onCancel={() => {}}
            >
              <StopIcon data-cy="endGameBtn" />
            </Popconfirm>
          </Tooltip>
        ) : (
          <Tooltip key="startGame" title="Start the game">
            <StartIcon
              data-cy="startGameBtn"
              onClick={() => onStart(game.id)}
            />
          </Tooltip>
        ),
        <Tooltip key="edit" title="Edit the game">
          <EditIcon onClick={() => navigate(`/game/${game.id}`)} />
        </Tooltip>,
        <Tooltip key="delete" title="Delete the game">
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this game?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(game.id)}
            onCancel={() => {}}
          >
            <DeleteIcon />
          </Popconfirm>
        </Tooltip>,
      ]}
    >
      <CardTopSection>
        <GameAvatar>{game.owner[0].toUpperCase()}</GameAvatar>
        <GameTitleText ellipsis={{ tooltip: game.title }}>
          {game.title}
        </GameTitleText>
      </CardTopSection>

      <GameDivider />

      <div>
        <GameInfoTitle>
          {`Questions number: ${game.questions.length}`}
        </GameInfoTitle>
        <GameInfoDescription ellipsis={{ tooltip: game.description }}>
          {game.description}
        </GameInfoDescription>

        {game.active && (
          <Tooltip title="Management Session">
            <GameSessionLink onClick={() => onClickManagementSession(game.id)}>
              Session in progress ...
            </GameSessionLink>
          </Tooltip>
        )}
      </div>
    </GameCardContainer>
  );
};
