import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteJson, getJson, postJson, putJson } from "../api";

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

export const updateRecipient = createAsyncThunk("recipients/update", async (recipient, { rejectWithValue }) => {
  try {
    return await putJson(`recipients/${recipient.id}`, recipient);
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const deleteRecipient = createAsyncThunk("recipients/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteJson(`recipients/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(e);
  }
});

const saveRejected = (s, a) => {
  s.fieldErrors = a.payload?.errors || {};
  s.error = a.payload?.errors ? "" : a.payload?.message || "Could not save recipient";
};

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
      .addCase(addRecipient.rejected, saveRejected)
      .addCase(updateRecipient.pending, (s) => {
        s.fieldErrors = {};
        s.error = "";
      })
      .addCase(updateRecipient.fulfilled, (s, a) => {
        s.list = s.list.map((r) => (r.id === a.payload.id ? a.payload : r));
      })
      .addCase(updateRecipient.rejected, saveRejected)
      .addCase(deleteRecipient.pending, (s) => {
        s.error = "";
      })
      .addCase(deleteRecipient.fulfilled, (s, a) => {
        s.list = s.list.filter((r) => r.id !== a.payload);
      })
      .addCase(deleteRecipient.rejected, (s, a) => {
        s.error = a.payload?.message || "Could not delete recipient";
      });
  },
});

export default recipientsSlice.reducer;