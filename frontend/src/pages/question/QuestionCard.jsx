// ==============================================================================
// File: question/QuestionCard.jsx
// Purpose: Component for rendering a single question card (fully styled-components version)
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-19, Refactored: 2025-05-09
// ==============================================================================

import { Popconfirm } from "antd";
import {
  QuestionCardContainer,
  QuestionTitle,
  QuestionDivider,
  QuestionInfoText,
  EditIcon,
  DeleteIcon,
} from "styles";

/**
 * QuestionCard
 * Props:
 *  - question: { id: string, title: string, description: string , ...}
 *  - onDelete: function that deletes question
 *  - onEdit: function that edits question
 */
export const QuestionCard = ({ question, onDelete, onEdit }) => {
  return (
    <QuestionCardContainer
      hoverable
      actions={[
        <EditIcon
          key="edit"
          onClick={() => {
            onEdit(question.id);
          }}
        />,
        <Popconfirm
          key="delete"
          title="Delete the task"
          description="Are you sure to delete this question?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            onDelete(question.id);
          }}
          onCancel={() => {}}
        >
          <DeleteIcon />
        </Popconfirm>,
      ]}
    >
      <div>
        <QuestionTitle ellipsis={{ tooltip: question.title }}>
          {question.title}
        </QuestionTitle>
      </div>

      <QuestionDivider />

      <div>
        <QuestionInfoText strong>{`Type: ${question.type}`}</QuestionInfoText>
      </div>
      <div>
        <QuestionInfoText
          strong
        >{`Score: ${question.points}`}</QuestionInfoText>
      </div>
      <div>
        <QuestionInfoText
          strong
        >{`Limited time: ${question.duration} s`}</QuestionInfoText>
      </div>
    </QuestionCardContainer>
  );
};
