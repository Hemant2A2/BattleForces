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
      >
        {problem.problem_link}
      </a>
    </td>
  </tr>
);

const Problems = () => {
  let default_problems = [
    { problem_name: "A", problem_link: "url1" },
    { problem_name: "B", problem_link: "url2" },
    { problem_name: "C", problem_link: "url3" },
  ];

  const [problems, setProblems] = useState(default_problems);

  useEffect(() => {
    const fetchProblems = async () => {
      const contest_id = localStorage.getItem("contest_id");
      try {
        const res = await api.get(`/api/contest/problems/${contest_id}`);
        if (res.status === 200) {
          setProblems(res.data);
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error || "something went wrong(in problems if)");
        } else {
          alert("An error(in else) occurred while getting problems");
        }
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="text-foreground p-6 rounded-lg shadow-md">
      <ContestNavbar />
      <table className="min-w-full bg-card border-collapse">
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
