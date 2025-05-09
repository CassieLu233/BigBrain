// ==============================================================================
// File: FormStyle.jsx
// Purpose: Shared styled-component for Ant Design Form with default layout and Form.Item binding
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-05-09
// ==============================================================================

import styled from "styled-components";
import { Form } from "antd";
import React from "react";

// Main form wrapper with default layout and requiredMark, supporting ref
const BaseForm = React.forwardRef((props, ref) => (
  <Form layout="vertical" requiredMark={false} ref={ref} {...props} />
));

// Set displayName to avoid ESLint react/display-name warning
BaseForm.displayName = "BaseForm";

const StyledForm = styled(BaseForm)``;

// Forward Form.Item for usage like <StyledForm.Item>
StyledForm.Item = Form.Item;

export { StyledForm };
