import { createBrowserRouter } from "react-router-dom"

import App from "@/App"
import AuthGuard from "@/router/AuthGuard"

import Home from "@/pages/home/Home"

import Post from "@/pages/Post"
import Posts from "@/pages/Posts"
import UpdatePost from "@/pages/dashboard/post/UpdatePost"

import Announcements from "@/pages/Announcements"

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

import { Post as TPost } from "@/types"

export const routes = {
  login: "/login",

  news: "/news",
  singleNews: "/news/:id",

  dashboard: "/dashboard",
  dashboard_manageItems: "/dashboard/manage-items",
  dashboard_users: "/dashboard/users",
  dashboard_news_list: "/dashboard/news",
}

export const apiRoutes = {
  findPost: (postId:string) => `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
  createPost: import.meta.env.VITE_BACKEND_URL + "/posts",
  updatePost: (post:TPost) => `${import.meta.env.VITE_BACKEND_URL}/posts/${post.id}`,
  deletePost: (post:TPost) => `${import.meta.env.VITE_BACKEND_URL}/posts/${post.id}`,
}

export const createSingleNewsRoute = (id:string) => {
  return routes.singleNews.replace(":id", id)
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