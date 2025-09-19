//=============================================================================
// File: session/CreateSessionModal.jsx
// Purpose: Modal for displaying and copying the newly created session ID
// Created: 2025-04-23
//=============================================================================
import { Modal, Button, Typography, message } from "antd";
import copy from 'copy-to-clipboard';

export const CreateSessionModal = ({ visible, sessionId, onCancel }) => {
  const { Text, Title, Paragraph } = Typography;
  const startedSessionGameId = localStorage.getItem("startedSessionGameId");
  const relativePath = `/play/${sessionId}?gameId=${startedSessionGameId}`;
  const fullLink = new URL(relativePath, document.baseURI).href;

  // Copy game link to clipboard
  const handleCopyGameLink = async () => {
    const success = copy(fullLink);
    if(success){
      message.success("Game link has been copied to the clipboard");
    }else{
      message.error("Copy failed! Please copy the link manually.");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button type="default" key="cancle" onClick={onCancel}>
          Close
        </Button>,
        <Button key="copy" type="primary" onClick={handleCopyGameLink}>
          Copy Link
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
        Session Started !
      </Title>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text strong style={{ fontSize: 20 }}>
          Session ID:
        </Text>
        <Text code style={{ fontSize: 24 }}>
          {sessionId}
        </Text>
      </div>
      <Paragraph
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          marginTop: 16,
        }}
      >
        <a
          data-cy="sessionLink"
          href={fullLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {fullLink}
        </a>
      </Paragraph>
    </Modal>
  );
};
