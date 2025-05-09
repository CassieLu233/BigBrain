// ==============================================================================
// File: Common.jsx
// Purpose: Shared styled-components across multiple pages
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-05-09
// ==============================================================================

import styled from "styled-components";
import { Input, Button, Avatar, Layout } from "antd";
import {
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

// Page centering container
export const CenteredContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
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

// ================= General layout structure =================

export const PageContainer = styled(Layout)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const PageHeader = styled(Layout.Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
`;

export const PageContent = styled(Layout.Content)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: #fafafa;
`;

// ================= Dashboard Common Components =================

// LeftTop Logo + Title
export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 8px;
`;

export const LogoText = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

// Right Top button + User Information

export const NavButton = styled(Button)`
  margin-right: 16px;
  font-size: 16px;
`;

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const StyledAvatar = styled(Avatar)`
  background-color: #1677ff;
  vertical-align: middle;
  font-size: 18px;
`;

export const StyledUsername = styled.span`
  margin-left: 8px;
  font-size: 18px;
`;

export const StyledDropdownIcon = styled(DownOutlined)`
  font-size: 12px;
  color: #555;
  margin-left: 4px;
`;

// Blue: Edit button
export const EditIcon = styled(EditOutlined)`
  color: #1395c2;
  font-size: 20px;
`;

// Red: Delete button
export const DeleteIcon = styled(DeleteOutlined)`
  color: #c54949;
  font-size: 20px;
`;

// Green: Start button
export const StartIcon = styled(PlayCircleOutlined)`
  color: #56ae56;
  font-size: 20px;
`;

// Red: End button
export const StopIcon = styled(StopOutlined)`
  color: red;
  font-size: 20px;
`;
