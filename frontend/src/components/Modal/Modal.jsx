import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-20 top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center">
      <div className="relative w-full max-w-[75%] p-20 bg-white rounded-8 shadow-md transition-all" onClick={(e) => e.stopPropagation()}>
        <button className="absolute -top-10 right-10 text-36 text-neutral-800 transition-colors" onClick={onClose}>
          &times;
        </button>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
};

export default Modal;