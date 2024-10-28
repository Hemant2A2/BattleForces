import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

const CARD_CLASSES = "bg-card p-4 rounded shadow";
const TEXT_HEADING = "text-xl font-semibold mb-2";
const BUTTON_CLASSES = "px-4 py-2 rounded";
const SECTION_MARGIN_BOTTOM = "mb-8";

const AddParticipantSection = ({contest_id}) => {
  const [toUser, setToUser] = useState("");

  const handleParticipantInvite = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(`/api/invite-participant/`, {toUser, contest_id});
      if (res.status === 200) {
        alert("Invite sent successfully");
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.error ||
            "something went wrong(in add participants if)"
        );
      } else {
        alert("An error(in else) occurred while sending invite to participant");
      }
    }

  };

  return (
    <>
      <section className={`${SECTION_MARGIN_BOTTOM} flex`}>
        <div className="flex-1 pr-4">
          <h2 className={TEXT_HEADING}>Add Participant</h2>
          <input
            type="text"
            className="border border-border p-2 w-full mb-2"
            placeholder="Enter Username"
            value={toUser}
            onChange={(e) => setToUser(e.target.value)}
          />
          <button
            onClick={handleParticipantInvite}
            className={`bg-blue-500 text-accent-foreground ${BUTTON_CLASSES}`}
          >
            Send Invite
          </button>
        </div>

        {/* <div className="flex-none w-32">
          <h2 className={TEXT_HEADING}>Room Id:</h2>
          <p className="bg-muted text-muted-foreground text-center p-2 rounded">
            293hfjdj
          </p>
        </div> */}
      </section>
    </>
  );
};

const StartContestButton = ({ contest_id }) => {
  const navigate = useNavigate();
  const startContest = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(`/api/contest/problems/${contest_id}`);
      if (res.status === 200) {
        // hasStarted.current = true;
        // console.log(hasStarted.current);
        navigate(`/contests/${contest_id}/problems`);
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.error ||
            "something went wrong(in participants if)"
        );
      } else {
        alert("An error(in else) occurred while generating problems");
      }
    }
  };
  return (
    <button
      onClick={startContest}
      className={`bg-red-500 text-primary-foreground ${BUTTON_CLASSES}`}
    >
      Start Contest
    </button>
  );
};

const Participants = () => {
  const contest_id = localStorage.getItem("contest_id");
  const [team, setTeam] = useState(["User 1", "User 2", "User 3"]);
  const [teamName, setTeamName] = useState("");
  const [otherParticipants, setOtherParticipants] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [teamMate, setTeamMate] = useState("");

  const hasStarted = useRef(false);

  const token = localStorage.getItem(ACCESS_TOKEN);
  const decoded = jwtDecode(token);
  const loggedInUser = decoded.username;

  useEffect(() => {
    
    const fetchParticipants = async () => {
      try {
        const res = await api.get(`api/contest/participants/${contest_id}`);
        if (res.status === 200) {
          const data = res.data;
          setIsCreator(data.creator === loggedInUser);
          setTeam(data.team);
          setTeamName(data.team_name);
          setOtherParticipants(data.other_participants);
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error || "something went wrong(in participants if)");
        } else {
          alert("An error(in else) occurred while getting participants");
        }
      }
    };

    fetchParticipants();

  },[loggedInUser]);


  useEffect(() => {
    const go = () => {
      const navigate = useNavigate();
      navigate(`/contests/${contest_id}/problems`);
    }
    if (hasStarted.current) {
      go();
    }
  },[hasStarted]);

 
  const handleTeamInvite = async (e) => {
    e.preventDefault();

    try {
      console.log(teamMate);
      const res = await api.post(`/api/invite-team-mate/`, {teamMate, contest_id});
      if (res.status === 200) {
        alert("Invite sent successfully");
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.error ||
            "something went wrong(in add team_mate if)"
        );
      } else {
        console.log(error);
        alert("An error(in else) occurred while sending invite to team_mate");
      }
    }
  };

  return (
    <div className="bg-background text-foreground p-6 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Participants</h1>
      </header>

      {/* Team Section */}
      <section className={SECTION_MARGIN_BOTTOM}>
        <h2 className={TEXT_HEADING}>{teamName}</h2>
        <input
          type="text"
          className="bg-secondary text-secondary-foreground p-2 w-full mb-2 rounded"
          placeholder="Enter Teammate's Username"
          value={teamMate}
          onChange={(e) => setTeamMate(e.target.value)}
        />
        <button
          onClick={handleTeamInvite}
          className={`bg-yellow-500 text-accent-foreground ${BUTTON_CLASSES}`}
        >
          Invite Team Mate
        </button>
      </section>

      {/* Participants Section */}
      <section
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${SECTION_MARGIN_BOTTOM}`}
      >
        {team.map((participant, index) => (
          <div key={index} className={CARD_CLASSES}>
            <img
              aria-hidden="true"
              alt={`${participant} Avatar`}
              src="/default_user.png"
            />
            <p className="text-center mt-2">{participant}</p>
          </div>
        ))}
      </section>

      {/* Other Participants Section */}
      <section className={SECTION_MARGIN_BOTTOM}>
        <h2 className={TEXT_HEADING}>Other Participants:</h2>
        <div className={`${CARD_CLASSES} max-h-40 overflow-y-auto`}>
          {/* the list needs to be dynamic based on the data in the participants table in the database */}
          <ul className="list-decimal pl-5 space-y-2">
            {otherParticipants.map((team, index) => (
              <li key={index}>
                {team.team_name} - {team.user1}  {team.user2}  {team.user3}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {isCreator && <AddParticipantSection contest_id={contest_id} />}
      {isCreator && (
        <StartContestButton contest_id={contest_id} />
      )}
    </div>
  );
};

export default Participants;
