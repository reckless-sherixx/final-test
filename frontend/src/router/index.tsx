import { createBrowserRouter } from "react-router-dom"

import App from "@/App"
import AuthGuard from "@/router/AuthGuard"

import Home from "@/pages/home/Home"

import Post from "@/pages/Post"
import Posts from "@/pages/Posts"
import UpdatePost from "@/pages/dashboard/post/UpdatePost"

import Announcements from "@/pages/miniPage/Announcements"

import Login from "@/pages/user/Login"
// import Register from "@/pages/user/Register"

import AdminLayout from "@/pages/dashboard/AdminLayout"
import Dashboard from "@/pages/dashboard/Dashboard"
import ManageItems from "@/pages/dashboard/post/ManageItems"
import ManageUsers from "@/pages/dashboard/user/ManageUsers"
import DashboardPosts from "@/pages/dashboard/Posts"
import Cas from "@/pages/dashboard/activities/underpages/CAS/cas"
import SingleCAS from "@/pages/dashboard/activities/underpages/CAS/singleCAS/singleCas"
// import ClubActivities from "@/pages/dashboard/activities/underpages/Club/club"

export const routes = {
  login: "/login",

  posts: "/posts",
  post: "/posts/:postId",

  dashboard: "/dashboard",
  dashboard_manageItems: "/dashboard/manage-items",
  dashboard_users: "/dashboard/users",
  dashboard_posts: "/dashboard/posts",
}

export const createPostRoute = (id:string) => {
  return routes.post.replace(":postId", id)
}

const AuthProtectedApp = () => <AuthGuard><App /></AuthGuard>

const router = createBrowserRouter([
  {
    element: <AuthProtectedApp />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/announcements",
        element: <Announcements />,
      },
      {
        path: "/cas",
        element: <Cas />,
      },
      {
        path: "/cas/:id",
        element: <SingleCAS />,
      },
      {
        path: "/posts",
        element: <Posts />,
      },
      {
        path: "/posts/:id",
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
            path: routes.dashboard_posts,
            element: <DashboardPosts />,
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

export default router