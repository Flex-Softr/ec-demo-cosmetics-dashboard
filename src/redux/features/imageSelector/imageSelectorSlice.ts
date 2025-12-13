import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type TInitialState = {
  thumbnail: string;
  gallery: string[];
  deleteImages: string[];
};

const initialState: TInitialState = {
  thumbnail: "",
  gallery: [],
  deleteImages: [],
};

const imageSelectorSlice = createSlice({
  name: "imageSelector",
  initialState,
  reducers: {
    setThumbnail: (state, action: PayloadAction<string>) => {
      state.thumbnail = action.payload;
    },
    setGallery: (state, action: PayloadAction<string[]>) => {
      state.gallery = [];
      state.gallery.push(...action.payload);
    },
    setDeleteImage: (state, action: PayloadAction<string[]>) => {
      state.deleteImages = [];
      state.deleteImages.push(...action.payload);
    },
    // setUpdateThumbnail: (state, action: PayloadAction<string>) => {
    //   state.updatedThumbnail = action.payload;
    // },
    // setUpdateGallery: (state, action: PayloadAction<string[]>) => {
    //   state.updatedGallery = [];
    //   state.updatedGallery.push(...action.payload);
    // },
  },
});

export const { setThumbnail, setGallery, setDeleteImage } =
  imageSelectorSlice.actions;
export default imageSelectorSlice.reducer;
