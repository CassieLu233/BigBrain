import { Modal, Button, Typography } from "antd";

export const EndSessionModal = ({ visible, onCancel, onClick }) => {
  const { Title } = Typography;
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button type="default" key="cancle" onClick={onCancel}>
          Close
        </Button>,
        <Button key="checkOutcome" type="primary" onClick={onClick}>
          View Results
        </Button>,
      ]}
      destroyOnClose
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
        Game session stopped !
      </Title>
      <Title
        level={4}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        Would you like to view the results?
      </Title>
    </Modal>
  );
};
