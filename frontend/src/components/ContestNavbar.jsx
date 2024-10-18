import React from "react";
import { useNavigate } from "react-router-dom";

const sharedButtonClasses =
  "bg-orange-500 p-2 mr-4 ml-4 rounded-lg hover:bg-opacity-80";

const ContestNavbar = () => {
    const contest_id = localStorage.getItem("contest_id");
    const navigate = useNavigate();

  return (
    <div className="mb-4">
      <button
        onClick={() => navigate(`/contests/${contest_id}/problems`)}
        className={`bg-primary text-primary-foreground ${sharedButtonClasses}`}
      >
        Problems
      </button>
      <button
        onClick={() => navigate(`/contests/${contest_id}/standings`)}
        className={`bg-secondary text-secondary-foreground ${sharedButtonClasses}`}
      >
        Standings
      </button>
    </div>
  );
};

export default ContestNavbar;
