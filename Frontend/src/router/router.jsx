import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import SinglePost from "../pages/postss/singlePost/SinglePost";
import Announcements from "../pages/miniPage/Announcements"
import  Posts  from "../pages/postss/Posts";
import Login from "../pages/user/Login";
//import Register from "../pages/user/Register";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import ManageItems from "../pages/admin/post/ManageItems";
import ManageUsers from "../pages/admin/user/ManageUsers";
import PrivateRouter from "./PrivateRouter";
import UpdatePost from "../pages/admin/post/UpdatePost";
import Cas from "../pages/admin/activities/underpages/CAS/cas";
import SingleCAS from "../pages/admin/activities/underpages/CAS/singleCAS/singleCas";


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
          path: "/Announcements",
          element: <PrivateRouter><Announcements/></PrivateRouter>
        },
        {
          path: "/Cas",
          element: <PrivateRouter><Cas/></PrivateRouter>
        },
        {
          path: "/Cas/:id",
          element: <PrivateRouter><SingleCAS/></PrivateRouter>
        },
        {
          path: "/Posts",
          element: <PrivateRouter><Posts/></PrivateRouter>
        },
        {
          path: "/Posts/:id",
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
          element: <PrivateRouter><AdminLayout></AdminLayout></PrivateRouter>,
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