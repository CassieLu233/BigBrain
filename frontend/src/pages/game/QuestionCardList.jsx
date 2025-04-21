//=============================================================================
// File: question/QuestionCardList.jsx
// Purpose: Render a grid of question cards (or empty state) using QuestionCard component
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-19
// ==============================================================================
import { Empty, Row, Col } from "antd";
import { QuestionCard } from "./QuestionCard.jsx";

/**
 * QuestionCardList
 * Props:
 *  - questions: Array<{ id, title, description }>
 */
export const QuestionCardList = ({ questions, onDelete, onEdit }) => {
  if (questions.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Empty description="No question created yet" />
      </div>
    );
  }
  return (
    <Row gutter={[16, 16]}>
      {questions.map((question) => (
        <Col key={question.id}>
          <QuestionCard
            question={question}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </Col>
      ))}
    </Row>
  );
};
