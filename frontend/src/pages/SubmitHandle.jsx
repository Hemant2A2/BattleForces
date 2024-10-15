import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

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
            console.error('Error during submitting', error);  // Log the error
            if (error.response) {
                alert(error.response.data.error || 'something went wrong(in if)');
            } else {
                alert('An error(in else) occurred while submitting the handle.');
            }
        }

    };

  return (
    <div>
    <h1>Submit Your Codeforces Handle</h1>
    <input 
      type="text" 
      placeholder="Codeforces Handle" 
      value={handle} 
      onChange={(e) => setHandle(e.target.value)} 
    />
    <button onClick={submitHandle}>Submit</button>
    </div>
  )
}

export default SubmitHandle
