// ==============================================================================
// File: login/index.jsx
// Purpose: Login page with styled-components
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18, Refactored: 2025-05-09
// ==============================================================================

import { Form, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
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

  return (
    <CenteredContainer>
      <StyledCard $width="320px">
        <LogoHeader>
          <LogoImage src={logoImg} alt="bigbrain logo" />
          <LogoTitle>BigBrain</LogoTitle>
        </LogoHeader>
        <Form
          name="loginForm"
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email address!" },
              { type: "email", message: "The email format is incorrect!" },
            ]}
          >
            <StyledInput
              data-cy="loginEmail"
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
              data-cy="loginPassword"
              size="large"
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <StyledButton
              data-cy="loginSubmit"
              size="large"
              type="primary"
              htmlType="submit"
              block
            >
              Log In
            </StyledButton>
            <BottomTextWrapper>
              No account?{" "}
              <BottomTextLink
                data-cy="toRegister"
                onClick={handleClickRegisterTitle}
              >
                Register now!
              </BottomTextLink>
            </BottomTextWrapper>
          </Form.Item>
        </Form>
      </StyledCard>
    </CenteredContainer>
  );
};
