// ==============================================================================
// File: game/CustomCard.jsx
// Purpose: Card with horizontal layout using styled-components
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-19, Refactored: 2025-05-09
// ==============================================================================

import {
  HorizontalCardContainer,
  CardBodyWrapper,
  LeftImageSection,
  CardVerticalDivider,
  RightContentSection,
  HorizontalTitle,
  HorizontalSubtitle,
  HorizontalDescription,
} from "styles";

export const CustomCard = ({ game }) => {
  return (
    <HorizontalCardContainer>
      <CardBodyWrapper>
        <LeftImageSection src={game.image} alt="cover" />
        <CardVerticalDivider orientation="center" type="vertical" />
        <RightContentSection>
          <HorizontalTitle>{game.title}</HorizontalTitle>
          <HorizontalSubtitle>
            {`Questions number: ${game.questions.length}`}
          </HorizontalSubtitle>
          <HorizontalDescription>{game.description}</HorizontalDescription>
        </RightContentSection>
      </CardBodyWrapper>
    </HorizontalCardContainer>
  );
};
