import React, { useRef, useEffect } from "react";

interface PopupProps {
  children: React.ReactNode;
  onClose: () => void;
  loading: boolean;
  loadingText?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  showOneBtn?: boolean;
  confirmButtonVariant?: "primary" | "red" | "default";
}

const Popup: React.FC<PopupProps> = ({
  children,
  onClose,
  loading,
  loadingText,
  onConfirm,
  confirmText,
  cancelText,
  showOneBtn = false,
  confirmButtonVariant = "primary",
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const confirmButtonClass =
    confirmButtonVariant === "primary"
      ? "bg-primary hover:bg-primary-dark"
      : confirmButtonVariant === "red"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-gray-500 hover:bg-gray-600";

  return (
    <div className="fixed z-50 top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(0,0,0,0.1)]">
      <div
        ref={popupRef}
        className="p-7 rounded bg-white shadow-md md:min-w-[30rem]"
      >
        <div className="mb-5">{children}</div>
        <div className="flex justify-end gap-3">
          {!showOneBtn && (
            <button
              onClick={onClose}
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              {cancelText || ("cancel")}
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`py-2.5 px-5 text-sm font-medium text-white rounded focus:outline-none focus:ring-4 focus:ring-blue-300 ${confirmButtonClass}`}
          >
            {loading ? loadingText || ("Loading...") : confirmText || ("Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
