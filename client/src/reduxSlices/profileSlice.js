import { createSlice } from "@reduxjs/toolkit";
import axios from "app/axios";

export const profileSlice = createSlice({
  name: "profileSlice",
  initialState: {
    profileData: {},
    profileDataEdit: {},
    errorMessage: undefined,
    dataFetchingStatus: false,
    errorStatusCode:undefined
  },

  reducers: {
    setprofileData: (state, action) => {
      state.profileData = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setErrorStatusCode:(state, action) => {
      state.errorStatusCode = action.payload;
    },
    setDataFetchingStatus: (state, action) => {
      state.dataFetchingStatus = action.payload;
    },
    removeElementsFromArray: (state, action) => {
      state.profileData = action.payload;
    },
    setProfileDataEditData: (state, action) => {
      state.profileDataEdit = action.payload;
    },
  },
});

export const {
  setprofileData,
  setErrorMessage,
  setDataFetchingStatus,
  removeElementsFromArray,
  setProfileDataEditData,
  setErrorStatusCode
} = profileSlice.actions;

export const getprofileData = (userId) => (dispatch) => {
  dispatch(removeElementsFromArray({}));
  dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
      "Bearer "  + window.localStorage.getItem("x-auth-token");

  axios
    .get(`profile/getContacts/${userId}`)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setprofileData(response.data));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};

export const postprofileData = (data) => (dispatch) => {
  dispatch(removeElementsFromArray({}));
  dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
  "Bearer "  + window.localStorage.getItem("x-auth-token");
  axios
    .post("profile/setContacts/", data)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const clearprofileData = () => (dispatch) => {
  dispatch(removeElementsFromArray({}));
};

export const updateProfileEditData = (data) => (dispatch) => {
  dispatch(setProfileDataEditData(data));
};
export default profileSlice.reducer;
