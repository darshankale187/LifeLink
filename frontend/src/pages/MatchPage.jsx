import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { explainMatch, fetchMatches } from "../store/matchSlice";
import { fetchRecipients } from "../store/recipientsSlice";
import Badge from "../components/Badge";
import Alert from "../components/Alert";
import { urgencyType } from "../constants";

export default function MatchPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const recipients = useSelector((s) => s.recipients.list);
  const { matches, explanation, loading, aiLoading, error } = useSelector((s) => s.match);
  const recipient = recipients.find((r) => r.id === Number(id));

  useEffect(() => {
    dispatch(fetchRecipients());
    dispatch(fetchMatches(id));
  }, [dispatch, id]);

  return (
    <>
      <Link className="back-link" to="/recipients">
        &larr; Back to recipients
      </Link>

      <div className="page-header">
        <h2>Match results</h2>
      </div>

      {error && <Alert>{error}</Alert>}

      {recipient && (
        <div className="card">
          <h3>{recipient.name}</h3>
          <div className="badges">
            <Badge text={recipient.bloodGroup} type="blood" />
            <Badge text={recipient.organNeeded} type="organ" />
            <Badge text={recipient.city} />
            <Badge text={`Urgency ${recipient.urgency}`} type={urgencyType(recipient.urgency)} />
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <h3>Compatible donors ({matches.length})</h3>
          <button className="btn btn-ai btn-sm" onClick={() => dispatch(explainMatch(id))} disabled={aiLoading || matches.length === 0}>
            {aiLoading ? "AI is thinking..." : "AI Explain"}
          </button>
        </div>

        {loading && <p className="loading">Finding matches...</p>}
        {!loading && matches.length === 0 && <p className="empty">No compatible donors found.</p>}

        {matches.map((d) => (
          <div className="row" key={d.id}>
            <div>
              <div className="row-title">{d.name}</div>
              <div className="badges">
                <Badge text={d.bloodGroup} type="blood" />
                <Badge text={d.organ} type="organ" />
                <Badge text={d.city} />
              </div>
            </div>
          </div>
        ))}

        {explanation && (
          <div className="ai-box">
            <b>AI explanation</b>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    </>
  );
}