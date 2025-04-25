// frontend/cypress/component/QuestionCard.cy.jsx

/* eslint-disable no-undef */
/// <reference types="cypress" />
import { mount } from "cypress/react";
import { QuestionCard } from "pages";

describe("QuestionCard Component Test", () => {
  const question = {
    id: 42,
    title: "What is 2 + 2?",
    type: "Single Choice",
    points: 5,
    duration: 10,
  };

  it("renders title and metadata correctly", () => {
    const onEdit = cy.stub().as("onEdit");
    const onDelete = cy.stub().as("onDelete");

    // Mount the QuestionCard component with stubbed callbacks
    mount(
      <QuestionCard question={question} onEdit={onEdit} onDelete={onDelete} />
    );

    // Verify that the question title is displayed
    cy.contains(question.title).should("be.visible");
    // Verify that the question type is displayed
    cy.contains(`Type: ${question.type}`).should("be.visible");
    // Verify that the points (score) are displayed
    cy.contains(`Score: ${question.points}`).should("be.visible");
    // Verify that the time limit is displayed
    cy.contains(`Limited time: ${question.duration} s`).should("be.visible");
  });

  it("calls onEdit when edit icon is clicked", () => {
    const onEdit = cy.stub().as("onEdit");
    const onDelete = cy.stub();

    // Mount the component with the edit callback stub
    mount(
      <QuestionCard question={question} onEdit={onEdit} onDelete={onDelete} />
    );

    // Click the first action icon (EditOutlined) in the card actions
    cy.get(".ant-card-actions svg").first().click();
    // Assert that the onEdit callback was called with the question ID
    cy.get("@onEdit").should("have.been.calledOnceWith", question.id);
  });

  it("calls onDelete when delete is confirmed", () => {
    const onEdit = cy.stub();
    const onDelete = cy.stub().as("onDelete");

    // Mount the component with the delete callback stub
    mount(
      <QuestionCard question={question} onEdit={onEdit} onDelete={onDelete} />
    );

    // Click the second action (Delete) in the card actions list
    cy.get(".ant-card-actions li").eq(1).click();

    // Ensure the Popconfirm dialog appears
    cy.get(".ant-popover").should("be.visible");

    // Within the Popconfirm, click the "Yes" button to confirm deletion
    cy.contains(".ant-popover button", "Yes").click();

    // Assert that the onDelete callback was called with the question ID
    cy.get("@onDelete").should("have.been.calledOnceWith", question.id);
  });
});
