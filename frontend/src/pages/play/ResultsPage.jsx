import { useEffect, useState, useCallback } from "react";
import { Table, Card, Typography, Row, Col, Statistic, Space } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { get } from "../../utils/request";
import { useSearchParams } from "react-router";
import { getCurrentGame } from "../../utils/update";

const { Title, Text } = Typography;

export const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId");
  const playerId = searchParams.get("playerId");

  const [results, setResults] = useState([]);
  const [questionsHistory, setQuestionsHistory] = useState([]);

  // Create table data
  const dataSource = results.map((res, i) => {
    const duration = questionsHistory[i]?.duration || 10;
    const answeredAt = res.answeredAt
      ? (new Date(res.answeredAt) - new Date(res.questionStartedAt)) / 1000
      : duration;
    return {
      key: i,
      question: `Question ${i + 1}`,
      yourAnswer:
        res.answers.length > 0
          ? res.answers.map((idx) => `Option ${idx + 1}`).join("\n")
          : "No Answer",
      correct: res.correct,
      time: Math.round(answeredAt),
    };
  });

  const total = questionsHistory.length;
  const correctCount = results.filter((res) => res.correct).length;
  const avgRate = total ? Math.round((correctCount / total) * 10000) / 100 : 0;
  const totalTime = dataSource.reduce((sum, row) => sum + row.time, 0);
  const avgTime = total ? Math.round((totalTime / total) * 100) / 100 : 0;
  const maxDuration = Math.max(
    0,
    ...questionsHistory.map((question) => question.duration || 10)
  );

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Your Answer(s)",
      dataIndex: "yourAnswer",
      key: "yourAnswer",
      render: (val) =>
        val.split("\n").map((line, idx) => (
          <Text key={idx} style={{ display: "block" }}>
            {line}
          </Text>
        )),
    },
    {
      title: "Correct?",
      dataIndex: "correct",
      key: "correct",
      render: (ok) =>
        ok ? (
          <Text type="success">
            <CheckCircleOutlined /> Yes
          </Text>
        ) : (
          <Text type="danger">
            <CloseCircleOutlined /> No
          </Text>
        ),
    },
    {
      title: "Time (s)",
      dataIndex: "time",
      key: "time",
      render: (t) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{t}</Text>
        </Space>
      ),
    },
  ];

  // Fetch all answers from the player
  const fetchResults = useCallback(async () => {
    const res = await get(`/play/${playerId}/results`);
    setResults(res);
  }, [playerId]);

  // Fetch all history questions
  const fetchQuestionHistory = useCallback(async () => {
    const currentGame = await getCurrentGame(gameId);
    const questions = currentGame.questions;
    setQuestionsHistory(questions);
  }, [gameId]);

  useEffect(() => {
    fetchResults();
    fetchQuestionHistory();
  }, [fetchResults, fetchQuestionHistory]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <TrophyOutlined style={{ color: "gold" }} /> Your Results
      </Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Statistic
            title="Average Correct Rate"
            value={`${avgRate}%`}
            prefix={<CheckCircleOutlined style={{ color: "green" }} />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Average Response Time"
            value={`${avgTime}s`}
            prefix={<ClockCircleOutlined style={{ color: "green" }} />}
          />
        </Col>
      </Row>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
      />

      <Card
        type="inner"
        style={{ marginTop: 16 }}
        title={
          <Space>
            <InfoCircleOutlined />
            Notes
          </Space>
        }
      >
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Unanswered questions will be counted as{" "}
            <Space style={{ fontWeight: 600 }}>Incorrect</Space>.
          </li>
          <li>
            The time for unanswered questions will be based on the maximum time
            limit of all questions in the game (
            <Space style={{ fontWeight: 600 }}>{maxDuration}</Space>s){" "}
            Calculations.
          </li>
          <li>
            <Space style={{ fontWeight: 600 }}>Average Accuracy</Space> = Number
            of Correct Questions ÷ Total Number of Questions
          </li>
          <li>
            <Space style={{ fontWeight: 600 }}>Average Time</Space> = (Sum of
            All Questions) ÷ Total Number of Questions
          </li>
        </ul>
      </Card>
    </div>
  );
};
