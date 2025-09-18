// ==============================================================================
// File: question/QuestionCardList.jsx
// Purpose: Render a grid of question cards (fully styled-components version)
// Created: 2025-04-19, Refactored: 2025-05-09
// ==============================================================================

import {
  GameCardGrid,
  GameCardColumn,
  GameCardListWrapper,
  StyledEmpty,
} from "styles";
import { QuestionCard } from "pages";

/**
 * QuestionCardList
 * Props:
 *  - questions: Array<{ id, title, description }>
 *  - onDelete: function to delete question
 *  - onEdit: function to edit question
 */
export const QuestionCardList = ({ questions, onDelete, onEdit }) => {
  if (questions.length === 0) {
    return (
      <GameCardListWrapper>
        <StyledEmpty description="No question created yet" />
      </GameCardListWrapper>
    );
  }

  return (
    <GameCardGrid>
      {questions.map((question) => (
        <GameCardColumn key={question.id}>
          <QuestionCard
            question={question}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </GameCardColumn>
      ))}
    </GameCardGrid>
  );
};
