//=============================================================================
// File: dashboard/GameCard.jsx
// Purpose: Component for rendering a single game card
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Typography, Popconfirm, Divider } from "antd";
import { useNavigate } from "react-router";
/**
 * GameCard
 * Props:
 *  - game: { id: string, title: string, description: string }
 *  - onDelete: function that delete game
 */

export const GameCard = ({ game, onDelete }) => {
  const { Text, Title } = Typography;
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
      style={{ width: 300 }}
      cover={
        <img
          alt="Cover Image"
          src={game.image}
          style={{ backgroundColor: "#d0edf7", height: 200 }}
        />
      }
      actions={[
        <EditOutlined
          key="edit"
          style={{ color: "#1395c2", fontSize: 20 }}
          onClick={() => {
            navigate(`/game/${game.id}`);
          }}
        />,
        <Popconfirm
          key="delete"
          title="Delete the task"
          description="Are you sure to delete this game?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            onDelete(game.id);
          }}
          onCancel={() => {}}
        >
          <DeleteOutlined style={{ color: "#c54949", fontSize: 20 }} />
        </Popconfirm>,
      ]}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          style={{
            backgroundColor: "#1395c2",
            fontSize: 20,
          }}
        >
          {game.owner[0].toUpperCase()}
        </Avatar>
        <Text
          style={{
            ...autoWrapStyle,
            ...showToolTipStyle,
            flex: 1,
            fontSize: 20,
            fontWeight: 600,
            color: "#2cafdc",
          }}
          ellipsis={{ tooltip: game.title }}
        >
          {game.title}
        </Text>
      </div>
      <Divider
        style={{
          margin: "0 0 10px",
          borderColor: "#e1e1e1",
          color: "#969696",
        }}
      ></Divider>
      <div style={{ flex: 1 }}>
        <Title level={5} style={{ ...autoWrapStyle, margin: 0 }}>
          {`Questions number: ${game.questions.length}`}
        </Title>
        <Text
          type="secondary"
          style={{
            ...autoWrapStyle,
            ...showToolTipStyle,
            fontSize: 16,
          }}
          ellipsis={{ tooltip: game.description }}
        >
          {game.description}
        </Text>
      </div>
    </Card>
  );
};
