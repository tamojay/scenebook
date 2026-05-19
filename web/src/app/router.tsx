import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { PublicRoute } from "@/features/auth/PublicRoute";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { EditorPage } from "@/pages/EditorPage";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/projects/:id", element: <EditorPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
