import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonors } from "../store/donorsSlice";
import { fetchRecipients } from "../store/recipientsSlice";
import StatCard from "../components/StatCard";
import Alert from "../components/Alert";
import { ORGANS } from "../constants";

export default function Dashboard() {
  const dispatch = useDispatch();
  const donors = useSelector((s) => s.donors.list);
  const recipients = useSelector((s) => s.recipients.list);
  const error = useSelector((s) => s.donors.error || s.recipients.error);

  useEffect(() => {
    dispatch(fetchDonors());
    dispatch(fetchRecipients());
  }, [dispatch]);

  const organs = ORGANS.map((o) => ({
    organ: o,
    donors: donors.filter((d) => d.available && d.organ?.toLowerCase() === o.toLowerCase()).length,
    waiting: recipients.filter((r) => r.organNeeded?.toLowerCase() === o.toLowerCase()).length,
  }));
  const max = Math.max(1, ...organs.flatMap((o) => [o.donors, o.waiting]));

  return (
    <>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="muted">Overview of donors, recipients and organ demand</p>
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="stats-grid">
        <StatCard label="Total donors" value={donors.length} />
        <StatCard label="Available donors" value={donors.filter((d) => d.available).length} tone="green" />
        <StatCard label="Waiting recipients" value={recipients.length} tone="amber" />
        <StatCard label="Urgent (4-5)" value={recipients.filter((r) => r.urgency >= 4).length} tone="red" />
      </div>

      <div className="card">
        <h3>Organ supply vs demand</h3>
        <div className="legend">
          <span><i className="dot donor" /> Available donors</span>
          <span><i className="dot need" /> Waiting recipients</span>
        </div>

        {organs.map((o) => (
          <div className="bar-row" key={o.organ}>
            <span className="bar-label">{o.organ}</span>
            <div className="bar-group">
              <div className="bar">
                <div className="bar-fill donor" style={{ width: `${(o.donors / max) * 100}%` }} />
              </div>
              <div className="bar">
                <div className="bar-fill need" style={{ width: `${(o.waiting / max) * 100}%` }} />
              </div>
            </div>
            <span className="bar-count">{o.donors} / {o.waiting}</span>
          </div>
        ))}
      </div>
    </>
  );
}