import { createSlice } from "@reduxjs/toolkit";
import axios from "app/axios";

export const classesSlice = createSlice({
  name: "classesSlice",
  initialState: {
    classData: [],
    terms: [],
    errorMessage: undefined,
    dataFetchingStatus: false,
    errorStatusCode: undefined,
  },

  reducers: {
    setclassData: (state, action) => {
      state.classData = action.payload;
    },
    setTermsData: (state, action) => {
      state.terms = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setErrorStatusCode: (state, action) => {
      state.errorStatusCode = action.payload;
    },
    setDataFetchingStatus: (state, action) => {
      state.dataFetchingStatus = action.payload;
    },
    removeElementsFromArray: (state, action) => {
      state.classData = action.payload;
    },
  },
});

export const {
  setclassData,
  setErrorMessage,
  setErrorStatusCode,
  setDataFetchingStatus,
  removeElementsFromArray,
  setTermsData,
} = classesSlice.actions;

export const getClassData = (data) => (dispatch) => {
  dispatch(removeElementsFromArray([]));
  dispatch(setDataFetchingStatus(true));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .get(`class/classes/${data}`)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setclassData(response.data));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const updateParmsForClass = (data) => (dispatch) => {
  dispatch(setDataFetchingStatus(true));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .post(`class/update`, data)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(response.data.message));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const getTermData = () => (dispatch) => {
  dispatch(removeElementsFromArray([]));
  dispatch(setDataFetchingStatus(true));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .get(`class/classes/getTerms`)
    .then((response) => {
      // dispatch(setDataFetchingStatus(false));
      dispatch(setTermsData(response.data));
    })
    .catch((error) => {
      // dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const clearClassData = () => (dispatch) => {
  dispatch(removeElementsFromArray([]));
};

export const clearErrorStatusCode = () => (dispatch) => {
  dispatch(setErrorStatusCode(undefined));
};
export const clearErrorMessage = () => (dispatch) => {
  dispatch(setErrorMessage(undefined));
};

export default classesSlice.reducer;
