import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import IngredientsPage from './features/ingredients/IngredientsPage';
import EmployeesPage from './features/employees/EmployeesPage';
import UsersPage from './features/users/UsersPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/ingredients" replace /> },
          { path: 'ingredients', element: <IngredientsPage /> },
          {
            element: <ProtectedRoute adminOnly />,
            children: [
              { path: 'employees', element: <EmployeesPage /> },
              { path: 'users', element: <UsersPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
