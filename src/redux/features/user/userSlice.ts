import { createSlice } from "@reduxjs/toolkit";
import { TUsersInitialState } from "./userInterface";

const initialState: TUsersInitialState = {
  users: [],
  isUsersLoading: true,
};

const userSlice = createSlice({
  name: "usersSlice",
  initialState,
  reducers: {
    setUsers: (state, { payload }) => {
      state.users = payload;
    },
    setIsUsersLoading: (state, { payload }) => {
      state.isUsersLoading = payload;
    },
  },
});

export const { setUsers, setIsUsersLoading } = userSlice.actions;

export default userSlice.reducer;
