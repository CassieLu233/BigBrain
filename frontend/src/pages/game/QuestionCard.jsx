//=============================================================================
// File: game/QuestionCard.jsx
// Purpose: Component for rendering a single question card
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-19
// ==============================================================================
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card, Typography, Popconfirm } from "antd";
import { useNavigate } from "react-router";
/**
 * QuestionCard
 * Props:
 *  - question: { id: number, title: string, description: string }
 *  - onDelete: function that delete question
 */

export const QuestionCard = ({ question, onDelete }) => {
  const { Meta } = Card;
  const { Text } = Typography;
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      style={{ width: 300 }}
      actions={[
        <EditOutlined
          key="edit"
          style={{ color: "#1395c2", fontSize: 20 }}
          onClick={() => {
            navigate(`/dashboard`);
          }}
        />,
        <Popconfirm
          key="delete"
          title="Delete the task"
          description="Are you sure to delete this question?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            onDelete(question.id);
          }}
          onCancel={() => {}}
        >
          <DeleteOutlined style={{ color: "#c54949", fontSize: 20 }} />
        </Popconfirm>,
      ]}
    >
      <Meta
        title={
          <Text style={{ fontSize: 20, fontWeight: 600, color: "#2cafdc" }}>
            {question.title}
          </Text>
        }
        description={
          <div>
            <Text>{`Question Type: ${question.type}`}</Text>
          </div>
        }
      />
    </Card>
  );
};
