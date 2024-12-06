import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import PrivateRouter from "./PrivateRouter";

import Home from "../pages/home/Home";

import SinglePost from "../pages/postss/singlePost/SinglePost";
import Posts from "../pages/postss/Posts";
import UpdatePost from "../pages/admin/post/UpdatePost";

import Announcements from "../pages/miniPage/Announcements"

import Login from "../pages/user/Login";
//import Register from "../pages/user/Register";

import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import ManageItems from "../pages/admin/post/ManageItems";
import ManageUsers from "../pages/admin/user/ManageUsers";
import Cas from "../pages/admin/activities/underpages/CAS/cas";
import SingleCAS from "../pages/admin/activities/underpages/CAS/singleCAS/singleCas";
//import ClubActivities from "../pages/admin/activities/underpages/Club/club";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: "/",
            element: <PrivateRouter><Home/></PrivateRouter>
        }, 
        {
          path: "/announcements",
          element: <PrivateRouter><Announcements/></PrivateRouter>
        },
        {
          path: "/cas",
          element: <PrivateRouter><Cas/></PrivateRouter>
        },
        {
          path: "/cas/:id",
          element: <PrivateRouter><SingleCAS/></PrivateRouter>
        },
        {
          path: "/posts",
          element: <PrivateRouter><Posts/></PrivateRouter>
        },
        {
          path: "/posts/:id",
          element: <PrivateRouter><SinglePost/></PrivateRouter>
        },
        {
          path: "/login",
          element: <Login/>
        },
        /*{
          path: "/register",
          element: <Register/>
        },*/
        {
          path: "dashboard",
          element: <PrivateRouter><AdminLayout/></PrivateRouter>,
          children: [
            {
              path: '',
              element: <Dashboard/>
            },
            {
              path: 'manage-items',
              element: <ManageItems/>
            },
            {
              path: 'users',
              element: <ManageUsers/>
            },
            {
              path: 'update-items/:id',
              element: <UpdatePost/>
            },
          ]
        }
      ]
    },
  ]);

  export default router