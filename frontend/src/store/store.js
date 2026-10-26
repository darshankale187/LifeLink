import { configureStore } from "@reduxjs/toolkit";
import donors from "./donorsSlice";
import recipients from "./recipientsSlice";
import match from "./matchSlice";
import chat from "./chatSlice";

export const store = configureStore({
  reducer: { donors, recipients, match, chat },
});