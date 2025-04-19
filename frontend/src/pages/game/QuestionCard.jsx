//=============================================================================
// File: game/QuestionCard.jsx
// Purpose: Component for rendering a single question card
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-19
// ==============================================================================
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card, Typography, Popconfirm, Divider } from "antd";
import { useNavigate } from "react-router";
/**
 * QuestionCard
 * Props:
 *  - question: { id: number, title: string, description: string }
 *  - onDelete: function that delete question
 */

export const QuestionCard = ({ question, onDelete }) => {
  const { Text } = Typography;
  const navigate = useNavigate();

  const autoWrapStyle = {
    maxHeight: 160,
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflow: "hidden",
  };
  const showToolTipStyle = {
    textOverflow: "ellipsis",
  };

  return (
    <Card
      hoverable
      style={{ width: 300, backgroundColor: "#498ae6", borderWidth: 2 }}
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
      <div>
        <Text
          style={{
            ...autoWrapStyle,
            showToolTipStyle,
            fontSize: 20,
            fontWeight: 600,
            color: "#fff",
          }}
          ellipsis={{ tooltip: question.title }}
        >
          {question.title}
        </Text>
      </div>

      <Divider
        style={{
          borderColor: "#e1e1e1",
          color: "#969696",
          marginTop: 6,
          marginBottom: 6,
        }}
      ></Divider>
      <div>
        <Text
          strong
          style={{ color: "#fff" }}
        >{`Question Type: ${question.type}`}</Text>
      </div>
    </Card>
  );
};
