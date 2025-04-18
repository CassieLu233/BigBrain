//=============================================================================
// File: dashboard/GameCard.jsx
// Purpose: Component for rendering a single game card
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Typography } from "antd";
/**
 * GameCard
 * Props:
 *  - game: { id: number, title: string, description: string }
 */

const { Meta } = Card;
const { Text, Paragraph } = Typography;
export const GameCard = ({ game }) => (
  <Card
    style={{ width: 300 }}
    cover={
      <img
        alt="Cover Image"
        src={game.image}
        style={{ backgroundColor: "#d0edf7" }}
      />
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={
        <Avatar style={{ backgroundColor: "#1395c2", fontSize: 20 }}>
          {game.owner[0].toUpperCase()}
        </Avatar>
      }
      title={
        <Text style={{ fontSize: 20, fontWeight: 600, color: "#2cafdc" }}>
          {game.title}
        </Text>
      }
      description={
        <div>
          <Text strong>Question number: {game.questions.length}</Text>
          <Paragraph
            style={{
              margin: "4px 0 0",
              whiteSpace: "pre-wrap",
              lineHeight: 1.5,
              color: "#666",
              fontSize: 14,
            }}
          >
            {game.description}
          </Paragraph>
        </div>
      }
    />
  </Card>
);
