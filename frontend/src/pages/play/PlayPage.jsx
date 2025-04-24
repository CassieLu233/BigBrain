//=============================================================================
// File: play/PlayPage.jsx
// Purpose: Render play page component
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-23
//=============================================================================

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Typography,
  message,
  Radio,
  Checkbox,
  Divider,
  Card,
  Spin,
} from "antd";
import { useNavigate } from "react-router";
import { get, put } from "../../utils/request";

export const PlayPage = ({ sessionId, playerId, gameId }) => {
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [answered, setAnswered] = useState(false);

  // All questions
  const [question, setQuestion] = useState(null);
  const [lastQuestionId, setLastQuestionId] = useState(null);
  const [correctAnswerIdxs, setCorrectAnswerIdxs] = useState([]);
  const [selectedIdxs, setSelectedIdxs] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);
  const fetchedAnswerRef = useRef(false);

  const autoWrapStyle = {
    display: "inline-block",
    maxWidth: 250,
    whiteSpace: "nowrap",
    wordBreak: "break-word",
    overflow: "hidden",
  };
  const showToolTipStyle = {
    textOverflow: "ellipsis",
  };

  function getYouTubeId(url) {
    const m = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return m ? m[1] : null;
  }

  // Fetch joined status from backend
  const fetchStatus = useCallback(async () => {
    try {
      const res = await get(`/play/${playerId}/status`);
      setStarted(!!res.started);
    } catch (err) {
      message.error(err.message);
    }
  }, [playerId]);

  // Fetch current question from backend
  const fetchQuestion = useCallback(async () => {
    try {
      const res = await get(`/play/${playerId}/question`);
      console.log("=================current question is:", res);
      const question = res.question;
      // If not update question, return
      if (started && question.id === lastQuestionId) return;

      setQuestion(question);
      setLastQuestionId(question.id);
      setSelectedIdxs([]);
      setAnswered(false);

      // Renew fetch current answer status
      fetchedAnswerRef.current = false;

      // Initial countDown
      clearInterval(timerRef.current);
      const startMs = new Date(question.isoTimeLastQuestionStarted).getTime();
      const endMs = startMs + (question.duration || 10) * 1000;
      const tick = () => {
        const secs = Math.max(0, Math.ceil((endMs - Date.now()) / 1000));
        setCountdown(secs);
        if (secs <= 0) {
          clearInterval(timerRef.current);
        }
      };
      tick();
      timerRef.current = setInterval(tick, 1000);
    } catch (err) {
      message.error(err.message);
    }
  }, [playerId, lastQuestionId]);

  // Fetch correct answer from backend
  const fetchCorrectAnswer = useCallback(async () => {
    try {
      const res = await get(`/play/${playerId}/answer`);
      setCorrectAnswerIdxs(res.answers || []);
    } catch (err) {
      message.error(err.message);
    }
  }, [playerId]);

  // Submit answer
  const handleAnswerChange = async (newIdxs) => {
    setAnswered(false);
    setSelectedIdxs(newIdxs);
    console.log("current newIdx:", newIdxs);
    try {
      const res = await put(`/play/${playerId}/answer`, { answers: newIdxs });
      if (res) {
        setAnswered(true);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  // Listen to storage change event from management session
  useEffect(() => {
    const onStorage = (e) => {
      // Next question signal
      if (e.key === "newQuestionTime") {
        fetchQuestion();
      }
      // End session signal
      if (e.key === `endSessionTime`) {
        console.log("PlayPage gameId is", gameId);
        navigate(
          `/play/${sessionId}/results?playerId=${playerId}&gameId=${gameId}`
        );
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchQuestion]);

  // Automatically pull the current correct answer at the end of the countdown
  useEffect(() => {
    if (countdown === 0 && !fetchedAnswerRef.current) {
      // Record fetch current answer status
      fetchedAnswerRef.current = true;
      fetchCorrectAnswer();
      setTimeout(fetchQuestion, 500);
    }
  }, [countdown, fetchCorrectAnswer, fetchQuestion]);

  // Wait started status
  useEffect(() => {
    if (!started) {
      fetchStatus();
      const iv = setInterval(fetchStatus, 1000);
      return () => clearInterval(iv);
    }
  }, [fetchStatus]);

  if (started && question) {
    // Answer page
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fafafa",
        }}
      >
        <Card
          hoverable
          style={{
            width: 300,
            textAlign: "center",
            alignContent: "center",
            backgroundColor: "#e9f8f9",
          }}
        >
          {/* Render video） */}
          {question.videoUrl &&
            (() => {
              const id = getYouTubeId(question.videoUrl);
              return id ? (
                <div style={{ marginBottom: 16 }}>
                  <iframe
                    width="100%"
                    height="180"
                    src={`https://www.youtube.com/embed/${id}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : null;
            })()}
          {question.image && (
            <img
              alt="Question Image"
              src={question.image}
              style={{ backgroundColor: "#d0edf7", height: 180 }}
            />
          )}
          <div>
            <Text
              strong
              style={{
                ...autoWrapStyle,
                ...showToolTipStyle,
                fontSize: 24,
                color: "#1677ff",
              }}
              ellipsis={{ tooltip: question.title }}
            >
              {question.title}
            </Text>
          </div>

          <Text strong style={{ fontSize: 16, color: "#e05e5e" }}>
            {" "}
            Time Limited:{" "}
          </Text>
          <Text strong style={{ fontSize: 18, color: "#e05e5e" }}>
            {countdown != null ? `${countdown} s` : " -- "}
          </Text>
          <Divider />

          {question.type === "Single Choice" && (
            <Radio.Group
              value={selectedIdxs[0]}
              onChange={(e) => handleAnswerChange([e.target.value])}
            >
              {question.answers.map((opt, idx) => (
                <div key={idx} style={{ textAlign: "left" }}>
                  <Text
                    strong
                    style={{
                      ...autoWrapStyle,
                      ...showToolTipStyle,
                    }}
                    ellipsis={{ tooltip: question.title }}
                  >
                    <Radio value={idx}>{opt.text}</Radio>
                  </Text>
                  <br />
                </div>
              ))}
            </Radio.Group>
          )}

          {question.type === "Multiple Choice" && (
            <Checkbox.Group value={selectedIdxs} onChange={handleAnswerChange}>
              {question.answers.map((opt, idx) => (
                <Text
                  key={idx}
                  strong
                  style={{
                    ...autoWrapStyle,
                    ...showToolTipStyle,
                    marginBottom: 10,
                  }}
                  ellipsis={{ tooltip: question.title }}
                >
                  <Checkbox key={idx} value={idx}>
                    {opt.text}
                  </Checkbox>
                </Text>
              ))}
            </Checkbox.Group>
          )}

          {question.type === "Judgement" && (
            <Radio.Group
              value={selectedIdxs[0]}
              onChange={(e) => handleAnswerChange([e.target.value])}
            >
              {["True", "False"].map((label, idx) => (
                <Radio key={idx} value={idx}>
                  {label}
                </Radio>
              ))}
            </Radio.Group>
          )}

          {/* ...Render answered success*/}
          {answered && (
            <div>
              <Text style={{ color: "green" }}>Submit Successfully</Text>
            </div>
          )}

          {/* ...Render correct answer... */}
          {countdown === 0 && (
            <Card
              size="normal"
              type="inner"
              title="Answers"
              style={{ marginTop: 16, textAlign: "left", color: "#1677ff" }}
            >
              <Text>Your Choice:</Text>
              {selectedIdxs.length === 0 ? (
                <Text>–</Text>
              ) : (
                selectedIdxs.map((i) => {
                  const isCorrect = correctAnswerIdxs.includes(i);
                  return (
                    <Text
                      strong
                      key={i}
                      type={isCorrect ? "success" : "danger"}
                      style={{ display: "block" }}
                    >
                      Option {i + 1}
                    </Text>
                  );
                })
              )}
              <br />
              <Text>Correct Answer:</Text>
              <br />
              <Text type="success" strong>
                {correctAnswerIdxs.length
                  ? correctAnswerIdxs.map((i) => `Option ${i + 1}`).join(", ")
                  : "No Answer"}
              </Text>
              <br />
              <Text>Points:&nbsp;</Text>
              <br />
              {selectedIdxs.length === 0 ? (
                <Text>0 (0/{correctAnswerIdxs.length})</Text>
              ) : (
                (() => {
                  const correctCount = selectedIdxs.filter((i) =>
                    correctAnswerIdxs.includes(i)
                  ).length;
                  const total = correctAnswerIdxs.length;
                  const score = Math.round(
                    (correctCount / total) * question.points
                  );
                  return (
                    <Text type="success" strong>
                      {`${score} (${correctCount}/${total})`}
                    </Text>
                  );
                })()
              )}
            </Card>
          )}
        </Card>
      </div>
    );
  } else {
    // Not started or loading
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
        <Title level={3}>Please wait</Title>
      </div>
    );
  }
};
