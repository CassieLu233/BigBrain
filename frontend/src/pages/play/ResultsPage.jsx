import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Space,
  Tooltip,
  Collapse,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router";
import { getCurrentGame } from "../../utils/update";
import { get } from "../../utils/request";

const { Title, Text } = Typography;

export const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId");
  const playerId = searchParams.get("playerId");

  const [results, setResults] = useState([]);
  const [questionsHistory, setQuestionsHistory] = useState([]);

  // Create table data
  const dataSource = results.map((res, i) => {
    const question = questionsHistory[i] || {};
    const duration = question.duration || 10;
    const answeredAt = res.answeredAt
      ? (new Date(res.answeredAt) - new Date(res.questionStartedAt)) / 1000
      : duration;

    // Compute point
    const correctIdxs = question.correctAnswers || [];
    const selectedIdxs = res.answers || [];
    const correctCount = selectedIdxs.filter((idx) =>
      correctIdxs.includes(idx)
    ).length;
    const totalCorrect = correctIdxs.length;
    const rawScore =
      totalCorrect > 0
        ? (correctCount / totalCorrect) * (question.points || 1)
        : 0;
    const score = Math.round(rawScore * 100) / 100;

    return {
      key: i,
      question: `Question ${i + 1}`,
      yourAnswer: selectedIdxs.length
        ? selectedIdxs.map((idx) => `Option ${idx + 1}`).join("\n")
        : "No Answer",
      correct: res.correct,
      time: Math.round(answeredAt),
      score: score,
      ratio: `(${correctCount}/${totalCorrect})`,
    };
  });

  const total = questionsHistory.length;
  const correctCount = results.filter((res) => res.correct).length;
  const avgRate = total ? Math.round((correctCount / total) * 10000) / 100 : 0;
  const totalTime = dataSource.reduce((sum, row) => sum + row.time, 0);
  const avgTime = total ? Math.round((totalTime / total) * 100) / 100 : 0;
  const totalScore = dataSource.reduce((sum, row) => sum + row.score, 0);
  const avgScore = total ? Math.round((totalScore / total) * 100) / 100 : 0;
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
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (_, record) => (
        <Text>
          {record.score} {record.ratio}
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

  // view detail data
  const detailData = questionsHistory.map((question, i) => {
    const playerAnswersIdx = results[i]?.answers || [];
    const correctIdxs = question.correctAnswers;
    return {
      key: i,
      question: question.title,
      options: question.answers.map((opt, idx) => ({
        idx,
        text: opt.text,
        isPlayer: playerAnswersIdx.includes(idx),
        isCorrect: correctIdxs.includes(idx),
      })),
    };
  });

  const detailColumns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      render: (txt) => (
        <Tooltip title={txt}>
          <Text
            ellipsis={{ tooltip: txt }}
            style={{ maxWidth: 200, display: "block" }}
          >
            {txt}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Option",
      dataIndex: "options",
      key: "options",
      render: (opts) =>
        opts.map((opt) => (
          <Tooltip key={opt.idx} title={opt.text}>
            <Text
              strong={opt.isPlayer}
              type={
                opt.isPlayer
                  ? opt.isCorrect
                    ? "success"
                    : "danger"
                  : undefined
              }
              ellipsis={{ tooltip: opt.text }}
              style={{ display: "block", maxWidth: 200 }}
            >
              {`Option ${opt.idx + 1}: ${opt.text}`}
            </Text>
          </Tooltip>
        )),
    },
    {
      title: "Correct Option(s)",
      key: "correctOptions",
      render: (_, record) => {
        // record.options : [{ idx, text, isPlayer, isCorrect }, …]
        const correctOnes = record.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => `Option ${opt.idx + 1}`)
          .join("\n");
        return correctOnes.length ? (
          <Text style={{ whiteSpace: "pre-line" }}>{correctOnes}</Text>
        ) : (
          <Text type="warning">None</Text>
        );
      },
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
        <Col span={8}>
          <Statistic
            title="Average Score"
            value={`${avgScore}`}
            prefix={<InfoCircleOutlined style={{ color: "blue" }} />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Average Correct Rate"
            value={`${avgRate}%`}
            prefix={<CheckCircleOutlined style={{ color: "green" }} />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Average Response Time"
            value={`${avgTime}s`}
            prefix={<ClockCircleOutlined style={{ color: "red" }} />}
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
          <li>
            <Space style={{ fontWeight: 600 }}>Average Score</Space> = (Sum of
            All question scores) ÷ Total Number of Questions
          </li>
        </ul>
      </Card>

      <Collapse
        bordered={false}
        style={{ marginTop: 24, background: "#fafafa" }}
        items={[
          {
            key: "details",
            label: (
              <Space>
                <EyeOutlined /> Detailed Answers
              </Space>
            ),
            children: (
              <Table
                dataSource={detailData}
                columns={detailColumns}
                pagination={false}
                bordered
                size="small"
              />
            ),
          },
        ]}
      />
    </div>
  );
};
