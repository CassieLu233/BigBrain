# TESTING.md

This document describes the testing strategy, structure, and commands for the `BigBrain` frontend project. It covers both **component tests** (using Cypress) and **end-to-end (E2E) tests** (also using Cypress).

---

## Table of Contents

- [TESTING.md](#testingmd)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Running Tests](#running-tests)
  - [Component Tests](#component-tests)
    - [CreateSessionModal.cy.jsx](#createsessionmodalcyjsx)
    - [CustomCard.cy.jsx](#customcardcyjsx)
    - [QuestionCard.cy.jsx](#questioncardcyjsx)
  - [End-to-End Test (Happy Path)](#end-to-end-test-happy-path)

---

## Prerequisites

- Ensure you have Node.js v20.x installed (use `nvm use` in `frontend`).
- Install dependencies in the `frontend` directory:
  ```bash
  cd frontend
  npm install
  ```
- The backend server must be running at `http://localhost:5005`.
  ```bash
  cd backend
  npm install
  npm start
  ```

## Running Tests

From the `frontend` folder, use the following command to open Cypress:

```bash
npm run test
```

- Select **Component** tests to run `*.cy.jsx` component specs.
- Select **E2E** tests to run `cypress/e2e/*.cy.jsx` specs.

To run all tests headlessly:

```bash
npx cypress run
```

---

## Component Tests

Component tests mount individual React components in isolation using `cypress/react`. All specs live under `frontend/cypress/component/`.

### CreateSessionModal.cy.jsx

- **Purpose**: Verify `CreateSessionModal` renders title, session ID, and Copy Link button, and that the `onCancel` callback and clipboard copy behavior work correctly.
- **Key Tests**:
  1. Renders the headings and session code.
  2. Invokes `onCancel` when **Close** is clicked.
  3. Stubs `navigator.clipboard.writeText` and checks it's called when **Copy Link** is clicked; verifies the AntD message appears.

### CustomCard.cy.jsx

- **Purpose**: Ensure `CustomCard` correctly displays the cover image, title, question count, and description.
- **Key Tests**:
  1. The `<img>` element has `src` matching the provided `game.image`.
  2. Title, `Questions number: X`, and description are visible.

### QuestionCard.cy.jsx

- **Purpose**: Confirm `QuestionCard` shows the question title and metadata, and correctly calls `onEdit` and `onDelete`.
- **Key Tests**:
  1. Renders title, type, score, and time limit.
  2. Clicking the **Edit** icon calls `onEdit(question.id)`.
  3. Clicking the **Delete** action, confirming the Popconfirm, calls `onDelete(question.id)`.

---

## End-to-End Test (Happy Path)

Located at `frontend/cypress/e2e/happyPath.cy.jsx`. Simulates an administrator’s full workflow:

1. **Register** a new user (unique email based on timestamp).
2. **Log in** as that user.
3. **Create** a new game (manual input) and verify success.
4. **Start** the game and confirm session start message.
5. **Navigate** via the session link to the play page, then return.
6. **End** the game session, confirm the confirmation flow, and view results.
7. **Log out** and verify redirection to `/login`.
8. **Log back in** and confirm the game still appears on the dashboard.

This covers the “happy path” of core admin functionality.
