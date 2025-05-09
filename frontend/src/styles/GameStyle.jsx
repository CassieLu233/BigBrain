// ==============================================================================
// File: GameStyle.jsx
// Purpose: Styled-components for GameCard-specific visual styling
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-05-09
// ==============================================================================

import styled from "styled-components";
import { Avatar, Typography } from "antd";
import {
  BaseCard,
  CoverImage,
  CardTitle,
  CardDescription,
  CardDivider,
} from "styles";

const { Title } = Typography;

// Card container
export const GameCardContainer = styled(BaseCard)``;

export const CardTopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GameCardCover = styled(CoverImage)`
  background-color: #d0edf7;
`;

export const GameAvatar = styled(Avatar)`
  background-color: #1395c2;
  font-size: 20px;
`;

export const GameTitleText = styled(CardTitle)`
  color: #2cafdc;
`;

export const GameDivider = styled(CardDivider)``;

// Show "Questions number: ..."
export const GameInfoTitle = styled(Title)`
  && {
    font-size: 16px;
    margin: 0;
    white-space: normal;
    word-break: break-word;
  }
`;

// Game description
export const GameInfoDescription = styled(CardDescription).attrs(() => ({
  type: "secondary",
}))``;

// In progress Session link
export const GameSessionLink = styled(Title).attrs(() => ({
  level: 5,
}))`
  font-size: 16px;
  margin: 0;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;
