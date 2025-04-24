//=============================================================================
// File: dashboard/GameCardList.jsx
// Purpose: Render a grid of game cards (or empty state) using GameCard component
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import { Empty, Row, Col } from "antd";
import { GameCard } from "../dashboard/GameCard.jsx";

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
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Empty description="No games created yet" />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {games.map((game) => (
        <Col key={game.id}>
          <GameCard
            game={game}
            onDelete={onDelete}
            onStart={onStart}
            onEnd={onEnd}
            onClickManagementSession={onClickManagementSession}
          />
        </Col>
      ))}
    </Row>
  );
};
