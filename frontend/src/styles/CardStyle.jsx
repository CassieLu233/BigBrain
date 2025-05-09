// ==============================================================================
// File: CardStyle.jsx
// Purpose: Neutral, reusable styled-components for card-based layouts
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-05-09
// ==============================================================================

import styled from "styled-components";
import { Card, Divider, Typography } from "antd";

const { Text } = Typography;

// Universal card container
export const BaseCard = styled(Card)`
  width: 300px;
`;

// Form background card
export const StyledCard = styled(Card)`
  width: ${(props) => props.$width || "360px"};
  text-align: center;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 20px;
  border-radius: 8px;
`;

// Universal cover pattern
export const CoverImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

// Vertical container
export const VerticalCardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Title text (center + line wrap + omit processing)
export const CardTitle = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-top: 8px;
  white-space: normal;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Paragraph information text (applicable to description text)
export const CardDescription = styled(Text)`
  font-size: 16px;
  white-space: normal;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Internal partition of the card
export const CardDivider = styled(Divider)`
  margin: 10px 0;
  border-color: #e1e1e1;
  color: #969696;
`;
