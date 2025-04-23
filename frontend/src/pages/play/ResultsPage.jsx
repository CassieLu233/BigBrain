// src/pages/play/ResultsPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Table, Spin, Typography, message } from "antd";
import { get } from "../../utils/request";

const { Title } = Typography;

export const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const playerId = searchParams.get("playerId");

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await get(`/play/${playerId}/results`);
        setResults(res);
      } catch (err) {
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [playerId]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    { title: "Question", dataIndex: "question", key: "question" },
    { title: "Your Answer", dataIndex: "your", key: "your" },
    { title: "Correct?", dataIndex: "correct", key: "correct" },
    { title: "Time (s)", dataIndex: "time", key: "time" },
  ];

  const dataSource = results.map((r, i) => ({
    key: i,
    question: `Question ${i + 1}`,
    your: (r.answers || []).join(", "),
    correct: r.correct ? "Yes" : "No",
    time: Math.round(
      (new Date(r.answeredAt) - new Date(r.questionStartedAt)) / 1000
    ),
  }));

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Your Results</Title>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};
