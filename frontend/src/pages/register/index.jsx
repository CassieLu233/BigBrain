//=============================================================================
// File: register/index.jsx
// Purpose: Register page
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import { Card, Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { post } from "utils";
import { registerStyles as styles } from "pages";
import logoImg from "../../assets/bigbrain.svg";

export const Register = () => {
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    const { name, email, password } = values;
    const data = { email, password, name };
    try {
      const result = await post("/admin/auth/register", data);
      message.success("Registration successful! Go to Dashboard");
      localStorage.setItem("token", result.token);
      localStorage.setItem("email", data.email);
      navigate("/dashboard");
    } catch (err) {
      message.error(err.message);
    }
  };
  const handleClickLoginTitle = () => {
    navigate("/login");
  };

  const formCard = (
    <Card style={styles.card}>
      <div style={styles.header}>
        <img src={logoImg} alt="bigbrain logo" style={styles.logoImage} />
        <span style={styles.logoTitle}>BigBrain</span>
      </div>
      <Form
        name="registerForm"
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Name"
          style={styles.formItem}
          labelCol={{ style: styles.label }}
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input
            size="large"
            style={styles.input}
            prefix={<UserOutlined />}
            placeholder="Name"
          />
        </Form.Item>
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
            size="large"
            style={styles.input}
            prefix={<LockOutlined />}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          style={styles.formItem}
          labelCol={{ style: styles.label }}
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            style={styles.input}
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            style={styles.button}
            type="primary"
            htmlType="submit"
            block
          >
            Register
          </Button>
          <div style={styles.loginWrapper}>
            Already have an account?{" "}
            <span style={styles.loginTitle} onClick={handleClickLoginTitle}>
              Log in now!
            </span>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );

  return <div style={styles.container}>{formCard}</div>;
};
