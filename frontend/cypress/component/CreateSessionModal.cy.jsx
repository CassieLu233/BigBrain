// frontend/cypress/component/CreateSessionModal.cy.jsx

/* eslint-disable no-undef */
/// <reference types="cypress" />
import { mount } from "cypress/react";
import { CreateSessionModal } from "pages";

// Describe the test suite for the CreateSessionModal component
describe("CreateSessionModal Component Test", () => {
  const sessionId = "abc123"; // Example session ID

  // Test that the modal renders its title, session ID, and Copy Link button
  it("renders title, session ID and Copy Link button", () => {
    const onCancel = cy.stub().as("onCancel"); // Stub for cancel callback
    mount(
      <CreateSessionModal
        visible={true}
        sessionId={sessionId}
        onCancel={onCancel}
      />
    );

    // Verify the modal title is visible
    cy.contains("Session Started !").should("be.visible");
    // Verify the "Session ID:" label is visible
    cy.contains("Session ID:").should("be.visible");
    // Verify the code element displays the correct session ID
    cy.get("code").should("have.text", sessionId);
    // Verify the Copy Link button is visible
    cy.contains("button", "Copy Link").should("be.visible");
  });

  // Test that clicking the Close button calls the onCancel callback
  it("calls onCancel when Close clicked", () => {
    // Stub for cancel callback
    const onCancel = cy.stub().as("onCancel");
    mount(
      <CreateSessionModal
        visible={true}
        sessionId={sessionId}
        onCancel={onCancel}
      />
    );

    // Click the Close button
    cy.contains("button", "Close").click();
    // Assert that onCancel was called exactly once
    cy.get("@onCancel").should("have.been.calledOnce");
  });

  // Test that clicking the Copy Link button writes to clipboard and shows a message
  it("copies link to clipboard when Copy Link clicked", () => {
    mount(
      <CreateSessionModal
        visible={true}
        sessionId={sessionId}
        onCancel={() => {}}
      />
    );

    // Stub the clipboard.writeText method on the window.navigator object
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, "writeText").as("writeText");
    });

    // Click the Copy Link button
    cy.contains("button", "Copy Link").click();

    // Verify that clipboard.writeText was called once
    cy.get("@writeText").should("have.been.calledOnce");

    // Verify that the success message is displayed
    cy.get(".ant-message-notice-content").should(
      "contain.text",
      "Game link has been copied to the clipboard"
    );
  });
});
