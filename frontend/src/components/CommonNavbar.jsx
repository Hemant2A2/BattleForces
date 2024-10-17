import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

const CommonNavbar = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    if(token) {
      const decoded = jwtDecode(token);
      setLoggedInUser(decoded.username);
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
      setLoggedInUser(null);
    }
  },[token]);

  return (
    <div className="bg-gray-800 flex justify-between items-center p-4 shadow-md">
      <div className="flex flex-wrap space-x-4">
        {["Create Contest", "Join Contest", "Contest Given"].map((text) => (
          <button
            key={text}
            onClick={() => {
              if(text === "Create Contest") {
                navigate("/create-contest");
              }
              }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 ease-in-out"
          >
            {text}
          </button>
        ))}
      </div>
      <div className="flex items-center">
        {isLoggedIn && (<span onClick={() => {navigate(`/userProfile/${loggedInUser}`)}} className="text-gray-300 text-sm">{loggedInUser}</span>) }
        <button onClick={() => {navigate('/logout')}}className="bg-red-600 hover:bg-red-700 text-white ml-4 px-4 py-2 rounded-lg transition duration-200 ease-in-out">
          Logout
        </button>
      </div>
    </div>
  );
};

export default CommonNavbar;
