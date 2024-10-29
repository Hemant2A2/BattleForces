import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

const InviteForTeam = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [roomId, setRoomId] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await api.get(`/api/invite-team-mate/`, { username });
        if (res.status === 200) {
          const data = res.data;
          setMessages(data.messages);
          setTeamName(data.team_name);
          setRoomId(data.room_id);
        }
      } catch (error) {
        if (error.response) {
          alert(
            error.response.data.error ||
              "Something went wrong while fetching team invites."
          );
        } else {
          alert("An error occurred while getting team invites.");
        }
      }
    };

    fetchInvites();
  }, []);

  const handleAccept = async (e, index) => {
    e.preventDefault();
    const room_id = roomId[index];
    const team_name = teamName[index];

    try {
      const res = await api.post("/api/join-contest-team-mate/", {
        team_name,
        room_id,
      });
      if (res.status === 200) {
        localStorage.setItem("contest_id", res.data.contest_id);
        navigate(`/contests/${res.data.contest_id}/participants`);
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.error ||
            "Something went wrong while accepting the team invite."
        );
      } else {
        alert("An error occurred while joining contest with team invite.");
      }
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Team Invites
      </h2>
      {messages.length === 0 ? (
        <div className="text-gray-600">No invites for team mate</div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
            >
              <span className="text-gray-700">{message.message}</span>
              <button
                onClick={(e) => handleAccept(e, index)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InviteForParticipant = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [room_id, setRoomId] = useState([]);
  const [copyStatus, setCopyStatus] = useState(false);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await api.get(`/api/invite-participant/`, { username });
        setMessages(res.data.messages);
        setRoomId(res.data.room_id);
      } catch (error) {
        if (error.response) {
          alert(
            error.response.data.error ||
              "Something went wrong while fetching participant invites."
          );
        } else {
          alert("An error occurred while getting participant invites.");
        }
      }
    };

    fetchInvites();
  }, []);

  const onCopyText = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000); // Reset status after 2 seconds
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Participant Invites
      </h2>
      {messages.length === 0 ? (
        <div className="text-gray-600">No invites for participant</div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg flex flex-col"
            >
              <span className="text-gray-700">{message.message}</span>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-700">{room_id[index]}</span>
                <CopyToClipboard text={room_id[index]} onCopy={onCopyText}>
                  <button className="bg-gray-200 text-gray-600 py-1 px-3 rounded-lg hover:bg-gray-300 transition mt-2">
                    Copy Room ID
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          ))}
          {copyStatus && (
            <div className="text-green-600 mt-2">{copyStatus}</div>
          )}
        </div>
      )}
    </div>
  );
};

const Invites = () => {
  const { username } = useParams();

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <InviteForTeam username={username} />
      <InviteForParticipant username={username} />
    </div>
  );
};

export default Invites;
