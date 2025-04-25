// frontend/cypress/e2e/happyPath.cy.jsx

/* eslint-disable no-undef */

describe("Admin Full Happy Path", () => {
  it("registers, logs in, creates/starts/ends a game, views results, logs out and logs back in", () => {
    const ts = Date.now();
    const TEST_USER = {
      name: "Test User",
      email: `test_user_${ts}@example.com`,
      password: "password123",
    };
    const TEST_GAME = {
      title: "Test Game",
      description: "This is an automated testing game",
    };

    // 1. Go to Login page
    cy.visit("/login");
    cy.get("[data-cy=loginEmail]").should("be.visible");
    cy.get("[data-cy=loginPassword]").should("be.visible");

    // 2. Navigate to Register
    cy.get("[data-cy=toRegister]").click();
    cy.url().should("include", "/register");

    // 3. Fill Register form and submit
    cy.get("[data-cy=registerName]").type(TEST_USER.name);
    cy.get("[data-cy=registerEmail]").type(TEST_USER.email);
    cy.get("[data-cy=registerPassword]").type(TEST_USER.password);
    cy.get("[data-cy=registerConfirmPassword]").type(TEST_USER.password);
    cy.get("[data-cy=registerSubmit]").click();

    // 4. Should land on Dashboard
    cy.url({ timeout: 1000 }).should("include", "/dashboard");
    cy.get("[data-cy=createGameBtn]").should("be.visible");

    // 5. Open Create Game modal (manual)
    cy.get("[data-cy=createGameBtn]").click();
    cy.get("[data-cy=gameTitleInput]").type(TEST_GAME.title);
    cy.get("[data-cy=gameDescriptionInput]").type(TEST_GAME.description);
    cy.get("[data-cy=gameSubmit]").click();
    cy.contains("Create a game successfully").should("be.visible");
    cy.contains(TEST_GAME.title).should("be.visible");

    // 6. Start the game
    cy.get("[data-cy^=gameCard]")
      .contains(TEST_GAME.title)
      .parents("[data-cy^=gameCard]")
      .within(() => {
        cy.get("[data-cy=startGameBtn]").click();
      });
    cy.contains("The game session has started").should("be.visible");

    // 7. Follow session link
    cy.get("[data-cy=sessionLink]").invoke("removeAttr", "target").click();
    cy.url().should("include", "/play/");
    cy.go("back");

    // 8. End the game
    cy.get("[data-cy=endGameBtn]").click();
    cy.get("[data-cy=confirmEndGameBtn]").click();
    cy.contains("Game Session Stopped !").should("be.visible");
    cy.get("[data-cy=viewResultsBtn]").click();
    cy.url().should("include", "/session/");
    cy.contains("The Game Is Over").should("be.visible");
    cy.go("back"); // back to dashboard

    // 9. Logout
    cy.get("[data-cy=userAvatar]").click();
    cy.get("[data-cy=logoutButton]").click();
    cy.url().should("include", "/login");

    // 10. Login again
    cy.get("[data-cy=loginEmail]").type(TEST_USER.email);
    cy.get("[data-cy=loginPassword]").type(TEST_USER.password);
    cy.get("[data-cy=loginSubmit]").click();
    cy.url().should("include", "/dashboard");

    // 11. Verify the game still exists
    cy.contains(TEST_GAME.title).should("be.visible");
  });
});
