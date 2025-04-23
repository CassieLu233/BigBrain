//=============================================================================
// File: session/JoinPage.jsx
// Purpose: Render player join page component
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-23
// ==============================================================================

// src/pages/play/JoinPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, Form, Input, Button, message, Typography } from "antd";
import logoImg from "../../assets/bigbrain.svg";
import { post } from "../../utils/request";

export const JoinPage = ({sessionId}) => {
  const {Text} = Typography;
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async ({ name }) => {
    setSubmitting(true);
    try {
      const res = await post(`/play/join/${sessionId}`, { name });
      // { playerId: Number }
      if(res.playerId){
        message.success("Joined successfully!");
        navigate(`/play/${sessionId}?playerId=${res.playerId}`);
      }else{
        message.error("Participation failed, please contact the administrator");
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fafafa",
      }}
    >
      <Card
        style={{ width: 300, textAlign: "center"}}
      >
        <div style={{marginBottom:16}}>
          <img src={logoImg} alt="BigBrain" style={{ width: 50, height: 50 }} />
          <Text strong style={{ margin: 0, fontSize:45, color:"#1677ff"}}>
            BigBrain
          </Text>
        </div>

        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Your Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={submitting}
            >
              Join Game
            </Button>
          </Form.Item>
        </Form>

        <div style={{ color: "#999", fontSize: 12 }}>
          Session ID: {sessionId}
        </div>
      </Card>
    </div>
  );
};
