//=============================================================================
// File: dashboard/GameCard.jsx
// Purpose: Component for rendering a single game card
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import { Card } from "antd";
/**
 * GameCard
 * Props:
 *  - game: { id: number, title: string, description: string }
 */
export const GameCard = ({ game }) => {
  return (
    <Card title={game.title} style={{ width: 300 }}>
      {game.description}
    </Card>
  );
};
