import React, { useEffect, useState } from "react";
import ContestNavbar from "../components/ContestNavbar";
import api from "../api";

const sharedTableCellClasses = "p-4 border-b border-border";

const ProblemTableRow = ({ problem }) => (
  <tr>
    <td className={sharedTableCellClasses}>{problem.problem_name}</td>
    <td className={sharedTableCellClasses}>
      <a
        href={problem.problem_link}
        className="text-blue-500 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {problem.problem_link}
      </a>
    </td>
  </tr>
);

const Problems = () => {
  const default_problems = [
    { problem_name: "A", problem_link: "url1" },
    { problem_name: "B", problem_link: "url2" },
    { problem_name: "C", problem_link: "url3" },
  ];

  const [problems, setProblems] = useState(default_problems);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchContestData = async () => {
      const contest_id = localStorage.getItem("contest_id");
      try {
        const res = await api.get(`/api/contest/problems/${contest_id}`);
        if (res.status === 200) {
          const { problems, start_time, duration } = res.data;
          setProblems(problems);

          const endTime = new Date(
            new Date(start_time).getTime() + duration * 3600 * 1000
          );

          const updateCountdown = () => {
            const now = new Date();
            const difference = endTime - now;

            if (difference > 0) {
              const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((difference / (1000 * 60)) % 60);
              const seconds = Math.floor((difference / 1000) % 60);
              setTimeLeft({ hours, minutes, seconds });
            } else {
              setTimeLeft(null);
            }
          };

          updateCountdown();
          const timerId = setInterval(updateCountdown, 1000);

          return () => clearInterval(timerId);
        }
      } catch (error) {
        if (error.response) {
          alert(
            error.response.data.error ||
              "An error occurred while fetching contest data."
          );
        } else {
          alert("An error occurred while getting contest data.");
        }
      }
    };

    fetchContestData();
  }, []);

  return (
    <div className="text-foreground p-6 rounded-lg shadow-md">
      <ContestNavbar />
      {timeLeft ? (
        <div className="bg-gray-100 text-center p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Time Left</h2>
          <div className="text-lg font-mono">
            {String(timeLeft.hours).padStart(2, "0")}:
            {String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
        </div>
      ) : (
        <div className="text-red-500 font-semibold text-center mt-4">
          Contest has ended.
        </div>
      )}
      <table className="min-w-full bg-card border-collapse mb-4">
        <thead>
          <tr>
            <th className="text-left p-4 border-b border-border">
              Problem Name
            </th>
            <th className="text-left p-4 border-b border-border">
              Problem Link
            </th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <ProblemTableRow key={index} problem={problem} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Problems;
