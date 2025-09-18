// ==============================================================================
// File: game/GameCardList.jsx
// Purpose: Render a grid of game cards (or empty state) using GameCard component
// Created: 2025-04-18, Refactored: 2025-05-09
// ==============================================================================

import { GameCard } from "pages";
import {
  GameCardListWrapper,
  GameCardGrid,
  GameCardColumn,
  StyledEmpty,
} from "styles";

/**
 * GameCardList
 * Props:
 *  - games: Array<{ id, title, description }>
 */
export const GameCardList = ({
  games,
  onDelete,
  onStart,
  onEnd,
  onClickManagementSession,
}) => {
  if (games.length === 0) {
    return (
      <GameCardListWrapper>
        <StyledEmpty description="No games created yet" />
      </GameCardListWrapper>
    );
  }

  return (
    <GameCardGrid>
      {games.map((game) => (
        <GameCardColumn key={game.id}>
          <GameCard
            game={game}
            onDelete={onDelete}
            onStart={onStart}
            onEnd={onEnd}
            onClickManagementSession={onClickManagementSession}
          />
        </GameCardColumn>
      ))}
    </GameCardGrid>
  );
};
