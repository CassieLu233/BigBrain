//=============================================================================
// File: play/index.jsx
// Purpose: Render JoinPage or PlayPage based on the playerId query parameters in the URL
// Created: 2025-04-23
//=============================================================================

import { useParams, useSearchParams } from "react-router";
import { JoinPage, PlayPage } from "pages";

export const PlayRoute = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId");
  const playerId = searchParams.get("playerId");

  return playerId ? (
    <PlayPage playerId={playerId} sessionId={sessionId} gameId={gameId} />
  ) : (
    <JoinPage sessionId={sessionId} gameId={gameId} />
  );
};
