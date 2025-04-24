//=============================================================================
// File: game/CustomCard.jsx
// Purpose: Modal for custom styles
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-19
// ==============================================================================
import { Card, Divider, Typography } from "antd";
const { Text, Title } = Typography;

export const CustomCard = ({ game }) => {
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
      styles={{
        body: {
          padding: 0,
        },
      }}
      style={{ minwidth: "200px", backgroundColor: "#edf4fe" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* left image */}
        <img
          src={game.image}
          alt="cover"
          style={{
            minWidth: 120,
            maxWidth: "50%",
            minHeight: 120,
            objectFit: "cover",
            backgroundColor: "#d0edf7",
          }}
        />

        {/* vertical divider */}
        <Divider
          orientation="center"
          type="vertical"
          style={{ height: 150, marginLeft: 0, marginRight: 24 }}
        />

        {/* right text */}
        <div style={{ flex: 1 }}>
          <Title
            level={4}
            style={{
              ...autoWrapStyle,
              ...showToolTipStyle,
              margin: 0,
              color: "#2cafdc",
            }}
            ellipsis={{ tooltip: game.title }}
          >
            {game.title}
          </Title>

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
      </div>
    </Card>
  );
};
