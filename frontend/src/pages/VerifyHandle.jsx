// src/components/ProblemPage.js
import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/generate-verification-problem/')
    .then((res) => {
        setProblem(res.data);
        sessionStorage.setItem('problem_id', JSON.stringify(res.data.id));
    })
    .catch((error) => {
        alert(error);
        console.log("error from problem page use effect");
    });
  }, []);

  const verifySolution = async () => {
    const handle = sessionStorage.getItem('handle'); 
    const problem_id = sessionStorage.getItem('problem_id');
    console.log(problem_id);
    if (!handle) {
        alert('Handle not found! Please submit your Codeforces handle.');
        return;
    }

    try {
        const res = await api.post('/api/verify-solution/', { handle , problem_id});
        if(res.status === 200) {
            sessionStorage.setItem('verified', true);
            navigate('/create-password');
        }
    } catch (error) {
        sessionStorage.setItem('verified', false);
        console.error('Error during solution verification:', error); 
        if (error.response) {
            alert(error.response.data.error || 'something went wrong(in if)');
        } else {
            alert('An error(in else) occurred while verifying the solution.');
        }
        navigate('/submit-handle');
    }

  };

  return (
    <div className='verify-container'>
      <h1>Submit a code to this problem which gives verdict "COMPILATION ERROR"</h1>
      {problem && <a href={problem.problem_url} target="_blank">Problem</a>}
      <button onClick={verifySolution} className='verify-button'>Verify Solution</button>
    </div>
  );
};

export default ProblemPage;
