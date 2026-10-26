import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addRecipient, fetchRecipients } from "../store/recipientsSlice";
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
  const { list, loading, error, fieldErrors } = useSelector((s) => s.recipients);
  const [values, setValues] = useState(empty);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchRecipients());
  }, [dispatch]);

  const submit = async () => {
    const res = await dispatch(addRecipient(values));
    if (addRecipient.fulfilled.match(res)) {
      setValues(empty);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Recipients</h2>
        <p className="muted">Patients waiting for an organ</p>
      </div>

      {error && <Alert>{error}</Alert>}
      {saved && <Alert type="success">Recipient saved successfully</Alert>}

      <div className="split">
        <FormCard
          title="Add recipient"
          fields={fields}
          values={values}
          setValues={setValues}
          onSubmit={submit}
          errors={fieldErrors}
        />

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
                        <Link className="btn btn-sm" to={`/match/${r.id}`}>
                          Find match
                        </Link>
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