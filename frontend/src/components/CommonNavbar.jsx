import React from "react";

const CommonNavbar = (props) => {
  return (
    <div className="bg-gray-800 flex justify-between items-center p-4 shadow-md">
      <div className="flex flex-wrap space-x-4">
        {["Create Contest", "Join Contest", "Contest Given"].map((text) => (
          <button
            key={text}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 ease-in-out"
          >
            {text}
          </button>
        ))}
      </div>
      <div className="flex items-center">
        <span className="text-gray-300 text-sm">{props.username}</span>
        <button className="bg-red-600 hover:bg-red-700 text-white ml-4 px-4 py-2 rounded-lg transition duration-200 ease-in-out">
          Logout
        </button>
      </div>
    </div>
  );
};

export default CommonNavbar;
