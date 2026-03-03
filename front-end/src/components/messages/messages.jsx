import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, sendMessage } from "../../redux/messageThunk/messageThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";

function Messages({ doctorId, onClose }) {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const { messages = [] } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.user);

  const [messageText, setMessageText] = useState("");
  const userId = user?._id;

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (doctorId) {
      dispatch(getMessages(doctorId));
    }
  }, [dispatch, doctorId]);

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
    <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/80 min-h-[360px] h-[65vh] max-h-[580px]">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
            Messages
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Secure chat</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline">
            Connected
          </span>
          {typeof onClose === "function" && (
            <button
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50"
              aria-label="Close chat"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-4 py-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-400">No messages yet</p>
        )}

        {messages.map((msg) => {
          const isMyMessage =
            msg.sender?._id === userId || msg.sender === userId;

          return (
            <div
              key={msg._id}
              className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 text-sm shadow ${
                  isMyMessage
                    ? "rounded-br-sm bg-blue-600 text-white shadow-blue-500/30"
                    : "rounded-bl-sm bg-white text-slate-800 border border-slate-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-100 bg-white px-3 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={handleSend}
            className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow shadow-blue-500/30 transition hover:bg-blue-700 sm:w-auto"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;