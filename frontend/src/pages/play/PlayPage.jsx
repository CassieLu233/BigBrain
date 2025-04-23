//=============================================================================
// File: play/PlayPage.jsx
// Purpose: Render play page component 
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-23
//=============================================================================

import { useEffect, useState, useCallback, useRef } from "react";
import { Spin, Typography, message, Radio, Checkbox, Divider, Table, Card } from "antd";
import { get, put } from "../../utils/request";

const { Title, Text } = Typography;

export const PlayPage = ({ playerId }) => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 当前题
  const [question, setQuestion] = useState(null);
  const [lastQuestionId, setLastQuestionId] = useState(null);
  const [correctAnswerIdxs, setCorrectAnswerIdxs] = useState([]);
  const [selectedIdxs, setSelectedIdxs] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);
  const fetchedAnswerRef = useRef(false);

  // Fetch joined status from backend
  const fetchStatus = useCallback(async () => {
    try {
      const res = await get(`/play/${playerId}/status`);
      setStarted(!!res.started);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  // Fetch current question from backend
  const fetchQuestion = useCallback(async () => {
    try {
      const res = await get(`/play/${playerId}/question`);
      const question = res.question;
      // If not update question, return
      if (!question || question.id === lastQuestionId) return;
      setQuestion(question);
      setLastQuestionId(question.id);
      setSelectedIdxs([]);

      // Renew fetch current answer status
      fetchedAnswerRef.current = false;
      // initial countDown
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
    setSelectedIdxs(newIdxs);
    try {
      await put(`/play/${playerId}/answer`, { answers: newIdxs });
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
        fetchResults();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchQuestion, fetchResults]);

  // Automatically pull the current correct answer at the end of the countdown
  useEffect(() => {
    if (countdown === 0 && !fetchedAnswerRef.current) {
      // Record fetch current answer status
      fetchedAnswerRef.current = true; 
      fetchCorrectAnswer();
    }
  }, [countdown, fetchCorrectAnswer]);

  // Wait started status
  useEffect(() => {
    if (!started) {
      fetchStatus();
      const iv = setInterval(fetchStatus, 1000);
      return () => clearInterval(iv);
    }
  }, [fetchStatus]);

  // Not started or loading
  if (loading || !started || !question) {
    return (
      <div style={{
        height: "100vh", display: "flex",
        flexDirection: "column", justifyContent: "center", alignItems: "center"
      }}>
        <Spin size="large" style={{ marginBottom: 16 }} />
        <Title level={3}>Please wait</Title>
      </div>
    );
  }

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
      <Card  style={{ width: 300, textAlign: "center", alignContent:"center"}}>
        <Title level={2}>Question Title:</Title>
        <Text>{question.title}</Text>
        <Text>Time remaining: </Text>
        <Text strong style={{ fontSize: 18 }}>
          {countdown != null ? `${countdown} s` : "--"}
        </Text>
        <Divider />

        {question.type === "Single Choice" && (
          <Radio.Group
            value={selectedIdxs[0]}
            onChange={e => handleAnswerChange([e.target.value])}
          >
            {question.answers.map((opt, idx) => (
              <Radio key={idx} value={idx} style={{ display: "block", margin: 4 }}>
                {opt.text}
              </Radio>
            ))}
          </Radio.Group>
        )}

        {question.type === "Multiple Choice" && (
          <Checkbox.Group
            value={selectedIdxs}
            onChange={handleAnswerChange}
          >
            {question.answers.map((opt, idx) => (
              <Checkbox key={idx} value={idx}>{opt.text}</Checkbox>
            ))}
          </Checkbox.Group>
        )}

        {question.type === "Judgement" && (
          <Radio.Group
            value={selectedIdxs[0]}
            onChange={e => handleAnswerChange([e.target.value])}
          >
            {["True","False"].map((label, idx) => (
              <Radio key={idx} value={idx}>{label}</Radio>
            ))}
          </Radio.Group>
        )}
      </Card>
    </div>
  );
};
