// src/components/CreatePassword.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreatePassword = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submitPassword  = async (e) => {
    e.preventDefault();

    try {
        const res = await api.post('/api/create-password/', { password });
        alert(res.data.message);
        navigate('/');
    } catch (error) {
        console.error('Error during password creation', error);  // Log the error
        if (error.response) {
            alert(error.response.data.error || 'something went wrong while creating password');
        } else {
            alert('An error occurred while creating password.');
        }
    }

  };

  return (
    <div>
      <h1>Create a Password</h1>
      <input 
        type="password" 
        placeholder="Enter your password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={submitPassword}>Submit</button>
    </div>
  );
};

export default CreatePassword;
