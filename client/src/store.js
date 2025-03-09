import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; // ✅ Import user slice (we'll create it next)

const store = configureStore({
  reducer: {
    user: userReducer, // ✅ Add user reducer
  },
});

export default store;
