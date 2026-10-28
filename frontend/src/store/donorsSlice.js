import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteJson, getJson, postJson, putJson } from "../api";

export const fetchDonors = createAsyncThunk("donors/fetch", async (_, { rejectWithValue }) => {
  try {
    return await getJson("donors");
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const addDonor = createAsyncThunk("donors/add", async (donor, { rejectWithValue }) => {
  try {
    return await postJson("donors", donor);
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const updateDonor = createAsyncThunk("donors/update", async (donor, { rejectWithValue }) => {
  try {
    return await putJson(`donors/${donor.id}`, donor);
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const deleteDonor = createAsyncThunk("donors/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteJson(`donors/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(e);
  }
});

const saveRejected = (s, a) => {
  s.fieldErrors = a.payload?.errors || {};
  s.error = a.payload?.errors ? "" : a.payload?.message || "Could not save donor";
};

const donorsSlice = createSlice({
  name: "donors",
  initialState: { list: [], loading: false, error: "", fieldErrors: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonors.pending, (s) => {
        s.loading = true;
        s.error = "";
      })
      .addCase(fetchDonors.fulfilled, (s, a) => {
        s.loading = false;
        s.list = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(fetchDonors.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || "Could not load donors";
      })
      .addCase(addDonor.pending, (s) => {
        s.fieldErrors = {};
        s.error = "";
      })
      .addCase(addDonor.fulfilled, (s, a) => {
        s.list.push(a.payload);
      })
      .addCase(addDonor.rejected, saveRejected)
      .addCase(updateDonor.pending, (s) => {
        s.fieldErrors = {};
        s.error = "";
      })
      .addCase(updateDonor.fulfilled, (s, a) => {
        s.list = s.list.map((d) => (d.id === a.payload.id ? a.payload : d));
      })
      .addCase(updateDonor.rejected, saveRejected)
      .addCase(deleteDonor.pending, (s) => {
        s.error = "";
      })
      .addCase(deleteDonor.fulfilled, (s, a) => {
        s.list = s.list.filter((d) => d.id !== a.payload);
      })
      .addCase(deleteDonor.rejected, (s, a) => {
        s.error = a.payload?.message || "Could not delete donor";
      });
  },
});

export default donorsSlice.reducer;