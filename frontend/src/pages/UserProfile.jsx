import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../components/Profile";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";

const UserProfile = () => {
  const { username } = useParams();
  const token = localStorage.getItem(ACCESS_TOKEN);
  const decoded = jwtDecode(token);
  const loggedInUser = decoded.username;
  
  return (
    <div>
      <Profile username={username} loggedInUser={loggedInUser} />
      <RecentContests />
      <FindUser />
    </div>
  );
};

const RecentContests = () => {
  return (
    <div className="border border-gray-300 p-6 mt-6 rounded-lg shadow-md bg-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recent Contests:
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        {["Contest 1", "Contest 2", "Contest 3", "...."].map((contest) => (
          <li
            key={contest}
            className="text-gray-700 hover:text-blue-600 transition duration-200 ease-in-out cursor-pointer"
          >
            {contest}
          </li>
        ))}
      </ul>
    </div>
  );
};

const FindUser = () => {
  const [searchUser, setSearchUser] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/api/view-profile/${searchUser}`);
      if (res.status === 200) {
        navigate(`/userProfile/${searchUser}`);
      }
      else {
        navigate('/');
      }
    } catch (error) {
      navigate('/');
      if (error.response) {
        alert(error.response.data.error || 'something went wrong(in profile if)');
    } else {
        alert('An error(in else) occurred while getting profile');
    }
    }
    
  };

  return (
    <div className="border border-gray-300 p-6 mt-6 rounded-lg shadow-lg bg-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Find User:</h2>
      <label className="text-gray-600" htmlFor="username">
        Enter Username:
      </label>
      <input
        id="username"
        type="text"
        value={searchUser}
        onChange={(e) => {setSearchUser(e.target.value);}}
        className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
        placeholder="Username"
      />
      <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white mt-4 px-4 py-2 rounded-md transition duration-200 ease-in-out">
        Find
      </button>
    </div>
  );
};

export default UserProfile;
