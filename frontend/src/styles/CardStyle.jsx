// ==============================================================================
// File: CardStyle.jsx
// Purpose: Neutral, reusable styled-components for card-based layouts
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-05-09
// ==============================================================================

import styled from "styled-components";
import { Card, Divider, Typography, Row, Col } from "antd";

const { Text, Title } = Typography;

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
  object-fit: fill;
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

// GameCard Empty status container (centered to display Empty)
export const GameCardListWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const GameCardGrid = styled((props) => (
  <Row gutter={[16, 16]} {...props} />
))``;

export const GameCardColumn = styled(Col)``;

export const CardBodyWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardVerticalDivider = styled(Divider)`
  height: 150px;
  margin-left: 0;
  margin-right: 24px;
`;

// Title for horizontal card layout
export const HorizontalTitle = styled(Title).attrs(() => ({
  level: 4,
  ellipsis: { tooltip: true },
}))`
  && {
    margin: 0;
    color: #2cafdc;
    font-size: 18px;
    max-height: 50px;
    overflow: hidden;
  }
`;

export const HorizontalSubtitle = styled(Title).attrs(() => ({
  level: 5,
}))`
  && {
    margin: 0;
    font-size: 16px;
    max-height: 48px;
    overflow: hidden;
  }
`;

export const HorizontalDescription = styled(Text).attrs(() => ({
  type: "secondary",
  ellipsis: { tooltip: true },
}))`
  && {
    font-size: 16px;
    max-height: 64px;
    overflow: hidden;
    white-space: normal;
    word-break: break-word;
  }
`;

// ================= Horizontal Card Layout for Game Info =================

// Horizontal container for image and text (used in CustomCard)
export const HorizontalCardContainer = styled(BaseCard)`
  min-width: 200px;
  width: 100%;
  background-color: #edf4fe;
`;

// Left image area
export const LeftImageSection = styled.img`
  min-width: 120px;
  max-width: 50%;
  min-height: 120px;
  object-fit: fill;
  background-color: #d0edf7;
`;

// Right text section inside the horizontal layout
export const RightContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
