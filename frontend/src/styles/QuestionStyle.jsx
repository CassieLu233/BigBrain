// ==============================================================================
// File: QuestionStyle.jsx
// Purpose: Styled-components for QuestionCard-specific visual styling
// Created: 2025-05-09
// ==============================================================================

import styled from "styled-components";
import { Typography } from "antd";
import { BaseCard, CardTitle, CardDivider } from "./CardStyle";

const { Text } = Typography;

// Card container on blue background
export const QuestionCardContainer = styled(BaseCard)`
  background-color: #498ae6;
  border-width: 2px;
`;

// Question title text
export const QuestionTitle = styled(CardTitle)`
  color: #ffffff;
`;

export const QuestionDivider = styled(CardDivider)`
  margin-top: 6px;
  margin-bottom: 6px;
`;

// Other information (type, score, time)
export const QuestionInfoText = styled(Text)`
  color: #ffffff;
`;
