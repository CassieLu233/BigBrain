// File: session/SessionManager.jsx
// Purpose: Manage sessions or view results, automatically switch according to active status
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-22
import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import {
  Layout,
  Button,
  Card,
  Typography,
  Divider,
  Progress,
  Space,
  message,
  Popconfirm,
} from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { get, post } from "../../utils/request";
import { updateGameActive } from "../../utils/update";

const { Title, Text } = Typography;

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
  const [currentStatus, setCurrentSatus] = useState(null);

  const [loading] = useState(false);

  // Calculate the progress bar percentage
  const questions_total = statusResults.questions.length || 0;
  const percent = Math.min(
    Math.round((statusResults.position / questions_total) * 100),
    100
  );

  // CurrentQuestion
  const currentQuestion = statusResults.questions.find(
    (q, index) => index + 1 === statusResults.position
  );

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
        const updatedStatus = await updateGameActive(gameId, true);
        if (updatedStatus) {
          fetchStatus();
          setCurrentSatus(res.data.status);
        }
      } else {
        message.error("Unable to move forward to the next question");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleStop = async () => {};

  const handleReStart = async () => {};

  // End session
  const handleEnd = async () => {
    try {
      const res = await post(`/admin/game/${gameId}/mutate`, {
        mutationType: "END",
      });
      if (res.data?.status === "ended") {
        console.log("end mutate data is:", res.data);
        const updatedStatus = await updateGameActive(gameId, false);
        if (updatedStatus) {
          fetchStatus();
          setCurrentSatus(res.data.status);
        }
      } else {
        message.error("Unable to end the session");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Call fetchStatus once every 1000 ms
    const iv = setInterval(fetchStatus, 1000);
    return () => clearInterval(iv);
  }, [fetchStatus]);

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
          type='primary'
          loading={loading}
          onClick={handleReStart}
        >
          Restart Session
        </Button>
      </Layout.Header>

      <Layout.Content style={{ padding: 24 }}>
        {statusResults.active || currentStatus !== "ended" ? (
          <>
            {/* Management session */}
            <Card style={{ marginBottom: 24, backgroundColor: "#fff" }}>
              <Title
                level={3}
                style={{
                  marginBottom: 24,
                  color: "#56ae56",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                The game is in progress
              </Title>
              <Text>
                Current Question ({statusResults.position}/{questions_total}):{" "}
              </Text>
              <Text strong style={{ fontSize: 18 }}>
                {currentQuestion?.title || "No question yet"}
              </Text>
              <Divider />
              <Text>Countdown: </Text>
              <Text strong style={{ fontSize: 18 }}>
                {statusResults.isoTimeLastQuestionStarted || "--"} s
              </Text>
              <Divider />
              <Progress percent={percent} />
              <Divider />
              <Text>Online player numbers: </Text>
              <Text strong style={{ fontSize: 18 }}>
                {statusResults.players?.length || 0}
              </Text>
              <Divider />
              <Space>
                <Button
                  disabled={statusResults.position === questions_total}
                  onClick={handleAdvance}
                >
                  Next Question
                </Button>
                <Button onClick={handleStop}>Stop Session</Button>
                <Popconfirm
                  title='End the task'
                  description='Are you sure to end this session?'
                  okText='Yes'
                  cancelText='No'
                  onConfirm={handleEnd}
                  onCancel={() => {}}
                >
                  <Button danger>End Seession</Button>
                </Popconfirm>
              </Space>
            </Card>
          </>
        ) : (
          <>
            {/* View the Outcome */}
            <Card title='The game is over'>
              <Title level={5}>View Results</Title>
              <Text>The result page is to be implemented</Text>
            </Card>
          </>
        )}
      </Layout.Content>
    </Layout>
  );
};
