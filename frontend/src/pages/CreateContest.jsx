import React from 'react';
import FormField from '../components/FormField';
import { useState } from 'react';

const CreateContest = () => {
  const [numberOfProblems, setNumberOfProblems] = useState(0);
  const [duration, setDuration] = useState(0);
  const [contestName, setContestName] = useState('');
  const [publicContest, setPublicContest] = useState('yes');
  const [teamName, setTeamName] = useState('');
  
  return (
    <>
    <div className="bg-gray-300 flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <h1 className="text-3xl font-semibold text-foreground mb-6">Create Contest</h1>
      
      <form className="bg-blue-300 bg-card rounded-lg shadow-lg p-6 space-y-4 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
        <FormField label="Number of Problems:" type="number" placeholder="Enter number of problems" value={numberOfProblems} />
        <FormField label="Duration:" type="text" placeholder="Enter duration" value={duration} />
        <FormField label="Contest Name:" type="text" placeholder="Enter contest name" value={contestName} />

        <div className="flex items-center">
          <label className={`text-muted-foreground mr-2`}>Public:</label>
          <input type="radio" name="public" value="yes" className="mr-1" id="public-yes" />
          <label htmlFor="public-yes" className="mr-3">Yes</label>
          
          <input type="radio" name="public" value="no" className="mr-1" id="public-no" />
          <label htmlFor="public-no">No</label>
        </div>

        <FormField label="Team Name:" type="text" placeholder="Enter team name" value={teamName} />

        <button type="submit" className="bg-red-500 bg-primary text-primary-foreground rounded-lg p-2 w-full hover:bg-primary/80">
          Generate Contest
        </button>
      </form>
    </div>
    </>
  );
};

export default CreateContest;