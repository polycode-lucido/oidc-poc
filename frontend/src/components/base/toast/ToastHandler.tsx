import React from 'react';
import { Flip, ToastContainer } from 'react-toastify';

export default function ToasterHandler() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      transition={Flip}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      limit={3}
    />
  );
}
