import React from "react";
import { useParams } from "react-router-dom";
import CommonNavbar from "../components/CommonNavbar";

const UserProfile = () => {
  const { username } = useParams();
  return (
    <div>
      <CommonNavbar username={username} />
      <Profile username={username} />
      <RecentContests />
      <FindUser />
    </div>
  );
};

const Profile = (props) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900">{props.username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Circular Image Box */}
        <div className="border border-gray-500 p-4 flex items-center justify-center rounded-full h-64 w-64 mx-auto md:mx-0">
          <span className="text-gray-400">Image</span>
        </div>

        {/* Info Section */}
        <div className="md:col-span-2 border border-gray-600 p-6 rounded-lg">
          {[
            { label: "Joined:", value: "5 days ago" },
            { label: "Wins:", value: "0" },
            { label: "Rating:", value: "2000" },
          ].map(({ label, value }) => (
            <p key={label} className="text-gray-600 mb-2">
              {label} <strong className="text-gray-900">{value}</strong>
            </p>
          ))}

          <button className="bg-blue-600 hover:bg-blue-700 text-white mt-4 px-4 py-2 rounded-md transition duration-200 ease-in-out">
            Check Invites
          </button>
        </div>
      </div>
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
  return (
    <div className="border border-gray-300 p-6 mt-6 rounded-lg shadow-lg bg-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Find User:</h2>
      <label className="text-gray-600" htmlFor="username">
        Enter Username:
      </label>
      <input
        id="username"
        type="text"
        className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
        placeholder="Username"
      />
      <button className="bg-blue-600 hover:bg-blue-700 text-white mt-4 px-4 py-2 rounded-md transition duration-200 ease-in-out"> Find </button>
    </div>
  );
};

export default UserProfile;
