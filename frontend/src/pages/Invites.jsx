import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";

const InviteForTeam = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  return <div>No invites for team</div>;
};

const InviteForParicipant = ({ username }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await api.get(`/api/invite-participant/`, {username});
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
