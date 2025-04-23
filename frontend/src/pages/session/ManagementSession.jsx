//=============================================================================
// File: session/ManagementSesson.jsx
// Purpose: Render management session component
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-23
// ==============================================================================

import {
  Card,
  Typography,
  Divider,
  Progress,
  Space,
  Button,
  Popconfirm,
} from "antd";

export const ManagementSession = ({
  statusResults,
  currentQuestion,
  countDown,
  percent,
  isPaused,
  onAdvance,
  onPause,
  onResume,
  onEnd,
}) => {
  const { Title, Text } = Typography;
  const totalQuestions = statusResults.questions.length;
  const answeredPosition = statusResults.position + 1;

  return (
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
        The Game Is In Progress
      </Title>

      <Text>
        Current Question ({answeredPosition}/{totalQuestions}):{" "}
      </Text>
      <Text strong style={{ fontSize: 18 }}>
        {currentQuestion?.title || "No question yet"}
      </Text>
      <Divider />

      <Text>Countdown: </Text>
      <Text strong style={{ fontSize: 18 }}>
        {countDown != null ? `${countDown} s` : "--"}
      </Text>
      <Divider />

      <Progress percent={percent} />
      <Divider />

      <Text>Participants: </Text>
      <Text strong style={{ fontSize: 18 }}>
        {statusResults.players.length || 0}
      </Text>
      <Divider />

      <Space
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          color="cyan"
          variant="solid"
          disabled={answeredPosition === totalQuestions}
          onClick={onAdvance}
        >
          Next Question
        </Button>

        <Button
          color="purple"
          variant="solid"
          onClick={isPaused ? onResume : onPause}
        >
          {isPaused ? "Resume Session" : "Pause Session"}
        </Button>

        <Popconfirm
          title="End the task"
          description="Are you sure to end this session?"
          okText="Yes"
          cancelText="No"
          onConfirm={onEnd}
          onCancel={() => {}}
        >
          <Button color="danger" variant="solid">
            End Session
          </Button>
        </Popconfirm>
      </Space>
    </Card>
  );
};
