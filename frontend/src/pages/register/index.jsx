// ==============================================================================
// File: register/index.jsx
// Purpose: Register page with styled-components
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18, Refactored: 2025-05-09
// ==============================================================================

import { Form, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { post } from "utils";
import logoImg from "../../assets/bigbrain.svg";

import {
  CenteredContainer,
  StyledCard,
  LogoHeader,
  LogoImage,
  LogoTitle,
  StyledInput,
  StyledPassword,
  StyledButton,
  BottomTextWrapper,
  BottomTextLink,
} from "styles";

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

  return (
    <CenteredContainer>
      <StyledCard $width="360px">
        <LogoHeader>
          <LogoImage src={logoImg} alt="bigbrain logo" />
          <LogoTitle>BigBrain</LogoTitle>
        </LogoHeader>
        <Form
          name="registerForm"
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <StyledInput
              data-cy="registerName"
              id="name"
              size="large"
              prefix={<UserOutlined />}
              placeholder="Name"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email address!" },
              { type: "email", message: "The email format is incorrect!" },
            ]}
          >
            <StyledInput
              data-cy="registerEmail"
              id="email"
              size="large"
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <StyledPassword
              data-cy="registerPassword"
              id="password"
              size="large"
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm Password"
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
            <StyledPassword
              data-cy="registerConfirmPassword"
              id="confirmPassword"
              size="large"
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item>
            <StyledButton
              data-cy="registerSubmit"
              size="large"
              type="primary"
              htmlType="submit"
              block
            >
              Register
            </StyledButton>
            <BottomTextWrapper>
              Already have an account?{" "}
              <BottomTextLink onClick={handleClickLoginTitle}>
                Log in now!
              </BottomTextLink>
            </BottomTextWrapper>
          </Form.Item>
        </Form>
      </StyledCard>
    </CenteredContainer>
  );
};
