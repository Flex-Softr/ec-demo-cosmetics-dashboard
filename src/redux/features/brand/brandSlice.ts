import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TBrand = {
  thumbnail: string;
};

const initialState: TBrand = {
  thumbnail: "",
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setThumbnail: (state, action: PayloadAction<string>) => {
      state.thumbnail = action.payload;
    },
    resetBrand: () => {
      return initialState;
    },
  },
});

export const { setThumbnail } = brandSlice.actions;

export default brandSlice.reducer;
