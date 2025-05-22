// components/DeleteModal.jsx
import React from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm, message = "Are you sure you want to delete this?" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 lg:pl-72 z-50 bg-blackPrimary/25 backdrop-blur-xs flex items-center justify-center text-xs">
      <div className="bg-blackPrimary border-grayPrimary border-1 rounded-xl p-6 w-full mx-4 max-w-sm text-center">
        <p className="text-sm mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded duration-150 cursor-pointer border-blackSecondary border-1 hover:border-grayPrimary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-redPrimary rounded hover:bg-redSecondary duration-150 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
