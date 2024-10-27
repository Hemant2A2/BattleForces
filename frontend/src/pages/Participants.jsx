import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

const CARD_CLASSES = "bg-card p-4 rounded shadow";
const TEXT_HEADING = "text-xl font-semibold mb-2";
const BUTTON_CLASSES = "px-4 py-2 rounded";
const SECTION_MARGIN_BOTTOM = "mb-8";

const AddParticipantSection = ({ socket }) => {
  const [toUser, setToUser] = useState("");

  const handleParticipantInvite = async (e) => {
    e.preventDefault();

    socket.current.send(
      JSON.stringify({
        type: "invite_participant",
        receiver_username: toUser,
      })
    );
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

const StartContestButton = ({ socket, contest_id }) => {
  const startContest = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(`/api/contest/problems/${contest_id}`);
      if (res.status === 200) {
        //navigate(`/contests/${contest_id}/problems`);
        socket.current.send(
          JSON.stringify({
            type: "contest_started",
          })
        );
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
  const navigate = useNavigate();

  const [team, setTeam] = useState(["User 1", "User 2", "User 3"]);
  const [otherParticipants, setOtherParticipants] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [teamMate, setTeamMate] = useState("");

  const [rerender, setRerender] = useState(0);
  const socket = useRef(null);

  const token = localStorage.getItem(ACCESS_TOKEN);
  const decoded = jwtDecode(token);
  const loggedInUser = decoded.username;

  useEffect(() => {
    if (contest_id && !socket.current) {
      socket.current = new WebSocket(
        `${
          import.meta.env.VITE_API_WS
        }/ws/participants/${contest_id}/?token=${token}`
      );

      socket.current.onopen = () => {
        console.log("WebSocket connection opened:", socket.current);
      };

      socket.current.onerror = (e) => {
        console.log("WebSocket error:", e);
      };

      socket.current.onclose = (e) => {
        console.log("WebSocket connection closed", e);
      };
    }
  }, [contest_id]);

  useEffect(() => {
    console.log("socket message event listener");
    if (socket.current) {
      socket.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log("WebSocket message received:", data); // Debugging output

        if (data.type === "get_creator") {
          if (data.creator === loggedInUser) {
            setIsCreator(true);
          }
        }
        if (data.type === "team_mate_invite_message") {
          console.log("team_mate_invite_message");
          if (
            window.confirm(
              `You have been invited to join ${data.sender}'s team`
            )
          ) {
            const to_user = prompt("Enter your username:");
            socket.current.send(
              JSON.stringify({
                type: "team_mate_invite_accepted",
                receiver_username: to_user,
              })
            );
            setRerender(rerender + 1);
            navigate(`/contests/${contest_id}/participants`);
          }
        }
        if (data.type === "participant_invite_message") {
          if (
            window.confirm(
              `You have been invited to join ${data.sender}'s contest`
            )
          ) {
            const to_user = prompt("Enter your username:");
            const teamName = prompt("Enter your team name:");
            socket.current.send(
              JSON.stringify({
                type: "participant_invite_accepted",
                receiver_username: to_user,
                teamName: teamName,
              })
            );
            setRerender(rerender + 1);
            navigate(`/contests/${contest_id}/participants`);
          }
        } 
        if (data.type === "update_participants") {
          //console.log("update_participants");
          // Ensure data has expected properties
          const teamName = data.team.team_name;
          const participants = data.participants;
        
          let other = [];
          participants.forEach((participant) => {
            if (participant.team_name === teamName) {
              setTeam([
                participant.user1_username,
                participant.user2_username,
                participant.user3_username,
              ]);
            } else {
              other.push(participant);
            }
          });
          setOtherParticipants(other);
        } 
        if (data.type === "contest_started_message") {
          navigate(`/contests/${contest_id}/problems`);
        }
      };

      return () => {
        if (socket.current) {
          socket.current.onmessage = null;
        }
      };
    }
  }, [socket, rerender]);

  const handleTeamInvite = async (e) => {
    e.preventDefault();

    console.log("sending invite to team mate");
    socket.current.send(
      JSON.stringify({
        type: "invite_team_mate",
        receiver_username: teamMate,
      })
    );
    setRerender(rerender + 1);
  };

  //console.log(team);
  // console.log(render);

  return (
    <div className="bg-background text-foreground p-6 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Participants</h1>
      </header>

      {/* Team Section */}
      <section className={SECTION_MARGIN_BOTTOM}>
        <h2 className={TEXT_HEADING}>Your Team Name</h2>
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
                {team.team_name} - {team.user1__username},{team.user2__username}
                , {team.user3__username}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {isCreator && <AddParticipantSection socket={socket} />}
      {isCreator && (
        <StartContestButton socket={socket} contest_id={contest_id} />
      )}
    </div>
  );
};

export default Participants;
