import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import { GamePage } from "./pages/game";
import { GlobalStyle } from "./global-setting/GlobalStyle";
import { QuestionPage } from "./pages/question";
import { SessionPage } from "./pages/session";
import { PlayPage } from "./pages/play";

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
    path: "/game/:game_id",
    element: <GamePage />,
  },
  {
    path: "/game/:game_id/question/:question_id",
    element: <QuestionPage />,
  },
  {
    path: "/session/:session_id",
    element: <SessionPage />,
  },
  {
    path: "/play/:seesion_id",
    element: <PlayPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <>
    <GlobalStyle />
    <RouterProvider router={router} />
  </>
);
