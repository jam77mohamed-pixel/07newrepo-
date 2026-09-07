import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '../components/layout/Layout';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Dashboard } from '../pages/Dashboard';
import { Books } from '../pages/Books';
import { Members } from '../pages/Members';
import { BorrowRecords } from '../pages/BorrowRecords';
import { MyBorrows } from '../pages/MyBorrows';
import { Notifications } from '../pages/Notifications';
import { NotFound } from '../pages/NotFound';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes inside Main App Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Default Index Route */}
        <Route
          index
          element={
            <Navigate to={user?.role === ROLES.ADMIN ? '/dashboard' : '/books'} replace />
          }
        />

        {/* Admin Only: Dashboard */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* All Roles: Books Catalog */}
        <Route path="books" element={<Books />} />

        {/* Admin Only: Members Management */}
        <Route
          path="members"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Members />
            </ProtectedRoute>
          }
        />

        {/* Admin Only: Borrow & Return Management */}
        <Route
          path="borrows"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <BorrowRecords />
            </ProtectedRoute>
          }
        />

        {/* Member Portal: My Loans & History */}
        <Route
          path="my-borrows"
          element={
            <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
              <MyBorrows />
            </ProtectedRoute>
          }
        />

        {/* All Roles: Notifications */}
        <Route path="notifications" element={<Notifications />} />

        {/* Catch-all Not Found inside Layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
