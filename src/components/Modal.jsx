const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-blackPrimary/50 backdrop-blur-xs flex justify-center items-center z-50">
        <div className="border-1 bg-blackPrimary border-grayPrimary/25 p-6 rounded max-w-lg lg:max-w-xl w-full relative m-4">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-xl font-bold cursor-pointer hover:bg-redSecondary duration-150 bg-redPrimary rounded-full w-8 h-8 z-60"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;
  