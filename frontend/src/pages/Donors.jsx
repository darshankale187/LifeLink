import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDonor, deleteDonor, fetchDonors, updateDonor } from "../store/donorsSlice";
import { useAuth } from "../context/AuthContext";
import FormCard from "../components/FormCard";
import Badge from "../components/Badge";
import Alert from "../components/Alert";
import { BLOOD_GROUPS, ORGANS } from "../constants";

const empty = { name: "", age: 0, bloodGroup: "", organ: "", city: "", phone: "" };

const fields = [
  { name: "name", label: "Full name" },
  { name: "age", label: "Age", type: "number" },
  { name: "bloodGroup", label: "Blood group", options: BLOOD_GROUPS },
  { name: "organ", label: "Organ", options: ORGANS },
  { name: "city", label: "City" },
  { name: "phone", label: "Phone (10 digits)" },
];

export default function Donors() {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const { list, loading, error, fieldErrors } = useSelector((s) => s.donors);
  const [values, setValues] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchDonors());
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
    const res = await dispatch(editingId ? updateDonor(values) : addDonor(values));
    if (res.meta.requestStatus === "fulfilled") {
      flash(editingId ? "Donor updated" : "Donor saved");
      reset();
    }
  };

  const startEdit = (donor) => {
    setEditingId(donor.id);
    setValues({ ...donor });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = (donor) => {
    if (window.confirm(`Delete donor ${donor.name}?`)) {
      dispatch(deleteDonor(donor.id));
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Donors</h2>
        <p className="muted">Register and manage organ donors</p>
      </div>

      {error && <Alert>{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}
      {!isAdmin && <Alert type="info">You have view-only access. Only an admin can add, edit or delete records.</Alert>}

      <div className={isAdmin ? "split" : ""}>
        {isAdmin && (
          <FormCard
            title={editingId ? "Edit donor" : "Add donor"}
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
          <h3>All donors ({list.length})</h3>
          {loading && <p className="loading">Loading...</p>}
          {!loading && list.length === 0 && <p className="empty">No donors yet</p>}

          {list.length > 0 && (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Blood</th>
                    <th>Organ</th>
                    <th>City</th>
                    <th>Status</th>
                    {isAdmin && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {list.map((d) => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td>{d.age}</td>
                      <td><Badge text={d.bloodGroup} type="blood" /></td>
                      <td><Badge text={d.organ} type="organ" /></td>
                      <td>{d.city}</td>
                      <td>
                        <Badge text={d.available ? "Available" : "Unavailable"} type={d.available ? "low" : ""} />
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="actions">
                            <button className="btn btn-secondary btn-sm" onClick={() => startEdit(d)}>
                              Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => remove(d)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
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