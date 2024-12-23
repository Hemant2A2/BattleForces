import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Profile = (props) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/view-profile/${props.username}/`);
        if (response.status === 404) {
          navigate("/");
        }
        const data = response.data;
        setProfileData(data);
        setLoading(false);

        // Check if logged-in user is the same as profile's handle
        if (props.username === props.loggedInUser) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [props.username, props.loggedInUser]);

  const handleFileChange = (e) => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]); // Set the selected file
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const response = await api.put("/api/update-profile/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 403) {
          navigate("/");
        }
        alert("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error updating profile picture:", error);
        alert("Failed to update profile picture.");
      }
    }
  };

  const checkInvites = () => {
    navigate(`/userProfile/invites/${props.username}`);
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900">{props.username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Image Box and Upload Button */}
        <div className="flex flex-col items-center">
          <div className="border border-gray-500 p-4 flex items-center justify-center rounded-full h-64 w-64 mx-auto">
            <img
              src={`${import.meta.env.VITE_API_URL}${profileData.image}`}
              alt="Profile Image"
              className="object-cover h-full w-full rounded-full"
            />
          </div>

          {/* Upload Button */}
          {isOwner && (
            <div className="flex flex-col items-center mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2"
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
                onClick={handleUpload}
                disabled={!selectedFile}
              >
                Upload Profile Picture
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="md:col-span-2 border border-gray-600 p-6 rounded-lg">
          {[
            { label: "Joined:", value: formatRelativeTime(profileData.joined) },
            { label: "Wins:", value: profileData.wins },
            { label: "Codeforces_Rating:", value: profileData.rating },
            {
              label: "In_Contest:",
              value: profileData.in_contest ? "yes" : "no",
            },
          ].map(({ label, value }) => (
            <p key={label} className="text-gray-600 mb-2">
              {label} <strong className="text-gray-900">{value}</strong>
            </p>
          ))}

          {isOwner && (
            <button
              onClick={checkInvites}
              className="bg-blue-600 hover:bg-blue-700 text-white mt-4 px-4 py-2 rounded-md transition duration-200 ease-in-out"
            >
              Check Invites
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
