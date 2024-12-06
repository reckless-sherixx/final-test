import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Ne rien afficher si la modal est fermée

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;