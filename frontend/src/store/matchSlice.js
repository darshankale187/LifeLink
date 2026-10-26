import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJson, postJson } from "../api";

export const fetchMatches = createAsyncThunk("match/fetch", async (id, { rejectWithValue }) => {
  try {
    return await getJson(`match/${id}`);
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const explainMatch = createAsyncThunk("match/explain", async (id, { rejectWithValue }) => {
  try {
    const data = await getJson(`match/${id}/explain`);
    return data.explanation;
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const askAssistant = createAsyncThunk("match/ask", async (question, { rejectWithValue }) => {
  try {
    const data = await postJson("assistant", { question });
    return data.answer;
  } catch (e) {
    return rejectWithValue(e);
  }
});

const matchSlice = createSlice({
  name: "match",
  initialState: {
    matches: [],
    explanation: "",
    answer: "",
    loading: false,
    aiLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (s) => {
        s.loading = true;
        s.matches = [];
        s.explanation = "";
        s.error = "";
      })
      .addCase(fetchMatches.fulfilled, (s, a) => {
        s.loading = false;
        s.matches = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(fetchMatches.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || "Could not load matches";
      })
      .addCase(explainMatch.pending, (s) => {
        s.aiLoading = true;
        s.explanation = "";
        s.error = "";
      })
      .addCase(explainMatch.fulfilled, (s, a) => {
        s.aiLoading = false;
        s.explanation = a.payload;
      })
      .addCase(explainMatch.rejected, (s, a) => {
        s.aiLoading = false;
        s.error = a.payload?.message || "AI service error";
      })
      .addCase(askAssistant.pending, (s) => {
        s.aiLoading = true;
        s.answer = "";
        s.error = "";
      })
      .addCase(askAssistant.fulfilled, (s, a) => {
        s.aiLoading = false;
        s.answer = a.payload;
      })
      .addCase(askAssistant.rejected, (s, a) => {
        s.aiLoading = false;
        s.error = a.payload?.message || "AI service error";
      });
  },
});

export default matchSlice.reducer;