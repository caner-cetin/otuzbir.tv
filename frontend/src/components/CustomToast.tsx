import React from 'react';
import toast, { Toaster, ToastBar } from 'react-hot-toast';

interface CustomToastProps {
  sprite: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ sprite }) => {
  return (
    <Toaster
      containerStyle={{
        background: 'transparent',
        boxShadow: 'none',
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ message }) => (
            <div
              className={`
                ${t.visible ? 'animate-enter' : 'animate-leave'}
                w-auto min-w-[200px] bg-[#211e20] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5
              `}
            >
              <div className="flex items-center p-1">
                <div className="flex-shrink-0">
                  <img
                    className="h-16 w-16 object-contain"
                    src={sprite}
                    alt="Notification Icon"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-[#e9efec] tracking-wide">
                    {message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.dismiss(t.id)}
                  className="m-1 p-2 rounded-md text-sm font-medium text-[#e9efec] hover:bg-[#504945] focus:outline-none focus:ring-2 focus:ring-[#504945] transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

export default CustomToast;