import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  disabled,
  className,
}: ButtonProps) {
  return (
    <button
      className={`w-full py-2 px-4 rounded-lg transition-colors ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#aa87e5] hover:bg-[#aa87e5]"
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
