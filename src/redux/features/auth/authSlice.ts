import { createSlice } from "@reduxjs/toolkit";
import { TInitialState } from "./interface";

const initialState: TInitialState = {
  user: null,
  token: null,
  profile: null,
  isProfileLoading: true,
};

const authSlice = createSlice({
  name: "allProducts",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.profile = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setProfileLoading: (state, { payload }) => {
      state.isProfileLoading = payload;
    },
  },
});
export const { setUser, logOut, setProfile, setProfileLoading } =
  authSlice.actions;

export default authSlice.reducer;
