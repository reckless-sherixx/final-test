import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import SinglePost from "../pages/postss/singlePost/SinglePost";
import { Announcements } from "../pages/miniPage/Announcements";
import  Posts  from "../pages/postss/Posts";
import Login from "../pages/user/Login";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import AddPost from "../pages/admin/post/AddPost";
import ManageItems from "../pages/admin/post/ManageItems";
import ManageUsers from "../pages/admin/user/ManageUsers";
import PrivateRouter from "./PrivateRouter";
import UpdatePost from "../pages/admin/post/UpdatePost";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: "/",
            element: <Home/>
        }, 

        {
          path: "/Announcements",
          element: <Announcements/>
        },

        {
          path: "/Posts",
          element: <Posts/>
        },
        {
          path: "/Posts/:id",
          element: <SinglePost/>
        },
        {
          path: "/login",
          element: <Login/>
        },
        // {
        //   path: "/register",
        //   element: <Register/>
        // },
        {
          path: "dashboard",
          element: <PrivateRouter><AdminLayout></AdminLayout></PrivateRouter>,
          children: [
            {
              path: '',
              element: <Dashboard/>
            },
            {
              path: 'add-new-post',
              element: <AddPost/>
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