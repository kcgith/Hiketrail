import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

function Chat() {
  const { activityId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const {showToast} = useToast();

  // Fetch chat messages
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/activities/${activityId}/chat`);
        setMessages(res.data);
      } catch (err) {
        console.error("Chat fetch error:", err);
        showToast("Could not fetch chat","error")
      }
    };
    fetchChat();
  }, [activityId]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await api.post(`/activities/${activityId}/chat`, {
        text,
      });

      // backend returns saved chat object
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Message send error:", err);
      showToast("Message not sent", "error")
    }
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      <h1 className="text-xl font-bold mb-4">Group Chat</h1>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3 border p-3 rounded">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-gray-100 p-2 rounded">
            <p className="text-sm font-semibold">
              {msg.sender?.name || msg.sender?.email}
            </p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex gap-2 mt-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
