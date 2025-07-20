import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import AllExpensesPage from '../components/AllExpensesPage';
import Dashboard from '../components/Dashboard';
import ExpenseDetailPage from '../components/ExpenseDetailPage';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/", // add check for user session? send to dashboard if logged in otherwise landing page
        element: <h1>Welcome!</h1>,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "expenses",
        element: <AllExpensesPage />,
      },
      {
        path: "expenses/:expenseId",
        element: <ExpenseDetailPage />,
      }
    ],
  },
]);
