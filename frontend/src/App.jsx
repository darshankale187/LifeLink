import { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

const post = (path, data) =>
  fetch(`${API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

const get = async (path) => {
  const res = await fetch(`${API}/${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const urgencyClass = (u) => (u >= 4 ? "high" : u === 3 ? "mid" : "low");

function Form({ title, data, setData, onSubmit, errors }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {Object.keys(data).map((k) => (
        <div className="field" key={k}>
          <label>{k.replace(/([A-Z])/g, " $1")}</label>
          <input
            type={typeof data[k] === "number" ? "number" : "text"}
            value={data[k]}
            onChange={(e) =>
              setData({
                ...data,
                [k]: typeof data[k] === "number" ? Number(e.target.value) : e.target.value,
              })
            }
          />
          {errors[k] && <span className="error-text">{errors[k]}</span>}
        </div>
      ))}
      <button onClick={onSubmit}>Save</button>
    </div>
  );
}

export default function App() {
  const emptyDonor = { name: "", age: 0, bloodGroup: "", organ: "", city: "", phone: "" };
  const emptyRecipient = { name: "", age: 0, bloodGroup: "", organNeeded: "", city: "", urgency: 1 };

  const [donor, setDonor] = useState(emptyDonor);
  const [recipient, setRecipient] = useState(emptyRecipient);
  const [donorErrors, setDonorErrors] = useState({});
  const [recipientErrors, setRecipientErrors] = useState({});
  const [recipients, setRecipients] = useState([]);
  const [matches, setMatches] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRecipients = async () => {
    try {
      const data = await get("recipients");
      setRecipients(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError("Backend not reachable on http://localhost:8080. Start the Spring Boot app.");
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const saveDonor = async () => {
    try {
      const res = await post("donors", donor);
      if (!res.ok) {
        const data = await res.json();
        setDonorErrors(data.errors || {});
        return;
      }
      setDonorErrors({});
      setDonor(emptyDonor);
      alert("Donor saved");
    } catch {
      setError("Could not save donor. Is the backend running?");
    }
  };

  const saveRecipient = async () => {
    try {
      const res = await post("recipients", recipient);
      if (!res.ok) {
        const data = await res.json();
        setRecipientErrors(data.errors || {});
        return;
      }
      setRecipientErrors({});
      setRecipient(emptyRecipient);
      loadRecipients();
    } catch {
      setError("Could not save recipient. Is the backend running?");
    }
  };

  const findMatch = async (id) => {
    setExplanation("");
    try {
      const data = await get(`match/${id}`);
      setMatches(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load matches.");
    }
  };

  const explain = async (id) => {
    setLoading(true);
    setExplanation("");
    try {
      const data = await get(`match/${id}/explain`);
      setExplanation(data.explanation || "Could not get explanation");
    } catch {
      setExplanation("AI service error. Check the backend console.");
    }
    setLoading(false);
  };

  const askAssistant = async () => {
    setLoading(true);
    setAnswer("");
    try {
      const res = await post("assistant", { question });
      const data = await res.json();
      setAnswer(data.answer || "Could not get answer");
    } catch {
      setAnswer("AI service error. Check the backend console.");
    }
    setLoading(false);
  };

  return (
    <>
      <header className="header">
        <h1>LifeLink</h1>
        <p>AI-powered organ donor management</p>
      </header>

      <main className="container">
        <div className="notice">
          Demo project with dummy data only. Real organ allocation is done by doctors and authorities.
        </div>

        {error && <div className="banner-error">{error}</div>}

        <div className="grid">
          <Form title="Add Donor" data={donor} setData={setDonor} onSubmit={saveDonor} errors={donorErrors} />
          <Form title="Add Recipient" data={recipient} setData={setRecipient} onSubmit={saveRecipient} errors={recipientErrors} />
        </div>

        <div className="card">
          <h3>Recipients</h3>
          {recipients.length === 0 && <p className="empty">No recipients yet</p>}
          {recipients.map((r) => (
            <div className="row" key={r.id}>
              <div>
                <div className="row-title">{r.name}</div>
                <div className="badges">
                  <span className="badge blood">{r.bloodGroup}</span>
                  <span className="badge organ">{r.organNeeded}</span>
                  <span className="badge">{r.city}</span>
                  <span className={`badge ${urgencyClass(r.urgency)}`}>Urgency {r.urgency}</span>
                </div>
              </div>
              <div className="actions">
                <button onClick={() => findMatch(r.id)}>Find Match</button>
                <button className="secondary" onClick={() => explain(r.id)}>AI Explain</button>
              </div>
            </div>
          ))}

          {loading && <p className="loading">AI is thinking...</p>}
          {explanation && (
            <div className="ai-box">
              <b>AI Explanation</b>
              <p>{explanation}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Matched Donors</h3>
          {matches.length === 0 && <p className="empty">No matches yet. Click "Find Match" on a recipient.</p>}
          {matches.map((d) => (
            <div className="row" key={d.id}>
              <div>
                <div className="row-title">{d.name}</div>
                <div className="badges">
                  <span className="badge blood">{d.bloodGroup}</span>
                  <span className="badge organ">{d.organ}</span>
                  <span className="badge">{d.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Donation Assistant</h3>
          <div className="ask-row">
            <input
              value={question}
              placeholder="Ask about organ donation..."
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={askAssistant}>Ask</button>
          </div>
          {answer && <div className="ai-box">{answer}</div>}
        </div>
      </main>
    </>
  );
}