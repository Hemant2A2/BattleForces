// src/components/ProblemPage.js
import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/generate-problem/')
    .then((res) => {
        console.log(res.data);
        setProblem(res.data);
    })
    .catch((error) => {
        alert(error);
    });
  }, []);

  const verifySolution = async () => {
    const handle = sessionStorage.getItem('handle'); 
    if (!handle) {
        alert('Handle not found! Please submit your Codeforces handle.');
        return;
    }

    try {
        const res = await api.post('/api/verify-solution/', { handle });
        if(res.status === 200) {
            navigate('/create-password');
        }
    } catch (error) {
        console.error('Error during solution verification:', error);  // Log the error
        if (error.response) {
            alert(error.response.data.error || 'Incorrect Solution');
        } else {
            alert('An error occurred while verifying the solution.');
        }
    }

  };

  return (
    <div>
      <h1>Solve this problem within 5 minutes:</h1>
      {problem && <a href={problem.problem_url} target="_blank">Solve Problem</a>}
      <button onClick={verifySolution}>Verify Solution</button>
    </div>
  );
};

export default ProblemPage;
