// ==============================================================================
// File: ForwardedStyle.jsx
// Purpose: Styled-components with React.forwardRef to support ref forwarding
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-05-09
// ==============================================================================

import React from "react";
import styled from "styled-components";
import { Button, Dropdown, Form, Input, Card } from "antd";
import {
  PlusOutlined,
  MailOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";

// ------------------------------------------------------------------------------
// Create Button with ref
// ------------------------------------------------------------------------------
const BaseCreateButton = React.forwardRef((props, ref) => (
  <Button
    ref={ref}
    type="primary"
    icon={<PlusOutlined />}
    size="large"
    {...props}
  />
));
BaseCreateButton.displayName = "BaseCreateButton";

export const CreateButton = styled(BaseCreateButton)`
  margin-right: 16px;
  font-size: 16px;
`;
CreateButton.displayName = "CreateButton";

// ------------------------------------------------------------------------------
// Dropdown with ref
// ------------------------------------------------------------------------------
const BaseDropdown = React.forwardRef((props, ref) => (
  <Dropdown trigger={["click"]} ref={ref} {...props} />
));
BaseDropdown.displayName = "BaseDropdown";

export const StyledDropdown = styled(BaseDropdown)``;
StyledDropdown.displayName = "StyledDropdown";

// ------------------------------------------------------------------------------
// Form with ref
// ------------------------------------------------------------------------------
const BaseStyledForm = React.forwardRef((props, ref) => (
  <Form layout="vertical" requiredMark={false} ref={ref} {...props} />
));
BaseStyledForm.displayName = "BaseStyledForm";

export const StyledForm = styled(BaseStyledForm)``;
StyledForm.Item = Form.Item;
StyledForm.displayName = "StyledForm";

// ------------------------------------------------------------------------------
// Input with ref and prefix
// ------------------------------------------------------------------------------
// Email input
const BaseStyledEmailInput = React.forwardRef((props, ref) => (
  <Input ref={ref} size="large" prefix={<MailOutlined />} {...props} />
));
BaseStyledEmailInput.displayName = "BaseStyledEmailInput";

export const StyledEmailInput = styled(BaseStyledEmailInput)``;
StyledEmailInput.displayName = "StyledEmailInput";

// Password input
const BaseStyledPasswordInput = React.forwardRef((props, ref) => (
  <Input.Password ref={ref} size="large" prefix={<LockOutlined />} {...props} />
));
BaseStyledPasswordInput.displayName = "BaseStyledPasswordInput";

export const StyledPasswordInput = styled(BaseStyledPasswordInput)``;
StyledPasswordInput.displayName = "StyledPasswordInput";

// Name input
const BaseStyledNameInput = React.forwardRef((props, ref) => (
  <Input ref={ref} size="large" prefix={<UserOutlined />} {...props} />
));
BaseStyledNameInput.displayName = "BaseStyledNameInput";

export const StyledNameInput = styled(BaseStyledNameInput)``;
StyledNameInput.displayName = "StyledNameInput";

// ------------------------------------------------------------------------------
// StyledCard with ref (renamed RefCard)
// ------------------------------------------------------------------------------
const BaseRefCard = React.forwardRef((props, ref) => (
  <Card ref={ref} {...props} />
));
BaseRefCard.displayName = "BaseRefCard";

export const RefCard = styled(BaseRefCard)`
  width: 400px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  background-color: #fff;
`;
RefCard.displayName = "RefCard";

export const RefVerificationCard = styled(RefCard)`
  width: 350px;
`;
RefVerificationCard.displayName = "RefVerificationCard";
