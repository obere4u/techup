import { createSlice } from "@reduxjs/toolkit";

//set initial state of things
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

//userSlice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //logic functions or reducers
    //start of signin
    signInStart: (state) => {
      (state.loading = true), (state.error = null);
    },

    //on successful signin, change state
    //action is like info gotten and what to do with it
    signInSuccess: (state, action) => {
      (state.currentUser = action.payload),
        (state.loading = false),
        (state.error = null);
    },

    //on signin error
    signInFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },

    //end of signin
    signInFinish: (state) => {
      state.loading = false;
    },

    //updating user
    updateStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    updateSuccess: (state, action) => {
      (state.currentUser = action.payload),
        (state.loading = false),
        (state.error = null);
    },

    //on signin error
    updateFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },

    //end of signin
    updateFinish: (state) => {
      state.loading = false;
    },

 //on successful signin, change state
    //action is like info gotten and what to do with it
    signOutSuccess: (state) => {
      (state.currentUser = null),
        (state.loading = false),
        (state.error = null);
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signInFinish,
  updateStart,
  updateSuccess,
  updateFailure,
  updateFinish,
  signOutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
