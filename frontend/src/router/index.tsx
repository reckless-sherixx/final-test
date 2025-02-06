//@ts-nocheck
import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import AuthGuard from '@/router/AuthGuard';

import Home from '@/pages/home/Home';
import Post from '@/pages/Post';
import Posts from '@/pages/Posts';
import UpdatePost from '@/pages/dashboard/post/UpdatePost';
import Announcements from '@/pages/Announcements';
import Login from '@/pages/user/Login';
// import Register from "@/pages/user/Register"
import Activities from '@/pages/Activities';
import Activity from '@/pages/Activity';

import AdminLayout from '@/pages/dashboard/AdminLayout';
import Dashboard from '@/pages/dashboard/Dashboard';
import ManageItems from '@/pages/dashboard/post/ManageItems';
import ManageUsers from '@/pages/dashboard/user/ManageUsers';
import DashboardPosts from '@/pages/dashboard/Posts';
import Cas from '@/pages/dashboard/activities/underpages/CAS/cas';
// import SingleCAS from "@/pages/dashboard/activities/underpages/CAS/singleCAS/singleCas"
import DashboardActivity from '@/pages/dashboard/Activity';
// import ClubActivities from "@/pages/dashboard/activities/underpages/Club/club"

import { Activity as TActivity, Post as TPost } from '@/types';
import ResetPassword from '@/pages/resetPassword';

export const routes = {
  login: '/login',

  news: '/news',
  singleNews: '/news/:id',

  activities: '/activities/:type',
  activity: '/activity/:id',

  dashboard: '/dashboard',
  dashboard_manageItems: '/dashboard/manage-items',
  dashboard_users: '/dashboard/users',
  dashboard_news_list: '/dashboard/news',

  dashboard_activity: '/dashboard/activities/:slug',
};

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const apiRoutes = {
  createPost: `${backendUrl}/posts`,
  findPost: (postId: string) => `${backendUrl}/posts/${postId}`,
  fineCasPost: (postId: string) => `${backendUrl}/cas/${postId}`,
  updatePost: (post: TPost) => `${backendUrl}/posts/${post.id}`,
  deletePost: (post: TPost) => `${backendUrl}/posts/${post.id}`,

  getRelatedPosts: (id: string) => `${backendUrl}/posts/related/${id}`,

  createActivity: `${backendUrl}/cas/create/`,
  updateActivity: (activityId: string) => `${backendUrl}/activities/${activityId}`,
  deleteActivity: (activity: TActivity) => `${backendUrl}/activities/${activity.id}`,
};

export const createSingleNewsRoute = (id: string) => {
  return routes.singleNews.replace(':id', id);
};

export const createActivityRoute = (activity: TActivity) => {
  return routes.activity.replace(':id', activity.id);
};

export const createActivitiesRoute = (type: string) => {
  return routes.activities.replace(':type', type);
};

export const createDashboardActivityRoute = (slug: string) => {
  return routes.dashboard_activity.replace(':slug', slug);
};

const AuthProtectedApp = () => (
  <AuthGuard>
    <App />
  </AuthGuard>
);

const router = createBrowserRouter([
  {
    element: <AuthProtectedApp />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
      {
        path: '/announcements',
        element: <Announcements />,
      },
      {
        path: routes.activities,
        element: <Activities />,
      },
      {
        path: routes.activity,
        element: <Activity />,
      },
      {
        path: routes.news,
        element: <Posts />,
      },
      {
        path: routes.singleNews,
        element: <Post />,
      },
    ],
  },
  {
    element: <App />,
    children: [
      { path: routes.login, element: <Login /> },
      // { path: "/register", element: <Register/> },
    ],
  },
  {
    element: <AuthProtectedApp />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: routes.dashboard,
            element: <Dashboard />,
          },
          {
            path: routes.dashboard_manageItems,
            element: <ManageItems />,
          },
          {
            path: routes.dashboard_users,
            element: <ManageUsers />,
          },
          {
            path: routes.dashboard_news_list,
            element: <DashboardPosts />,
          },
          {
            path: routes.dashboard_activity,
            element: <DashboardActivity />,
          },
          // {
          //   path: "/dashboard/update-items/:id",
          //   element: <UpdatePost />,
          // },
        ],
      },
    ],
  },
]);

export default router;
