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
          style={{ width: 150, objectFit: "cover", backgroundColor: "#d0edf7" }}
        />

        {/* vertical divider */}
        <Divider
          orientation="center"
          type="vertical"
          style={{ height: 150, marginLeft: 16, marginRight: 16 }}
        />

        {/* right text */}
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ marginLeft: 0, color: "#2cafdc" }}>
            {game.title}
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            {game.description}
          </Text>
        </div>
      </div>
    </Card>
  );
};
