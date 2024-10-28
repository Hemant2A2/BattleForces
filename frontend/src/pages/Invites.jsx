import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";

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
              "something went wrong(in invite team_mate page if)"
          );
        } else {
          alert("An error(in else) occurred while getting invites");
        }
      }
    };

    fetchInvites();
  }, []);

  const handleAccept = async (e, index) => {
    e.preventDefault();
    const room_id = roomId[index];

    try {
      const res = await api.post("/api/join-contest-team-mate/", {
        teamName,
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
            "something went wrong(in team invite accept button if)"
        );
      } else {
        alert(
          "An error(in else) occurred while joining contest using team invite"
        );
      }
    }
  };

  return (
    <div>
      <div>
        <h1>Team Invites</h1>
        {messages.length === 0 ? (
          <div>No invites for team mate</div>
        ) : (
          <div>
            {messages.map((message, index) => (
              <div key={index}>
                <div>
                  <div>
                    {message.message}
                    <button
                      onClick={(e) => {
                        handleAccept(e, index);
                      }}
                      className="bg-blue-300"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const InviteForParicipant = ({ username }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await api.get(`/api/invite-participant/`, { username });
        setMessages(res.data);
      } catch (error) {
        if (error.response) {
          alert(
            error.response.data.error ||
              "something went wrong(in invite participants page if)"
          );
        } else {
          alert("An error(in else) occurred while getting invites");
        }
      }
    };

    fetchInvites();
  }, []);

  return (
    <div>
      <div>
        <h1>Particpant Invites</h1>
        {messages.length === 0 ? (
          <div>No invites for participant</div>
        ) : (
          <div>
            {messages.map((message, index) => (
              <div key={index}>
                <div>
                  <div>{message.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Invites = () => {
  const { username } = useParams();

  return (
    <div>
      <InviteForTeam username={username} />
      <InviteForParicipant username={username} />
    </div>
  );
};

export default Invites;
