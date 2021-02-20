import { createSlice } from "@reduxjs/toolkit";
import axios from "app/axios";

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState: {
    loginRequestData: {},
    errorMessage: undefined,
    dataFetchingStatus: false,
    isLoggedIn: false,
  },

  reducers: {
    setLoginRequestData: (state, action) => {
      state.loginRequestData = action.payload;
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
    setIsloggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const {
  setLoginRequestData,
  setErrorMessage,
  setDataFetchingStatus,
  removeElementsFromArray,
  setIsloggedIn,
} = loginSlice.actions;

export const loginRequest = (data) => (dispatch) => {
  dispatch(removeElementsFromArray({}));
  dispatch(setErrorMessage(undefined));
  dispatch(setDataFetchingStatus(true));
  axios
    .post("/login", data)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setLoginRequestData(response.data));
    })
    .catch((error) => {
      console.log(error.response.data.error);
            // console.log(error.response.status);
            // console.log(error.response.headers);
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data));
    });
};
export const clearLoginData = () => (dispatch) => {
  dispatch(removeElementsFromArray({}));
};
export const isLoggedInUpdate = (data) => (dispatch) => {
  dispatch(setIsloggedIn(data));
};

export default loginSlice.reducer;
