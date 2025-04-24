import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { SessionPage } from "./pages/session";
import {
  Login,
  Register,
  Dashboard,
  GamePage,
  QuestionPage,
  PlayRoute,
  ResultsPage,
} from "pages";
import { GlobalStyle } from "./global-setting/GlobalStyle";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/game/:gameId",
    element: <GamePage />,
  },
  {
    path: "/game/:gameId/question/:questionId",
    element: <QuestionPage />,
  },
  {
    path: "/session/:sessionId",
    element: <SessionPage />,
  },
  {
    path: "/play/:sessionId",
    element: <PlayRoute />,
  },
  {
    path: "/play/:sessionId/results",
    element: <ResultsPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <>
    <GlobalStyle />
    <RouterProvider router={router} />
  </>
);
