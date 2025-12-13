import { createSlice } from "@reduxjs/toolkit";
import { TWarrantyClaimInitialState } from "./warrantyClaimInterface";

const initialState: TWarrantyClaimInitialState = {
  warrantyClaimRequests: [],
  bulkSelect: {
    requestIds: [],
  },
};

const warrantyClaimSlice = createSlice({
  name: "warrantyClaimSlice",
  initialState,
  reducers: {
    setRequests: (state, { payload }) => {
      state.warrantyClaimRequests = payload;
    },
  },
});

export const { setRequests } = warrantyClaimSlice.actions;

export default warrantyClaimSlice.reducer;
