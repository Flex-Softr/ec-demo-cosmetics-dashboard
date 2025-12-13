import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TCategory } from "./interface";

const initialState: TCategory = {
  thumbnail: "",
};

const categorySlice = createSlice({
  name: "addCategory",
  initialState,
  reducers: {
    setThumbnail: (state, action: PayloadAction<string>) => {
      state.thumbnail = action.payload;
    },

    resetCategory: () => {
      return initialState;
    },
  },
});

export const { setThumbnail } = categorySlice.actions;

export default categorySlice.reducer;
