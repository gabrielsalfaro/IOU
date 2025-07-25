import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import AllExpensesPage from '../components/AllExpensesPage';
import Dashboard from '../components/Dashboard';
import ExpenseDetailPage from '../components/ExpenseDetailPage';
import Friends from '../components/Friends';
import Home from '../components/Home'
import FriendsPending from '../components/FriendsPending'
import Layout from './Layout';
import UserPaymentHistory from '../components/UserPaymentHistory'; 
import UserProfilePage from '../components/UserProfilePage'; 

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/", // add check for user session? send to dashboard if logged in otherwise landing page
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/home",
        element: <Home />,
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
      },
      {
        path: "friends",
        element: <Friends />,
      },
      {
        path: "friends/pending",
        element: <FriendsPending />,
      },
      {
        path: "payments",
        element: <UserPaymentHistory />,
      }
      
        ],
      },
      {
        path: "profile",
        element: <UserProfilePage />, 
      },
    ],);