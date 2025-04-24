//=============================================================================
// File: dashboard/GameCard.jsx
// Purpose: Component for rendering a single game card
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Typography, Popconfirm, Divider, Tooltip } from "antd";
import { useNavigate } from "react-router";
/**
 * GameCard
 * Props:
 *  - game: { id: string, title: string, description: string }
 *  - onDelete: function that delete game
 */

export const GameCard = ({
  game,
  onDelete,
  onStart,
  onEnd,
  onClickManagementSession,
}) => {
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
          alt='Cover Image'
          src={game.image}
          style={{ backgroundColor: "#d0edf7", height: 200 }}
        />
      }
      actions={[
        game.active ? (
          <Tooltip key='endGame' title='End the game'>
            <Popconfirm
              title='End the task'
              description='Are you sure to end this game?'
              okText='Yes'
              cancelText='No'
              onConfirm={() => {
                onEnd(game.id);
              }}
              onCancel={() => {}}
            >
              <StopOutlined style={{ color: "red", fontSize: 20 }} />
            </Popconfirm>
          </Tooltip>
        ) : (
          <Tooltip key='startGame' title='Start the game'>
            <PlayCircleOutlined
              style={{ color: "#56ae56", fontSize: 20 }}
              onClick={() => {
                onStart(game.id);
              }}
            />
          </Tooltip>
        ),
        <Tooltip key='edit' title='Edit the game'>
          <EditOutlined
            style={{ color: "#1395c2", fontSize: 20 }}
            onClick={() => {
              navigate(`/game/${game.id}`);
            }}
          />
        </Tooltip>,
        <Tooltip key='delete' title='Delete the game'>
          <Popconfirm
            title='Delete the task'
            description='Are you sure to delete this game?'
            okText='Yes'
            cancelText='No'
            onConfirm={() => {
              onDelete(game.id);
            }}
            onCancel={() => {}}
          >
            <DeleteOutlined style={{ color: "#c54949", fontSize: 20 }} />
          </Popconfirm>
        </Tooltip>,
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
          type='secondary'
          style={{
            ...autoWrapStyle,
            ...showToolTipStyle,
            fontSize: 16,
          }}
          ellipsis={{ tooltip: game.description }}
        >
          {game.description}
        </Text>

        {game.active && (
          <Tooltip title='Management Session'>
            <Title
              level={5}
              style={{
                ...autoWrapStyle,
                margin: 0,
                color: "blue",
                textDecoration: "underline",
              }}
              onClick={() => {
                onClickManagementSession(game.id);
              }}
            >
              Session in progress ...
            </Title>
          </Tooltip>
        )}
      </div>
    </Card>
  );
};
