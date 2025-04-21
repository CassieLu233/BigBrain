import { Modal, Button, Typography } from "antd";

export const CreateSessionModal = ({
  visible,
  sessionId,
  onCancel,
  onClick,
}) => {
  const { Text, Title } = Typography;
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button type="default" key="cancle" onClick={onCancel}>
          Close
        </Button>,
        <Button key="copy" type="primary" onClick={onClick}>
          Copy Link
        </Button>,
      ]}
      destroyOnClose
      style={
        {
          //display: "flex",
        }
      }
    >
      <Title
        level={3}
        style={{
          color: "#1677ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Session Started !
      </Title>
      <Text strong style={{ fontSize: 20 }}>
        Session ID:
      </Text>
      <Text code style={{ fontSize: 24 }}>
        {sessionId}
      </Text>
      <Title level={5}> You can copy game link to clipboard</Title>
    </Modal>
  );
};
