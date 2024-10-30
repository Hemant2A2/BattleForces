import {useEffect, useState} from 'react';
import ContestNavbar from '../components/ContestNavbar';
import api from '../api';

const commonBorderClasses = 'border border-border px-4 py-2';

const Standings = () => {
  const [standingsData, setStandingsData] = useState([]);
  const [columns, setColumns] = useState( ['Rank','Team Name', 'Solve Count', 'Penalty']);
  const contest_id = localStorage.getItem('contest_id');

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await api.put(`api/contest/standings/${contest_id}`);
        setStandingsData(res.data);
        console.log(res.data);
        let sols = res.data[0].solutions;
        
        let size = sols.length;
        let temp = ['Rank','Team Name', 'Solve Count', 'Penalty']
        for (let i = 0; i < size; i++) {
          temp.push(String.fromCharCode(65 + i));
        }
        setColumns(temp);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStandings();
  },[]);

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <ContestNavbar />
      <table className="min-w-full table-auto border border-border">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            {columns.map((header) => (
              <th key={header} className={commonBorderClasses}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standingsData.map((row, index) => (
            <StandingsRow rank={index + 1} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StandingsRow = ({ row, rank }) => {
  return (
    <tr className="bg-card-foreground">
      <td className={commonBorderClasses}>{rank}</td>
      <td className={commonBorderClasses}>{row.team_name}</td>
      <td className={commonBorderClasses}>{row.solve_count}</td>
      <td className={commonBorderClasses}>{row.penalty}</td>
      {row.solutions.map((solution, index) => (
        <td key={index} className={commonBorderClasses}>{solution}</td>
      ))}
    </tr>
  );
};

export default Standings;