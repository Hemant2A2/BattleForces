import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// Shared tailwind class strings
const CARD_CLASSES = "bg-card p-4 rounded shadow";
const TEXT_HEADING = "text-xl font-semibold mb-2";
const BUTTON_CLASSES = "px-4 py-2 rounded";
const SECTION_MARGIN_BOTTOM = "mb-8";

const TeamSection = () => (
  <section className={SECTION_MARGIN_BOTTOM}>
    <h2 className={TEXT_HEADING}>Your Team Name</h2>
    <input type='text' className="bg-secondary text-secondary-foreground p-2 w-full mb-2 rounded" placeholder='Enter your Team Name'/>
    <button className={`bg-orange-500 text-accent-foreground mr-4 ${BUTTON_CLASSES}`}>Submit Team Name</button>
    <button className={`bg-yellow-500 text-accent-foreground ${BUTTON_CLASSES}`}>Invite Team Mate</button>
  </section>
);

const ParticipantsGrid = ({ participants }) => (
  <section className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${SECTION_MARGIN_BOTTOM}`}>
    {participants.map((participant, index) => (
      <div key={index} className={CARD_CLASSES}>
        <img aria-hidden="true" alt={`${participant} Avatar`} src="/default_user.png" />
        <p className="text-center mt-2">{participant}</p>
      </div>
    ))}
  </section>
);

const OtherParticipants = () => (
  <section className={SECTION_MARGIN_BOTTOM}>
    <h2 className={TEXT_HEADING}>Other Participants:</h2>
    <div className={`${CARD_CLASSES} max-h-40 overflow-y-auto`}>
      <ul className="list-decimal pl-5 space-y-2">
        <li>User x</li>
        <li>User y, User z</li>
        <li>User w, User g</li>
        <li>User u, User tfg, User o</li>
      </ul>
    </div>
  </section>
);

const AddParticipantSection = () => (
  <section className={`${SECTION_MARGIN_BOTTOM} flex`}>
    <div className="flex-1 pr-4">
      <h2 className={TEXT_HEADING}>Add Participant</h2>
      <input type="text" className="border border-border p-2 w-full mb-2" placeholder="Enter Username" />
      <button className={`bg-blue-500 text-accent-foreground ${BUTTON_CLASSES}`}>Send Invite</button>
    </div>
    
    <div className="flex-none w-32">
      <h2 className={TEXT_HEADING}>Room Id:</h2>
      <p className="bg-muted text-muted-foreground text-center p-2 rounded">293hfjdj</p>
    </div>
  </section>
);

const StartContestButton = () => {
  const navigate = useNavigate();
  const contest_id = localStorage.getItem("contest_id");

  const startContest = async (e) => {
    e.preventDefault();

    try {
        const res = await api.post(`/api/contest/problems/${contest_id}`);
        if (res.status === 200) {
            navigate(`/contests/${contest_id}/problems`);
        }
    } catch (error) {
        if (error.response) {
            alert(error.response.data.error || 'something went wrong(in if)');
        } else {
            alert('An error(in else) occurred while generating problems');
        }
    }
  };
  return (
    <button onClick={startContest} className={`bg-red-500 text-primary-foreground ${BUTTON_CLASSES}`}>Start Contest</button>
  )
};

const Participants = () => {
  const participants = ["User 1", "User 2", "User 3"];
  
  return (
    <div className="bg-background text-foreground p-6 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Participants</h1>
      </header>

      <TeamSection />
      <ParticipantsGrid participants={participants} />
      <OtherParticipants />
      <AddParticipantSection />
      <StartContestButton />
    </div>
  );
};

export default Participants;