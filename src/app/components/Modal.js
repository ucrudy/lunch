'use client'
import React from "react";
import { useAppContext } from "./AppContext";

const Modal = () => {
  const { isModalOpen, closeModal } = useAppContext();

  if (!isModalOpen) return null;

  return (
    <div style={modalStyles}>
      <div style={modalContentStyles}>
        <h2>Donate</h2>
        <p><b>paypal:</b> supercop104@yahoo.com</p>
        <p><b>cash app:</b> $drewwwwwew</p>
        <button onClick={closeModal}>Close Modal</button>
      </div>
    </div>
  );
};

const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyles = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "5px",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
};

export default Modal;
