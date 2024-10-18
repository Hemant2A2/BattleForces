import React from 'react';
import ContestNavbar from '../components/ContestNavbar';

const commonBorderClasses = 'border border-border px-4 py-2';

const Standings = () => {
  const standingsData = [
    { rank: 1, teamName: 'Team Alpha', solveCount: 4, penalty: 10, solutions: ['✅', '✅', '❌', '✅'] },
    { rank: 2, teamName: 'Team Beta', solveCount: 3, penalty: 15, solutions: ['✅', '✅', '✅', '❌'] },
  ];

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <ContestNavbar />
      <table className="min-w-full table-auto border border-border">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            {['Rank', 'Team Name', 'Solve Count', 'Penalty', 'A', 'B', 'C', 'D'].map((header) => (
              <th key={header} className={commonBorderClasses}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standingsData.map((row, index) => (
            <StandingsRow key={index} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StandingsRow = ({ row }) => {
  return (
    <tr className="bg-card-foreground">
      <td className={commonBorderClasses}>{row.rank}</td>
      <td className={commonBorderClasses}>{row.teamName}</td>
      <td className={commonBorderClasses}>{row.solveCount}</td>
      <td className={commonBorderClasses}>{row.penalty}</td>
      {row.solutions.map((solution, index) => (
        <td key={index} className={commonBorderClasses}>{solution}</td>
      ))}
    </tr>
  );
};

export default Standings;