import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
    register: (state) => {
      state.isLoggedIn = true;
      state.user = null;
    },
  },
});

export const getAdminStore = (state) => state.admin;

// Action creators are generated for each case reducer function
export const { login, logout, register } = adminSlice.actions;

export default adminSlice.reducer;
