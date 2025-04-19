import { Card, Divider, Typography } from "antd";
const { Text, Title } = Typography;

export const CustomCard = ({ game }) => {
  return (
    <Card
      styles={{
        body: {
          padding: 0,
        },
      }}
      style={{ minwidth: "200px" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* left image */}
        <img
          src={game.image}
          alt="cover"
          style={{
            minWidth: 120,
            maxWidth: 250,
            minHeight: 120,
            objectFit: "cover",
            backgroundColor: "#d0edf7",
          }}
        />

        {/* vertical divider */}
        <Divider
          orientation="center"
          type="vertical"
          style={{ height: 150, marginLeft: 16, marginRight: 16 }}
        />

        {/* right text */}
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: 0, color: "#2cafdc" }}>
            {game.title}
          </Title>
          <Title level={5} style={{ margin: 0 }}>
            {`Questions number: ${game.questions.length}`}
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            {game.description}
          </Text>
        </div>
      </div>
    </Card>
  );
};
