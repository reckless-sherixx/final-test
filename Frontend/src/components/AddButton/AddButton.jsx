import React from "react";
import "./Addbutton.css";
import { useDispatch, useSelector } from 'react-redux';

const AddButton = ({ onClick }) => {

  const {user} = useSelector((state) => state.auth);
  return (
    <div className="floating-plus" onClick={onClick} style={user && user.role === "admin" ? {} : {display:"none"}}>
      <div className="plus">
        <div className="vertical"></div>
        <div className="horizontal"></div>
      </div>
    </div>
  );
};

export default AddButton;