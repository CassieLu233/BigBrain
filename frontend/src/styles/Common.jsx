// ==============================================================================
// File: Common.jsx
// Purpose: Shared styled-components across multiple pages
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-05-09
// ==============================================================================

import styled from "styled-components";
import { Card, Input, Button } from "antd";

// Page centering container
export const CenteredContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;

// Card extension based on antd
export const StyledCard = styled(Card)`
  width: ${(props) => props.$width || "360px"};
  text-align: center;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 20px;
  border-radius: 8px;
`;

// Logo Regional Style
export const LogoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  cursor: default;
`;

export const LogoImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

export const LogoTitle = styled.span`
  font-size: 36px;
  color: #1677ff;
  margin-left: 8px;
  cursor: default;
`;

// antd form input and button style expansion
export const StyledInput = styled(Input)`
  font-size: 16px;
`;

export const StyledPassword = styled(Input.Password)`
  font-size: 16px;
`;

export const StyledButton = styled(Button)`
  font-size: 16px;
`;

// Text jump link under the button
export const BottomTextWrapper = styled.div`
  display: block;
  text-align: right;
  margin-top: 8px;
`;

export const BottomTextLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
  color: #1890ff;
`;
