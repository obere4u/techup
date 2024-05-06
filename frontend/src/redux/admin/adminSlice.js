import { createSlice } from "@reduxjs/toolkit";

//set initial state of things
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

//userSlice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    //logic functions or reducers
    //start of signin
    adminSignInStart: (state) => {
      (state.loading = true), (state.error = null);
    },

    //on successful signin, change state
    //action is like info gotten and what to do with it
    adminSignInSuccess: (state, action) => {
      (state.currentUser = action.payload),
        (state.loading = false),
        (state.error = null);
    },

    //on signin error
    adminSignInFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },

    //end of signin
    adminSignInFinish: (state) => {
      state.loading = false;
    },

    //updating user
    adminUpdateStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    adminUpdateSuccess: (state, action) => {
      (state.currentUser = action.payload),
        (state.loading = false),
        (state.error = null);
    },

    //on signin error
    adminUpdateFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },

    //end of signin
    adminUpdateFinish: (state) => {
      state.loading = false;
    },

    //on successful signin, change state
    //action is like info gotten and what to do with it
    adminSignOutSuccess: (state) => {
      (state.currentUser = null), (state.loading = false), (state.error = null);
    },
  },
});

export const {
  adminSignInStart,
  adminSignInSuccess,
  adminSignInFailure,
  adminSignInFinish,
  adminUpdateStart,
  adminUpdateSuccess,
  adminUpdateFailure,
  adminUpdateFinish,
  adminSignOutSuccess,
} = adminSlice.actions;

export default adminSlice.reducer;
