import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDonor, fetchDonors } from "../store/donorsSlice";
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
  const { list, loading, error, fieldErrors } = useSelector((s) => s.donors);
  const [values, setValues] = useState(empty);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchDonors());
  }, [dispatch]);

  const submit = async () => {
    const res = await dispatch(addDonor(values));
    if (addDonor.fulfilled.match(res)) {
      setValues(empty);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Donors</h2>
        <p className="muted">Register and view organ donors</p>
      </div>

      {error && <Alert>{error}</Alert>}
      {saved && <Alert type="success">Donor saved successfully</Alert>}

      <div className="split">
        <FormCard
          title="Add donor"
          fields={fields}
          values={values}
          setValues={setValues}
          onSubmit={submit}
          errors={fieldErrors}
        />

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