//=============================================================================
// File: play/PlayPage.jsx
// Purpose: Render player game play page component
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-23
// ==============================================================================

import { useEffect, useState } from "react";
import { Spin, Typography, message } from "antd";
import { get } from "../../utils/request";

export const PlayPage = ({sessionId, gameId, playerId}) => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    console.log("current playerId:", playerId);
    try {
      const res = await get(`/play/${playerId}/status`);
      // { started: boolean }
      setStarted(!!res.started);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // After the administrator advances the next question, started will become true
    const iv = setInterval(fetchStatus, 1000);
    return () => clearInterval(iv);
  }, [playerId]);

  // 尚未开始或正在加载中
  if (loading || !started) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" style={{ marginBottom: 16 }} />
        <Typography.Title level={3} style={{ margin: 0 }}>
        Please wait for the administrator to ask questions
        </Typography.Title>
      </div>
    );
  }

  // The game has begun, the real answer page
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Game Started!</Typography.Title>
      {/* Here are the questions, options, countdown, and answers submitted... */}
    </div>
  );
};
