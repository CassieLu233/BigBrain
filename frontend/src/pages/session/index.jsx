// File: session/SessionManager.jsx
// Purpose: Manage sessions or view results, automatically switch according to active status
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-22
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { Layout, Button, Typography, message } from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { get, post } from "../../utils/request";
import { updateGameActive } from "../../utils/update";
import { ManagementSession } from "./ManagementSession";
import { OutcomeSession } from "./OutcomeSession";

const { Title } = Typography;

export const SessionPage = () => {
  const navigate = useNavigate();
  const { session_id } = useParams();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("game_id");

  const [statusResults, setStatusResults] = useState({
    active: true,
    answerAvailable: false,
    isoTimeLastQuestionStarted: null,
    position: -1,
    players: [],
    questions: [],
  });

  // Current session status
  const initialCurrentStatus = window.localStorage.getItem("sessionStatus");
  const [currentStatus, setCurrentSatus] = useState(initialCurrentStatus);

  const [loading] = useState(false);

  // Calculate the progress bar percentage
  const questions_total = statusResults.questions.length || 0;
  // Start with 1
  const answered = statusResults.position + 1;
  const percent = Math.min(Math.round((answered / questions_total) * 100), 100);

  // CurrentQuestion
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Record manual countDown
  const [manualStart, setManualStart] = useState(null);

  const [countDown, setCountDown] = useState(null);
  const countdownRef = useRef(null);

  // Record paused status
  const [isPaused, setIsPaused] = useState(false);

  // fetch session status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await get(`/admin/session/${session_id}/status`);
      if (res.results) {
        console.log("current status data is:", res.results);
        setStatusResults(res.results);
      }
    } catch (err) {
      message.error(err.message);
    }
  }, [session_id]);

  // Handle next qustion
  const handleAdvance = async () => {
    try {
      const res = await post(`/admin/game/${gameId}/mutate`, {
        mutationType: "ADVANCE",
      });
      if (res.data?.status === "advanced") {
        console.log("advanced mutate data is:", res.data);
        await fetchStatus();
        setCurrentSatus(res.data.status);
        window.localStorage.setItem("sessionStatus", res.data);
        setManualStart(Date.now());
        setIsPaused(false);
      } else {
        message.error("Unable to move forward to the next question");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  // Pause count down
  const handlePause = () => {
    clearInterval(countdownRef.current);
    setIsPaused(true);
  };

  // resume count down
  const handleResume = () => {
    if (countDown != null) {
      const endMs = Date.now() + countDown * 1000;
      updateCountDown(endMs);
      countdownRef.current = setInterval(() => updateCountDown(endMs), 1000);
      setIsPaused(false);
    }
  };

  const handleRestart = async () => {
    setManualStart(Date.now());
    setIsPaused(false);
  };

  // End session
  const handleEnd = async () => {
    try {
      const res = await post(`/admin/game/${gameId}/mutate`, {
        mutationType: "END",
      });
      if (res.data?.status === "ended") {
        console.log("end mutate data is:", res.data);
        await updateGameActive(gameId, false);
        await fetchStatus();
        setCurrentSatus(res.data.status);
        window.localStorage.setItem("sessionStatus", res.data);
        setCountDown(null);
        clearInterval(countdownRef.current);
      } else {
        message.error("Unable to end the session");
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  // Update count down
  const updateCountDown = (endMs) => {
    const secs = Math.max(0, Math.ceil((endMs - Date.now()) / 1000));
    setCountDown(secs);
    if (secs <= 0) clearInterval(countdownRef.current);
  };

  // initial page
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    // Every time "Start Point" or "Back-end Timestamp Change" or "Pause/Recover"
    // Clear the old timer first
    clearInterval(countdownRef.current);

    // Get the start time
    let startMs =
      manualStart ??
      (statusResults.isoTimeLastQuestionStarted
        ? new Date(statusResults.isoTimeLastQuestionStarted).getTime()
        : null);

    if (
      startMs != null &&
      statusResults.active &&
      statusResults.position >= 0
    ) {
      // Get the current Question
      const findedQuestion = statusResults.questions.find(
        (_, idx) => idx === statusResults.position
      );

      setCurrentQuestion(findedQuestion);
      const durationMs = (findedQuestion?.duration || 10) * 1000;
      const endMs = startMs + durationMs;

      updateCountDown(endMs);
      countdownRef.current = setInterval(() => updateCountDown(endMs), 1000);
    }

    return () => clearInterval(countdownRef.current);
  }, [
    statusResults.active,
    statusResults.isoTimeLastQuestionStarted,
    statusResults.position,
    statusResults.questions,
    manualStart,
  ]);

  const managementSessionParams = {
    statusResults,
    currentQuestion,
    countDown,
    percent,
    isPaused,
    onAdvance: handleAdvance,
    onPause: handlePause,
    onResume: handleResume,
    onEnd: handleEnd,
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* navigation */}
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          padding: "0 24px",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
        <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
          Session ID: {session_id}
        </Title>
        <Button
          icon={<ReloadOutlined />}
          type="primary"
          loading={loading}
          disabled={currentStatus === "ended"}
          onClick={handleRestart}
        >
          Restart Question
        </Button>
      </Layout.Header>

      <Layout.Content style={{ padding: 24 }}>
        {currentStatus !== "ended" ? (
          <ManagementSession {...managementSessionParams} />
        ) : (
          <OutcomeSession />
        )}
      </Layout.Content>
    </Layout>
  );
};
