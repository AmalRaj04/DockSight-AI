import React, { useState } from "react";

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  icon = "📄",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <span className="text-xl mr-3">{icon}</span>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        <svg
          className={`w-6 h-6 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}
