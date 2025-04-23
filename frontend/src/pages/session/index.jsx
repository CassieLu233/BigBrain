//=============================================================================
// File: session/index.jsx
// Purpose: Render Manage sessions page or View results page
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-22
//=============================================================================
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { Layout, Button, Typography, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { get, post } from "../../utils/request";
import { updateGameActive } from "../../utils/update";
import { ManagementSession } from "./ManagementSession";
import { OutcomeSession } from "./OutcomeSession";

const { Title } = Typography;

export const SessionPage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId");

  const [statusResults, setStatusResults] = useState({
    active: true,
    answerAvailable: false,
    isoTimeLastQuestionStarted: null,
    position: -1,
    players: [],
    questions: [],
  });

  // Current session status
  const initialCurrentStatus = localStorage.getItem("sessionStatus");
  const [currentStatus, setCurrentSatus] = useState(initialCurrentStatus);


  // Calculate the progress bar percentage
  const questions_total = statusResults.questions.length || 0;
  // Start with 1
  const answered = statusResults.position + 1;
  const percent = Math.min(Math.round((answered / questions_total) * 100), 100);

  // CurrentQuestion
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [countDown, setCountDown] = useState(null);
  const countdownRef = useRef(null);

  // Record answers results
  const [resultsData, setResultsData] = useState([]);

  // fetch session status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await get(`/admin/session/${sessionId}/status`);
      if (res.results) {
        console.log("current status data is:", res.results);
        setStatusResults(res.results);
      }
    } catch (err) {
      message.error(err.message);
    }
  }, [sessionId]);

  // Get answers results from backend
  const fetchResults = useCallback(async () => {
    try {
      const res = await get(`/admin/session/${sessionId}/results`);
      console.log("current answers results are ", res);
      if (res.results) {
        setResultsData(res.results);
      }
    } catch (err) {
      message.error(err.message);
    }
  }, [sessionId]);

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
        localStorage.setItem("sessionStatus", res.data.status);
        localStorage.setItem("newQuestionTime", Date.now().toString());
      } else {
        message.error("Unable to move forward to the next question");
      }
    } catch (err) {
      message.error(err.message);
    }
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
        localStorage.setItem("sessionStatus", res.data.status);
        localStorage.setItem("endSessionTime", Date.now().toString());
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
    // Clear the old timer first
    clearInterval(countdownRef.current);

    // Get the start time
    let startMs =statusResults.isoTimeLastQuestionStarted? new Date(statusResults.isoTimeLastQuestionStarted).getTime(): null;

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
  ]);

  // Loarding results when answer is over
  useEffect(() => {
    if (!statusResults.active && currentStatus === "ended") {
      fetchResults();
    }
  }, [statusResults.active, currentStatus, fetchResults]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* navigation */}
      <Layout.Header
        style={{
          display:"flex",
          background: "#fff",
          padding: "0 24px",
          alignItems:"center",
          justifyContent:"space-between"
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
        <Title level={4} style={{ marginLeft: 0, color: "#1677ff"}}>
          Session ID: {sessionId}
        </Title>
      </Layout.Header>

      <Layout.Content style={{ padding: 24 }}>
        {currentStatus !== "ended" ? (
          <ManagementSession
            statusResults={statusResults}
            currentQuestion={currentQuestion}
            countDown={countDown}
            percent={percent}
            onAdvance={handleAdvance}
            onEnd={handleEnd}
          />
        ) : (
          <OutcomeSession
            totalQuestions={statusResults.questions.length}
            participants={statusResults.players.length}
            resultsData={resultsData}
          />
        )}
      </Layout.Content>
    </Layout>
  );
};
