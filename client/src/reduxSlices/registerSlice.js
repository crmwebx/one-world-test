import { createSlice } from "@reduxjs/toolkit";
import axios from "app/axios";

export const registerSlice = createSlice({
  name: "registerSlice",
  initialState: {
    registerRequestData: {},
    errorMessage: undefined,
    dataFetchingStatus: false,
  },

  reducers: {
    setregisterRequestData: (state, action) => {
      state.registerRequestData = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setDataFetchingStatus: (state, action) => {
      state.dataFetchingStatus = action.payload;
    },
    removeElementsFromArray: (state, action) => {
      state.loginRequestData = action.payload;
    },
  },
});

export const {
  setregisterRequestData,
  setErrorMessage,
  setDataFetchingStatus,
  removeElementsFromArray,
} = registerSlice.actions;

export const registerRequest = (data) => (dispatch) => {
  dispatch(removeElementsFromArray({}));
  dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  axios
    .post("/register", data)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setregisterRequestData(response.data));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data));
    });
};

export default registerSlice.reducer;
