import { createSlice } from "@reduxjs/toolkit";
import { TImageToOrderSlice } from "./imageToOrderInterface";

const initialState: TImageToOrderSlice = {
  isLoading: true,
  allRequests: [],
};

const imageToOrderReqSlice = createSlice({
  name: "imageToOrderReq",
  initialState,
  reducers: {
    setImageToOrder: (state, { payload }) => {
      state.allRequests = payload;
    },
    setImageToOrderLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
});

export const { setImageToOrder, setImageToOrderLoading } =
  imageToOrderReqSlice.actions;

export default imageToOrderReqSlice.reducer;
