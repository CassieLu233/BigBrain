// ==============================================================================
// File: register/index.jsx
// Purpose: Register page with styled-components
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
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
  StyledNameInput,
  PrimaryButton,
  BottomTextWrapper,
  BottomTextLink,
} from "styles";

export const Register = () => {
  const navigate = useNavigate();

  // Submit form handler
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
      <StyledForm name="registerForm" onFinish={handleFinish}>
        <LogoHeader>
          <LogoImage src={logoImg} alt="bigbrain logo" />
          <LogoTitle>BigBrain</LogoTitle>
        </LogoHeader>

        <StyledForm.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <StyledNameInput data-cy="registerName" placeholder="Name" />
        </StyledForm.Item>

        <StyledForm.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email address!" },
            { type: "email", message: "The email format is incorrect!" },
          ]}
        >
          <StyledEmailInput data-cy="registerEmail" placeholder="Email" />
        </StyledForm.Item>

        <StyledForm.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <StyledPasswordInput
            data-cy="registerPassword"
            placeholder="Password"
          />
        </StyledForm.Item>

        <StyledForm.Item
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
          <StyledPasswordInput
            data-cy="registerConfirmPassword"
            placeholder="Confirm Password"
          />
        </StyledForm.Item>

        <StyledForm.Item>
          <PrimaryButton data-cy="registerSubmit" htmlType="submit">
            Register
          </PrimaryButton>
          <BottomTextWrapper>
            Already have an account?{" "}
            <BottomTextLink onClick={handleClickLoginTitle}>
              Log in now!
            </BottomTextLink>
          </BottomTextWrapper>
        </StyledForm.Item>
      </StyledForm>
    </CenteredContainer>
  );
};
