import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postJson } from "../api";

export const sendMessage = createAsyncThunk("chat/send", async (_, { getState, rejectWithValue }) => {
    const history = getState().chat.messages.map(({ role, text }) => ({ role, text }));
    try {
        const data = await postJson("assistant", { messages: history });
        return data.answer;
    } catch (e) {
        return rejectWithValue(e);
    }
});

const chatSlice = createSlice({
    name: "chat",
    initialState: { messages: [], loading: false },
    reducers: {
        addUserMessage(state, action) {
            state.messages.push({ role: "user", text: action.payload });
        },
        clearChat(state) {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (s) => {
                s.loading = true;
            })
            .addCase(sendMessage.fulfilled, (s, a) => {
                s.loading = false;
                s.messages.push({ role: "assistant", text: a.payload });
            })
            .addCase(sendMessage.rejected, (s, a) => {
                s.loading = false;
                s.messages.push({
                    role: "assistant",
                    text: a.payload?.message || "Sorry, something went wrong.",
                    isError: true,
                });
            });
    },
});

export const { addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;