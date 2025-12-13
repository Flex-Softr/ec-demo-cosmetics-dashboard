import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TSlider } from "./interface";

const initialState: TSlider = {
  thumbnail: "",
};

const sliderSlice = createSlice({
  name: "addSlider",
  initialState,
  reducers: {
    setThumbnail: (state, action: PayloadAction<string>) => {
      state.thumbnail = action.payload;
    },

    resetSlider: () => {
      return initialState;
    },
  },
});

export const { setThumbnail } = sliderSlice.actions;

export default sliderSlice.reducer;
