//=============================================================================
// File: login/index.jsx
// Purpose: Login page
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================

import { Card, Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { post } from "utils";
import { loginStyles as styles } from "pages";
import logoImg from "../../assets/bigbrain.svg";

export const Login = () => {
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      const data = await post("/admin/auth/login", values);
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", values.email);
      message.success("Log In successful! Go to Dashboard");
      navigate("/dashboard");
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleClickRegisterTitle = () => {
    navigate("/register");
  };

  const formCard = (
    <Card style={styles.card}>
      <div style={styles.header}>
        <img src={logoImg} alt="bigbrain logo" style={styles.logoImage} />
        <span style={styles.logoTitle}>BigBrain</span>
      </div>
      <Form
        name="loginForm"
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email"
          style={styles.formItem}
          labelCol={{ style: styles.label }}
          rules={[
            { required: true, message: "Please enter your email address!" },
            { type: "email", message: "The email format is incorrect!" },
          ]}
        >
          <Input
            data-cy="loginEmail"
            size="large"
            style={styles.input}
            prefix={<MailOutlined />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          style={styles.formItem}
          labelCol={{ style: styles.label }}
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            data-cy="loginPassword"
            size="large"
            style={styles.input}
            prefix={<LockOutlined />}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            data-cy="loginSubmit"
            size="large"
            style={styles.button}
            type="primary"
            htmlType="submit"
            block
          >
            Log In
          </Button>
          <div style={styles.registerWrapper}>
            No account?{" "}
            <span
              data-cy="toRegister"
              style={styles.registerTitle}
              onClick={handleClickRegisterTitle}
            >
              Register now!
            </span>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );

  return <div style={styles.container}>{formCard}</div>;
};
