import React from "react";
import FormField from "../components/FormField";
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const CreateContest = () => {
  const [numberOfProblems, setNumberOfProblems] = useState(1);
  const [duration, setDuration] = useState(1);
  const [contestName, setContestName] = useState("");
  const [publicContest, setPublicContest] = useState(true);
  const [minRating, setMinRating] = useState(800);
  const [maxRating, setMaxRating] = useState(3500);
  const [teamName, setTeamName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("api/create-contest/", {
        numberOfProblems,
        duration,
        contestName,
        publicContest,
        minRating,
        maxRating,
        teamName
      });
      if (res.status === 200) {
        alert("Contest created successfully");
        let contest_id = res.data.contest_id;
        localStorage.setItem("contest_id", contest_id);
        navigate(`/contests/${contest_id}/participants`);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || "something went wrong(in if)");
      } else {
        alert("An error(in else) occurred while creating contest");
      }
    }
  };

  return (
    <>
      <div className="bg-gray-300 flex flex-col items-center justify-center min-h-screen bg-background p-8">
        <h1 className="text-3xl font-semibold text-foreground mb-6">
          Create Contest
        </h1>

        <form
          className="bg-blue-300 bg-card rounded-lg shadow-lg p-6 space-y-4 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <FormField
            label="Number of Problems:"
            type="number"
            placeholder="Enter number of problems"
            value={numberOfProblems}
            onChange={(e) => setNumberOfProblems(e.target.value)}
          />
          <FormField
            label="Duration:"
            type="number"
            placeholder="Enter duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <FormField
            label="Contest Name:"
            type="text"
            placeholder="Enter contest name"
            value={contestName}
            onChange={(e) => setContestName(e.target.value)}
          />

          <div className="flex items-center">
            <label className={`text-muted-foreground mr-2`}>Public:</label>
            <input
              type="radio"
              name="public"
              value="yes"
              onClick={() => setPublicContest(true)}
              className="mr-1"
              id="public-yes"
            />
            <label htmlFor="public-yes" className="mr-3">
              Yes
            </label>

            <input
              type="radio"
              name="public"
              value="no"
              onClick={() => setPublicContest(false)}
              className="mr-1"
              id="public-no"
            />
            <label htmlFor="public-no">No</label>
          </div>

          <div className="flex flex-col">
            <label className="text-muted-foreground">Select Min Rating</label>
            <input
              type="number"
              className="bg-gray-500 border border-border rounded-lg p-2 focus:ring focus:ring-ring"
              placeholder="Enter min rating for a problem (eg: 800)"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              min={800}
              max={3500}
              step={100}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-muted-foreground">Select Max Rating</label>
            <input
              type="number"
              className="bg-gray-500 border border-border rounded-lg p-2 focus:ring focus:ring-ring"
              placeholder="Enter max rating for a problem (eg: 800)"
              value={maxRating}
              onChange={(e) => setMaxRating(e.target.value)}
              min={800}
              max={3500}
              step={100}
            />
          </div>

          <FormField
            label="Team Name:"
            type="text"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <button
            type="submit"
            className="bg-red-500 bg-primary text-primary-foreground rounded-lg p-2 w-full hover:bg-primary/80"
          >
            Generate Contest
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateContest;
