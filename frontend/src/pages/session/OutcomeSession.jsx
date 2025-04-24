//=============================================================================
// File: session/OutcomeSession.jsx
// Purpose: Render session outcome component
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-23
// ==============================================================================
import { useMemo } from "react";
import { Card, Table, Typography, Divider } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export const OutcomeSession = ({
  resultsData,
  totalQuestions,
  participants,
  questions,
}) => {
  const { Title, Text } = Typography;

  // Calculate rankings, top 5
  // Return {rank, name, score}
  const computeLeaderboard = () => {
    console.log("current questions:", questions);
    return (
      resultsData
        .map((player) => {
          // Compute the total score of the player
          const totalScore = (player.answers || []).reduce((sum, ans, idx) => {
            const question = questions[idx];
            console.log("current question:", question);
            if (!question) return sum;
            const corrects = question.correctAnswers || [];
            // Answers that the player has selected
            const selected = Array.isArray(ans.answers)
              ? ans.answers
              : [ans.answers];
            // Count correct selected answer
            const hitCount = selected.filter((s) =>
              corrects.includes(s)
            ).length;
            console.log("current selected:", selected, hitCount);
            const fraction = corrects.length ? hitCount / corrects.length : 0;
            return sum + fraction * (question.points || 1);
          }, 0);
          return {
            name: player.name,
            score: Math.round(totalScore * 100) / 100,
          };
        })
        // Rank, takes top 5
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((row, i) => ({ rank: i + 1, ...row }))
    );
  };

  const leaderboard = useMemo(computeLeaderboard, [resultsData, questions]);

  // Compute the correctness of each question
  // Return {question: Q1, percent: 80}
  const computeCorrectnessData = () => {
    return Array.from({ length: totalQuestions }).map((_, idx) => {
      const totalParticipants = resultsData.length;
      const correctCount = resultsData.filter(
        (player) => player.answers[idx]?.correct
      ).length;
      return {
        question: `Q${idx + 1}`,
        percent:
          totalParticipants > 0
            ? Math.round((correctCount / totalParticipants) * 100)
            : 0,
      };
    });
  };

  const correctnessData = useMemo(computeCorrectnessData, [
    resultsData,
    totalQuestions,
  ]);

  // Calculate the average answer time for each question
  // Return {question: Q1, avgTime: 2(s)}
  const computeTimeData = () => {
    return Array.from({ length: totalQuestions }).map((_, idx) => {
      const diffTimes = resultsData
        .map((player) => {
          const ans = player.answers[idx];
          if (!ans) return null;
          return (
            (new Date(ans.answeredAt).getTime() -
              new Date(ans.questionStartedAt).getTime()) /
            1000
          );
        })
        .filter((diffTime) => diffTime != null);

      const avg =
        diffTimes.length > 0
          ? Math.round(
              diffTimes.reduce((sum, time) => sum + time, 0) / diffTimes.length
            )
          : 0;
      return { question: `Q${idx + 1}`, avgTime: avg };
    });
  };
  const timeData = useMemo(computeTimeData, [resultsData, totalQuestions]);

  // Table definition
  const columns = useMemo(
    () => [
      { title: "Rank", dataIndex: "rank", key: "rank" },
      { title: "Player", dataIndex: "name", key: "name" },
      {
        title: "Score",
        dataIndex: "score",
        key: "score",
        sorter: (a, b) => a.score - b.score,
        defaultSortOrder: "descend",
      },
    ],
    []
  );

  return (
    <Card style={{ backgroundColor: "#fff" }}>
      <Title level={3} style={{ textAlign: "center", color: "#da432c" }}>
        The Game Is Over
      </Title>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Text strong>Total Questions: </Text>
        <Text strong style={{ fontSize: 20, marginRight: 24 }}>
          {totalQuestions}
        </Text>
        <Text strong>Participants: </Text>
        <Text strong style={{ fontSize: 20, marginLeft: 8 }}>
          {participants}
        </Text>
      </div>

      {/* Score rank */}
      <Table
        dataSource={leaderboard}
        columns={columns}
        pagination={false}
        rowKey="rank"
        style={{ marginBottom: 24 }}
      />

      {/* Correct rate distribution */}
      <Text strong>Question Correctness %</Text>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={correctnessData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="question" />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip />
          <Line type="monotone" dataKey="percent" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <Divider />

      {/* Average answer time */}
      <Text strong>Average Answer Time (s)</Text>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={timeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="question" />
          <YAxis unit="s" />
          <Tooltip />
          <Line type="monotone" dataKey="avgTime" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
