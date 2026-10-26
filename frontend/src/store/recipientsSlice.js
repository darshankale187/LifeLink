import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJson, postJson } from "../api";

export const fetchRecipients = createAsyncThunk("recipients/fetch", async (_, { rejectWithValue }) => {
  try {
    return await getJson("recipients");
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const addRecipient = createAsyncThunk("recipients/add", async (recipient, { rejectWithValue }) => {
  try {
    return await postJson("recipients", recipient);
  } catch (e) {
    return rejectWithValue(e);
  }
});

const recipientsSlice = createSlice({
  name: "recipients",
  initialState: { list: [], loading: false, error: "", fieldErrors: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipients.pending, (s) => {
        s.loading = true;
        s.error = "";
      })
      .addCase(fetchRecipients.fulfilled, (s, a) => {
        s.loading = false;
        s.list = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(fetchRecipients.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || "Could not load recipients";
      })
      .addCase(addRecipient.pending, (s) => {
        s.fieldErrors = {};
        s.error = "";
      })
      .addCase(addRecipient.fulfilled, (s, a) => {
        s.list.push(a.payload);
      })
      .addCase(addRecipient.rejected, (s, a) => {
        s.fieldErrors = a.payload?.errors || {};
        s.error = a.payload?.errors ? "" : a.payload?.message || "Could not save recipient";
      });
  },
});

export default recipientsSlice.reducer;