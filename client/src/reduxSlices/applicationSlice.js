import { createSlice } from "@reduxjs/toolkit";
import axios from "app/axios";

export const applicationSlice = createSlice({
  name: "applicationSlice",
  initialState: {
    applicationData: {},
    applicationDataEdit: {},
    applicationTest: {},
    interviewSlot: [],
    paymentResponse: {},
    applicantFee: {},
    applicantStatus: {},
    errorMessage: undefined,
    dataFetchingStatus: false,
    errorStatusCode: undefined,
    notifyEvents: undefined,
  },

  reducers: {
    setapplicationData: (state, action) => {
      state.applicationData = action.payload;
    },
    setPaymentResponse: (state, action) => {
      state.paymentResponse = action.payload;
    },
    setApplicantFee: (state, action) => {
      state.applicantFee = action.payload;
    },
    setApplicantStatus: (state, action) => {
      state.applicantStatus = action.payload;
    },
    setApplicationTestData: (state, action) => {
      state.applicationTest = action.payload;
    },
    setInterviewSlot: (state, action) => {
      state.interviewSlot = action.payload;
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
      state.applicationData = action.payload;
    },
    removeApplicationTestData: (state, action) => {
      state.applicationTest = action.payload;
    },
    removeInterviewSlot: (state, action) => {
      state.interviewSlot = action.payload;
    },
    removeExistingStatus: (state, action) => {
      state.applicantStatus = action.payload;
    },
    setapplicationDataEditData: (state, action) => {
      state.applicationDataEdit = action.payload;
    },
    setNotifyEvents: (state, action) => {
      state.notifyEvents = action.payload;
    },
  },
});

export const {
  setapplicationData,
  setApplicationTestData,
  setErrorMessage,
  setDataFetchingStatus,
  removeElementsFromArray,
  setapplicationDataEditData,
  setErrorStatusCode,
  removeApplicationTestData,
  setInterviewSlot,
  removeInterviewSlot,
  setPaymentResponse,
  setApplicantFee,
  setNotifyEvents,
  setApplicantStatus,
  removeExistingStatus,
} = applicationSlice.actions;

export const getApplicationData = (userId) => (dispatch) => {
  dispatch(removeElementsFromArray({}));
  dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .get(`application/getContacts/${userId}`)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setapplicationData(response.data));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const getApplicantStatus = (userId) => (dispatch) => {
  dispatch(removeExistingStatus({}));
  // dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .get(`application/getApplicantStatus/${userId}`)
    .then((response) => {
      // dispatch(setDataFetchingStatus(false));
      dispatch(setApplicantStatus(response.data));
    })
    .catch((error) => {
      // dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const getApplicationTestData = (userId) => (dispatch) => {
  dispatch(removeApplicationTestData({}));
  dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .get(`application/applicationTest/${userId}`)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setApplicationTestData(response.data));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};

export const SaveApplicationTestData = (data) => (dispatch) => {
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  dispatch(setDataFetchingStatus(true));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .post("application/applicationTest/", data)
    .then((response) => {
      dispatch(setErrorMessage(response.data.message));
      dispatch(setDataFetchingStatus(false));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const SaveApplicationTestOnlineData = (data) => (dispatch) => {
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  dispatch(setDataFetchingStatus(true));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .post("application/applicationTestOnline/", data)
    .then((response) => {
      dispatch(setErrorMessage(response.data.message));
      dispatch(setDataFetchingStatus(false));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};

export const postApplicationData = (data) => (dispatch) => {
  dispatch(removeElementsFromArray({}));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  dispatch(setDataFetchingStatus(true));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .post("application/setContacts", data)
    .then((response) => {
      dispatch(setErrorMessage(response.data.message));
      dispatch(setErrorStatusCode(response.data.responseCode));
      dispatch(setDataFetchingStatus(false));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const clearApplicationData = () => (dispatch) => {
  dispatch(removeElementsFromArray({}));
};

export const updateApplicationEditData = (data) => (dispatch) => {
  dispatch(setapplicationDataEditData(data));
};
export const clearErrorStatusCode = () => (dispatch) => {
  dispatch(setErrorStatusCode(undefined));
};
export const clearErrorMessage = () => (dispatch) => {
  dispatch(setErrorMessage(undefined));
};
export const clearApplicantStatus = () => (dispatch) => {
  dispatch(removeExistingStatus({}));
};

export const saveFileUploadData = (formData) => (dispatch) => {
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  dispatch(setDataFetchingStatus(true));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .post("/application/fileUpload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      dispatch(setErrorMessage(response.data.message));
      dispatch(setDataFetchingStatus(false));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};

export const getInterviewSlotAvliable = (userId) => (dispatch) => {
  dispatch(removeInterviewSlot([]));
  dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .get(`application/interviewSlotAvailable/`)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setInterviewSlot(response.data));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const saveInterviewSlot = (body) => (dispatch) => {
  dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .post(`application/interviewSlotAvailable/`, body)
    .then((response) => {
      dispatch(setErrorMessage(response.data.message));
      dispatch(setDataFetchingStatus(false));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};

export const PaymentRequest = (body) => (dispatch) => {
  dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .post(`students/select-class/payment-request`, body)
    .then((response) => {
      dispatch(setPaymentResponse(response.data));
      dispatch(setErrorMessage(response.data.message));
      dispatch(setDataFetchingStatus(false));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const VapulsPaymentRequest = (body) => (dispatch) => {
  dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .post(`/application/payment-request/vapulus`, body)
    .then((response) => {
      dispatch(setPaymentResponse(response.data));
      dispatch(setErrorMessage(response.data.message));
      dispatch(setDataFetchingStatus(false));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};

export const getApplicantFee = (userId) => (dispatch) => {
  // dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .post(`application/getApplicationFeeDetails/`, userId)
    .then((response) => {
      // dispatch(setDataFetchingStatus(false));
      dispatch(setApplicantFee(response.data));
    })
    .catch((error) => {
      // dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const updateApplicantPaymentDetails = (userId) => (dispatch) => {
  dispatch(setDataFetchingStatus(true));
  dispatch(setErrorMessage(undefined));
  dispatch(setErrorStatusCode(undefined));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .get(`application/getApplicationFeeDetails/${userId}`)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(response.data.message));
    })
    .catch((error) => {
      // dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};

export default applicationSlice.reducer;
