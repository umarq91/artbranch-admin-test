import React from "react";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  withTransition?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  className,
  type = "button",
  disabled = false,
  loading = false,
  withTransition = false,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`relative flex items-center justify-center overflow-hidden rounded-full bg-[#000000] px-20 py-6 text-sm font-semibold text-[#ffffff] transition-transform duration-200 hover:scale-[1.02] hover:opacity-95 ${
        className || ""
      }`}
      disabled={disabled || loading}
    >
      {/* title transition login */}
      <span
        className={`absolute left-0 right-0 flex items-center justify-center transition-transform duration-700 ease-in-out ${
          loading && withTransition ? "translate-x-[-100%]" : "translate-x-0"
        }`}
      >
        {title}
      </span>
      <span
        className={`absolute left-0 right-0 flex items-center justify-center transition-transform duration-700 ease-in-out ${
          loading ? "translate-x-0" : "translate-x-[100%]"
        }`}
      >
        Loading...
        <svg
          className="ml-2 h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </span>

      {!withTransition && loading && (
        <span className="absolute left-0 right-0 flex items-center justify-center">
          Loading...
        </span>
      )}
    </button>
  );
};

export default Button;
