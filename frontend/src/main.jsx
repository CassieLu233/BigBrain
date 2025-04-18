import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import { GamePage } from "./pages/game";
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
  { path: "/game/:game_id", element: <GamePage /> },
]);

createRoot(document.getElementById("root")).render(
  <>
    <GlobalStyle />
    <RouterProvider router={router} />
  </>
);
