import React from "react";

const TabButton = ({ active, children, onClick }) => {
    return (
        <button
            className={`px-4 py-2 rounded transition-colors hover:cursor-pointer ${
                active ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default TabButton;
