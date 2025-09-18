// ==============================================================================
// File: login/index.jsx
// Purpose: Login page with styled-components
// Created: 2025-04-18, Refactored: 2025-05-09
// ==============================================================================

import { message } from "antd";
import { useNavigate } from "react-router";
import { post } from "utils";
import logoImg from "../../assets/bigbrain.svg";

import {
  CenteredContainer,
  StyledForm,
  LogoHeader,
  LogoImage,
  LogoTitle,
  StyledEmailInput,
  StyledPasswordInput,
  PrimaryButton,
  BottomTextWrapper,
  BottomTextLink,
  RefVerificationCard,
} from "styles";

export const Login = () => {
  const navigate = useNavigate();

  // Submit form handler
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
      <RefVerificationCard>
        <StyledForm name="loginForm" onFinish={handleFinish}>
          <LogoHeader>
            <LogoImage src={logoImg} alt="bigbrain logo" />
            <LogoTitle>BigBrain</LogoTitle>
          </LogoHeader>

          <StyledForm.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email address!" },
              { type: "email", message: "The email format is incorrect!" },
            ]}
          >
            <StyledEmailInput data-cy="loginEmail" placeholder="Email" />
          </StyledForm.Item>

          <StyledForm.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <StyledPasswordInput
              data-cy="loginPassword"
              placeholder="Password"
            />
          </StyledForm.Item>

          <StyledForm.Item>
            <PrimaryButton data-cy="loginSubmit" htmlType="submit">
              Log In
            </PrimaryButton>
            <BottomTextWrapper>
              No account?{" "}
              <BottomTextLink
                data-cy="toRegister"
                onClick={handleClickRegisterTitle}
              >
                Register now!
              </BottomTextLink>
            </BottomTextWrapper>
          </StyledForm.Item>
        </StyledForm>
      </RefVerificationCard>
    </CenteredContainer>
  );
};
