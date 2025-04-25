// frontend/cypress/component/CustomCard.cy.jsx

/* eslint-disable no-undef */
import { CustomCard } from "pages";

// Test suite for the CustomCard component
describe("CustomCard Component Test", () => {
  // Sample game object used as props for the CustomCard
  const game = {
    title: "Test Game",
    image:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsdWUiLz48L3N2Zz4=",
    description: "A lovely game",
    questions: [{}, {}, {}],
  };

  // Before each test, mount the CustomCard component with the sample game prop
  beforeEach(() => {
    cy.mount(<CustomCard game={game} />);
  });

  // Test that the cover image is rendered with the correct src attribute
  it("displays the cover image", () => {
    cy.get("img").should("have.attr", "src", game.image);
  });

  // Test that the title, question count, and description are visible
  it("shows title, question count and description", () => {
    cy.contains(game.title).should("be.visible");
    cy.contains("Questions number: 3").should("be.visible");
    cy.contains(game.description).should("be.visible");
  });
});
