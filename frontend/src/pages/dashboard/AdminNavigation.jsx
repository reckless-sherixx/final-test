import React from "react";
import AdminImg from "../../assets/admin.jpg";
import { NavLink } from "react-router-dom";
import { useLogoutUserMutation } from "../../redux/features/auth/authapi";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";

import { routes } from "@/router"

const AdminNavigation = () => {
  const [logoutUser] = useLogoutUserMutation();

  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="space-y-20 bg-white p-32 md:h-[calc(100vh-98px)] flex flex-col justify-between">
      <div>
        {/* Header part */}
        <div className="mb-20">
          <img src={AdminImg} alt="" className="size-56" />
          <p className="font-semibold">Admin </p>
        </div>
        <hr />
        <ul className="space-y-20 pt-20">
          {[
            {
              to: routes.dashboard,
              text: "Dashboard",
            },
            {
              to: routes.dashboard_manageItems,
              text: "Manage Items",
            },
            {
              to: routes.dashboard_users,
              text: "Users",
            },
            {
              to: routes.dashboard_posts,
              text: "Posts",
            },
          ].map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.to}
                end
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-black"
                }
              >
                {link.text}
              </NavLink>
            </li>
          ))}
          {/*
          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-items"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Manage Items
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Users
            </NavLink>
          </li>
          */}
        </ul>
      </div>

      <div className="mb-12">
        <hr className="mb-12"></hr>
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 font-medium px-20 py-4 rounded-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavigation;