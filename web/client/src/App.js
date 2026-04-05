import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, ItemProvider } from "./contexts";
import { PrivateRoute, AdminRoute } from "./components/auth";
import { UserLayout, AdminLayout } from "./components/layout";

// Pages - Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Pages - User
import Dashboard from "./pages/user/Dashboard";
import Items from "./pages/user/Items";
import ItemDetail from "./pages/user/ItemDetail";
import ItemForm from "./pages/user/ItemForm";
import Profile from "./pages/user/Profile";

// Pages - Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminItems from "./pages/admin/AdminItems";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminReports from './pages/admin/AdminReports';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ItemProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#fff",
                },
              },
            }}
          />

          <Routes>
            {/* ======================================== */}
            {/* PUBLIC ROUTES (Login & Register) */}
            {/* ======================================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ======================================== */}
            {/* USER ROUTES (Role: user) */}
            {/* ======================================== */}
            <Route element={<PrivateRoute />}>
              <Route element={<UserLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/items" element={<Items />} />
                <Route path="/items/new" element={<ItemForm />} />
                <Route path="/items/:id" element={<ItemDetail />} />
                <Route path="/items/:id/edit" element={<ItemForm />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* ======================================== */}
            {/* ADMIN ROUTES (Role: admin) */}
            {/* ======================================== */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                {/* Admin Dashboard */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Admin Items Management */}
                <Route path="/admin/items" element={<AdminItems />} />
                <Route path="/admin/items/create" element={<ItemForm />} />
                <Route path="/admin/items/:id" element={<ItemDetail />} />
                <Route path="/admin/items/:id/edit" element={<ItemForm />} />

                {/* Admin Users Management */}
                <Route path="/admin/users" element={<AdminUsers />} />

                {/* Admin Categories Management */}
                <Route path="/admin/categories" element={<AdminCategories />} />

                {/* Admin Reports */}
                <Route path="/admin/reports" element={<AdminReports />} />
              </Route>
            </Route>

            {/* ======================================== */}
            {/* DEFAULT REDIRECTS */}
            {/* ======================================== */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ItemProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
