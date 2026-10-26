import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJson, postJson } from "../api";

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
      .addCase(addDonor.rejected, (s, a) => {
        s.fieldErrors = a.payload?.errors || {};
        s.error = a.payload?.errors ? "" : a.payload?.message || "Could not save donor";
      });
  },
});

export default donorsSlice.reducer;