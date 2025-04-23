import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import { GamePage } from "./pages/game";
import { GlobalStyle } from "./global-setting/GlobalStyle";
import { QuestionPage } from "./pages/question";
import { SessionPage } from "./pages/session";
import { PlayRoute } from "./pages/play";

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
]);

createRoot(document.getElementById("root")).render(
  <>
    <GlobalStyle />
    <RouterProvider router={router} />
  </>
);
