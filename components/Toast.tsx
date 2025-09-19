import React, { useEffect } from 'react';
import { ToastMessage } from '../context/ToastContext';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import XIcon from './icons/XIcon';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
  autoDismissTimeout?: number;
}

const toastStyles = {
  success: {
    bg: 'bg-green-500',
    icon: <CheckCircleIcon className="w-6 h-6 text-white" />,
  },
  error: {
    bg: 'bg-red-500',
    icon: <XCircleIcon className="w-6 h-6 text-white" />,
  },
};

const Toast: React.FC<ToastProps> = ({ toast, onRemove, autoDismissTimeout = 5000 }) => {
  const { id, message, type } = toast;
  const styles = toastStyles[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, autoDismissTimeout);

    return () => {
      clearTimeout(timer);
    };
  }, [id, onRemove, autoDismissTimeout]);

  return (
    <div
      className={`relative w-full max-w-sm rounded-md shadow-lg pointer-events-auto flex ${styles.bg}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-center p-4">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-white">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => onRemove(id)}
            className="inline-flex rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
