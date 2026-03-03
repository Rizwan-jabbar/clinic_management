import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage } from "../../redux/messageThunk/messageThunk";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";

function Messages({ doctorId }) {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const { messages = [] } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.user);

  const [messageText, setMessageText] = useState("");

  const userId = user?._id;

  /* FETCH USER ONLY IF NOT AVAILABLE */
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  /* FETCH MESSAGES */
  useEffect(() => {
    if (doctorId) {
      dispatch(getMessages(doctorId));
    }
  }, [dispatch, doctorId]);

  /* AUTO SCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !doctorId) return;

    try {
      await dispatch(
        sendMessage({
          receiverId: doctorId,
          text: messageText,
        })
      ).unwrap();

      setMessageText("");
      dispatch(getMessages(doctorId));
    } catch (error) {
      console.log("Send Message Error:", error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-gray-100 rounded-xl shadow">

      <div className="bg-white shadow-md p-4 font-semibold">
        Chat
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400">
            No messages yet
          </p>
        )}

        {messages.map((msg) => {
          const isMyMessage =
            msg.sender?._id === userId || msg.sender === userId;

          return (
            <div
              key={msg._id}
              className={`flex ${
                isMyMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow ${
                  isMyMessage
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white flex gap-2 border-t">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Messages;