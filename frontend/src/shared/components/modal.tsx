import clsx from "clsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}
const Modal = ({ isOpen, onClose, children,className }: Props) => {
  return (
    <div
      className={clsx(
        `fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center`,
        isOpen ? "block" : "hidden",
      )}
      onClick={onClose}
    >
      <div
        className={
            clsx("bg-white p-4 rounded-lg w-1/2", className)
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
