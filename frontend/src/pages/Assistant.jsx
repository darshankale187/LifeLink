import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserMessage, clearChat, sendMessage } from "../store/chatSlice";

const suggestions = [
  "How many kidney donors are available?",
  "Which city has the most waiting recipients?",
  "How many urgent recipients are there?",
  "Who can become an organ donor?",
];

export default function Assistant() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((s) => s.chat);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = (question) => {
    const q = question.trim();
    if (!q || loading) return;
    dispatch(addUserMessage(q));
    dispatch(sendMessage());
    setText("");
  };

  return (
    <>
      <div className="page-header">
        <h2>AI assistant</h2>
        <p className="muted">Ask about live LifeLink data or general organ donation. Not medical advice.</p>
      </div>

      <div className="card chat-card">
        <div className="chat-window">
          {messages.length === 0 && (
            <div className="chat-empty">
              <p>Ask me anything about donors, recipients or organ donation.</p>
              <div className="chips">
                {suggestions.map((s) => (
                  <button key={s} type="button" className="chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.role}${m.isError ? " error" : ""}`}>
              {m.text}
            </div>
          ))}

          {loading && <div className="bubble assistant typing">Thinking...</div>}
          <div ref={endRef} />
        </div>

        <form
          className="ask-row"
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
        >
          <input
            value={text}
            placeholder="Type your question..."
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-ai" type="submit" disabled={loading}>
            Send
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => dispatch(clearChat())}>
            Clear
          </button>
        </form>
      </div>
    </>
  );
}