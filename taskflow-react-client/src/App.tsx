import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AuthLayout } from "./components/layouts/auth/AuthLayout";
import { DashboardLayout } from "./components/layouts/dashboard/DashboardLayout";
import { AuthenticationGuard } from "./components/guard/AuthenticationGuard";
import { RoleGuard } from "./components/guard/RoleGuard";
import { LoginPage } from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { ForgotPasswordPage } from "./pages/auth/forgot-password";
import { HomePage } from "./pages/dashboard/home";
import { RolesPage } from "./pages/dashboard/roles";
import { UsersPage } from "./pages/dashboard/users";
import { CategoryPage } from "./pages/dashboard/categories";
import { TaskPage } from "./pages/dashboard/task-kanban";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route
          element={
            <AuthenticationGuard>
              <DashboardLayout />
            </AuthenticationGuard>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route
            path="/roles"
            element={
              <RoleGuard requiredRole="Admin">
                <RolesPage />
              </RoleGuard>
            }
          />
          <Route
            path="/users"
            element={
              <RoleGuard requiredRole="Admin">
                <UsersPage />
              </RoleGuard>
            }
          />
          <Route path="/categories" element={<CategoryPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
