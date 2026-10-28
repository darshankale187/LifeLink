import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addRecipient,
  deleteRecipient,
  fetchRecipients,
  updateRecipient,
} from "../store/recipientsSlice";
import { useAuth } from "../context/AuthContext";
import FormCard from "../components/FormCard";
import Badge from "../components/Badge";
import Alert from "../components/Alert";
import { BLOOD_GROUPS, ORGANS, urgencyType } from "../constants";

const empty = { name: "", age: 0, bloodGroup: "", organNeeded: "", city: "", urgency: 1 };

const fields = [
  { name: "name", label: "Full name" },
  { name: "age", label: "Age", type: "number" },
  { name: "bloodGroup", label: "Blood group", options: BLOOD_GROUPS },
  { name: "organNeeded", label: "Organ needed", options: ORGANS },
  { name: "city", label: "City" },
  { name: "urgency", label: "Urgency (1-5)", type: "number", options: [1, 2, 3, 4, 5] },
];

export default function Recipients() {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const { list, loading, error, fieldErrors } = useSelector((s) => s.recipients);
  const [values, setValues] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchRecipients());
  }, [dispatch]);

  const reset = () => {
    setValues(empty);
    setEditingId(null);
  };

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const submit = async () => {
    const res = await dispatch(editingId ? updateRecipient(values) : addRecipient(values));
    if (res.meta.requestStatus === "fulfilled") {
      flash(editingId ? "Recipient updated" : "Recipient saved");
      reset();
    }
  };

  const startEdit = (recipient) => {
    setEditingId(recipient.id);
    setValues({ ...recipient });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = (recipient) => {
    if (window.confirm(`Delete recipient ${recipient.name}?`)) {
      dispatch(deleteRecipient(recipient.id));
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Recipients</h2>
        <p className="muted">Patients waiting for an organ</p>
      </div>

      {error && <Alert>{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}
      {!isAdmin && <Alert type="info">You have view-only access. Only an admin can add, edit or delete records.</Alert>}

      <div className={isAdmin ? "split" : ""}>
        {isAdmin && (
          <FormCard
            title={editingId ? "Edit recipient" : "Add recipient"}
            fields={fields}
            values={values}
            setValues={setValues}
            onSubmit={submit}
            errors={fieldErrors}
            submitLabel={editingId ? "Update" : "Save"}
            onCancel={editingId ? reset : undefined}
          />
        )}

        <div className="card">
          <h3>Waiting list ({list.length})</h3>
          {loading && <p className="loading">Loading...</p>}
          {!loading && list.length === 0 && <p className="empty">No recipients yet</p>}

          {list.length > 0 && (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Blood</th>
                    <th>Organ</th>
                    <th>City</th>
                    <th>Urgency</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td><Badge text={r.bloodGroup} type="blood" /></td>
                      <td><Badge text={r.organNeeded} type="organ" /></td>
                      <td>{r.city}</td>
                      <td><Badge text={r.urgency} type={urgencyType(r.urgency)} /></td>
                      <td>
                        <div className="actions">
                          <Link className="btn btn-sm" to={`/match/${r.id}`}>
                            Find match
                          </Link>
                          {isAdmin && (
                            <>
                              <button className="btn btn-secondary btn-sm" onClick={() => startEdit(r)}>
                                Edit
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => remove(r)}>
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}