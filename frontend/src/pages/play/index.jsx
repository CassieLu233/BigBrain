//=============================================================================
// File: session/index.jsx
// Purpose: Render JoinPage or PlayPage based on the playerId query parameters in the URL
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-23
//=============================================================================

import { useParams,useSearchParams } from "react-router";
import {JoinPage } from "./JoinPage.jsx"
import { PlayPage } from "./PlayPage.jsx";

export const PlayRoute = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId");
  const playerId = searchParams.get("playerId");

  return playerId
    ? <PlayPage  playerId={playerId} sessionId={sessionId} gameId={gameId} />
    : <JoinPage sessionId={sessionId} />;
};
