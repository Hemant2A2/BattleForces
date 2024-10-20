import React, { useState } from 'react';

const COMMON_CLASSES = 'flex justify-between items-center';
const BUTTON_CLASSES = 'p-2 rounded';
const PUBLIC_CONTESTS = [
  "contest 1",
  "contest 2",
  "contest 3",
  "contest 4",
  "contest 5",
  "contest 6",
  "contest 7",
  "contest 8",
  "contest 9",
  "contest 10",
];

const ContestItem = ({ contestName }) => (
  <li className={COMMON_CLASSES}>
    <span className="text-muted-foreground">{contestName}</span>
    <button className={`bg-red-500 mb-4 text-secondary-foreground ${BUTTON_CLASSES}`}>Join</button>
  </li>
);

const PublicContests = () => (
  <div className="bg-gray-200 w-full md:w-1/2 bg-muted rounded-lg p-6 space-y-4">
    <h2 className="text-xl font-bold text-primary">Public Contests</h2>
    <ul className="space-y-2">
      {PUBLIC_CONTESTS.map((contest, index) => (
        <ContestItem key={index} contestName={`${index + 1}) ${contest}`} />
      ))}
    </ul>
  </div>
);

const PrivateContests = () => {
  const [roomId, setRoomId] = useState('');

  const handleJoinClick = () => {
    // Handle join logic here
    console.log(`Joining room with ID: ${roomId}`);
  };

  return (
    <div className="bg-gray-200 w-full md:w-1/2 bg-muted rounded-lg p-6 space-y-4 flex flex-col h-auto md:min-h-[300px]">
      <h2 className="text-lg font-bold text-primary">Private Contests</h2>
      <h3 className="text-lg font-semibold text-primary">Join with Room ID</h3>
      <input
        type="text"
        placeholder="Enter Room ID"
        className="border-2 border-border p-2 w-full rounded"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        className={`bg-red-500 text-accent-foreground ${BUTTON_CLASSES} w-full`}
        onClick={handleJoinClick}
      >
        Join
      </button>
    </div>
  );
};

const JoinContest = () => (
  <div className="flex flex-col md:flex-row justify-center items-start p-6 bg-background dark:bg-card space-y-6 md:space-y-0 md:space-x-6">
    <PublicContests />
    <div className="hidden md:block border-l border-border h-full"></div>
    <PrivateContests />
  </div>
);

export default JoinContest;