// ==============================================================================
// File: ForwardedStyle.jsx
// Purpose: Styled-components with React.forwardRef to support ref forwarding
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-05-09
// ==============================================================================

import React from "react";
import styled from "styled-components";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Card,
  Segmented,
  Modal,
  Upload,
  Select,
  InputNumber,
  Checkbox,
  Radio,
  Divider,
  Typography,
} from "antd";
import {
  PlusOutlined,
  MailOutlined,
  LockOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";

// ------------------------------------------------------------------------------
// Create Button with ref
// ------------------------------------------------------------------------------
const BaseCreateButton = React.forwardRef((props, ref) => (
  <Button ref={ref} type="primary" icon={<PlusOutlined />} {...props} />
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
StyledForm.List = Form.List;
StyledForm.ErrorList = Form.ErrorList;
StyledForm.Provider = Form.Provider;
StyledForm.useForm = Form.useForm;
StyledForm.displayName = "StyledForm";

// ------------------------------------------------------------------------------
// Input with ref and prefix
// ------------------------------------------------------------------------------

// Plain input (no prefix)
const BaseStyledInput = React.forwardRef((props, ref) => (
  <Input ref={ref} size="large" {...props} />
));
BaseStyledInput.displayName = "BaseStyledInput";

export const StyledInput = styled(BaseStyledInput)``;
StyledInput.displayName = "StyledInput";

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

// ------------------------------------------------------------------------------
// UploadButton with ref (icon + primary button)
// ------------------------------------------------------------------------------
const BaseUploadButton = React.forwardRef((props, ref) => (
  <Button ref={ref} icon={<UploadOutlined />} size="large" {...props} />
));
BaseUploadButton.displayName = "BaseUploadButton";

export const UploadButton = styled(BaseUploadButton)``;
UploadButton.displayName = "UploadButton";

// ------------------------------------------------------------------------------
// Segmented control with ref (mode toggle)
// ------------------------------------------------------------------------------
const BaseSegmented = React.forwardRef((props, ref) => (
  <Segmented ref={ref} {...props} />
));
BaseSegmented.displayName = "BaseSegmented";

export const StyledSegmented = styled(BaseSegmented)`
  margin-bottom: 16px;
`;
StyledSegmented.displayName = "StyledSegmented";

// Modal wrapper with ref
const BaseModal = React.forwardRef((props, ref) => (
  <Modal ref={ref} destroyOnClose {...props} />
));
BaseModal.displayName = "BaseModal";

export const StyledModal = styled(BaseModal)``;
StyledModal.displayName = "StyledModal";

// Upload wrapper with ref
const BaseUpload = React.forwardRef((props, ref) => (
  <Upload ref={ref} {...props} />
));
BaseUpload.displayName = "BaseUpload";

export const StyledUpload = styled(BaseUpload)``;
StyledUpload.displayName = "StyledUpload";

// ------------------------------------------------------------------------------
// Select with ref
// ------------------------------------------------------------------------------
const BaseSelect = React.forwardRef((props, ref) => (
  <Select ref={ref} size="large" {...props} />
));
BaseSelect.displayName = "BaseSelect";

export const StyledSelect = styled(BaseSelect)``;
StyledSelect.Option = Select.Option;
StyledSelect.displayName = "StyledSelect";

// ------------------------------------------------------------------------------
// InputNumber with ref
// ------------------------------------------------------------------------------
const BaseInputNumber = React.forwardRef((props, ref) => (
  <InputNumber ref={ref} size="large" {...props} />
));
BaseInputNumber.displayName = "BaseInputNumber";

export const StyledInputNumber = styled(BaseInputNumber)``;
StyledInputNumber.displayName = "StyledInputNumber";

// ------------------------------------------------------------------------------
// Checkbox with ref
// ------------------------------------------------------------------------------
const BaseCheckbox = React.forwardRef((props, ref) => (
  <Checkbox ref={ref} {...props} />
));
BaseCheckbox.displayName = "BaseCheckbox";

export const StyledCheckbox = styled(BaseCheckbox)``;
StyledCheckbox.displayName = "StyledCheckbox";

// ------------------------------------------------------------------------------
// Radio Group with ref
// ------------------------------------------------------------------------------
const BaseRadioGroup = React.forwardRef((props, ref) => (
  <Radio.Group ref={ref} {...props} />
));
BaseRadioGroup.displayName = "BaseRadioGroup";

export const StyledRadioGroup = styled(BaseRadioGroup)``;
StyledRadioGroup.Button = Radio.Button;
StyledRadioGroup.displayName = "StyledRadioGroup";

// ------------------------------------------------------------------------------
// Typography.Text
// ------------------------------------------------------------------------------
const BaseText = React.forwardRef((props, ref) => (
  <Typography.Text ref={ref} {...props} />
));
BaseText.displayName = "BaseText";

export const StyledText = styled(BaseText)`
  font-size: 24px;
  font-weight: 700;
  color: #1677ff;
  white-space: nowrap;
  word-break: break-word;
  overflow: hidden;
`;
StyledText.displayName = "StyledText";

// ------------------------------------------------------------------------------
// Divider with ref
// ------------------------------------------------------------------------------
const BaseDivider = React.forwardRef((props, ref) => (
  <Divider ref={ref} {...props} />
));
BaseDivider.displayName = "BaseDivider";

export const StyledDivider = styled(BaseDivider)`
  margin-bottom: 16px;
  border-color: #e1e1e1;
  color: #969696;
`;
StyledDivider.displayName = "StyledDivider";
