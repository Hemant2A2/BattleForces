import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../index.css";

const SubmitHandle = () => {

    const [handle, setHandle] = useState('');
    const navigate = useNavigate();

    const submitHandle = async (e) => {
        e.preventDefault();
        
        try {
            const res = await api.post('/api/submit-handle/', {handle});
            if(res.status === 200) {
                sessionStorage.setItem('handle', handle);
                //alert(res.data.message);
                navigate('/verify-handle');
            }
        }
        catch (error) {
            console.error('Error during submitting', error);  
            if (error.response) {
                alert(error.response.data.error || 'something went wrong(in if)');
            } else {
                alert('An error(in else) occurred while submitting the handle.');
            }
        }

    };

  return (
    <form onSubmit={submitHandle} className="submit-handle-container">
    <h1>Enter Your Codeforces Handle</h1>
    <input 
      className="submit-handle-input"
      type="text" 
      placeholder="Codeforces Handle" 
      value={handle} 
      onChange={(e) => setHandle(e.target.value)} 
    />
    <button className="submit-handle-button">Submit</button>
    </form>
  )
}

export default SubmitHandle
