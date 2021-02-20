import { createSlice } from "@reduxjs/toolkit";
import axios from "app/axios";

export const selectClassSlice = createSlice({
  name: "selectClassSlice",
  initialState: {
    selectClassData: [],
    terms: [],
    classDataFromAPI: [],
    modalData: [],
    txnDetails: {},
    price: 0,
    euroPrice: 0,
    paymentResponse: "",
    errorMessage: undefined,
    dataFetchingStatus: false,
    errorStatusCode: undefined,
  },

  reducers: {
    setSelectclassData: (state, action) => {
      state.selectClassData.push(action.payload);
    },
    setPaymentResponse: (state, action) => {
      state.paymentResponse = action.payload;
    },
    setSelectclassDataAfterModify: (state, action) => {
      state.selectClassData = action.payload;
    },
    setTxnDetails: (state, action) => {
      state.txnDetails = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setEuroPrice: (state, action) => {
      state.euroPrice = action.payload;
    },
    setWebSelectclassData: (state, action) => {
      state.classDataFromAPI = action.payload;
    },
    setTermsData: (state, action) => {
      state.terms = action.payload;
    },
    setModalData: (state, action) => {
      state.modalData = action.payload;
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
      state.selectClassData = action.payload;
    },
    removeWebSelectclassData: (state, action) => {
      state.classDataFromAPI = action.payload;
    },
    removeModalSelectclassData: (state, action) => {
      state.modalData = action.payload;
    },
    removeTxnDetails: (state, action) => {
      state.txnDetails = action.payload;
    },
    clearPaymentResponse: (state, action) => {
      state.paymentResponse = action.payload;
    },
  },
});

export const {
  setSelectclassData,
  setSelectclassDataAfterModify,
  setWebSelectclassData,
  setErrorMessage,
  setModalData,
  setErrorStatusCode,
  setDataFetchingStatus,
  removeElementsFromArray,
  setTermsData,
  setPrice,
  setEuroPrice,
  removeWebSelectclassData,
  removeModalSelectclassData,
  setPaymentResponse,
  clearPaymentResponse,
  removeTxnDetails,
  setTxnDetails,
} = selectClassSlice.actions;

export const getSelectClassDataFromAPI = (data) => (dispatch) => {
  dispatch(removeWebSelectclassData([]));
  dispatch(removeElementsFromArray([]));
  dispatch(setDataFetchingStatus(true));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .get(`students/select-class?studentType=${data}`)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setWebSelectclassData(response.data));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
export const getTxnDetails = (data) => (dispatch) => {
  dispatch(setDataFetchingStatus(true));
  // dispatch(removeTxnDetails({}));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .get(`/application/payment-request/vapulus/${data}`)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setTxnDetails(response.data));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};

export const paymentRequest = (data) => (dispatch) => {
  dispatch(setDataFetchingStatus(true));
  dispatch(clearPaymentResponse(""));
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + window.localStorage.getItem("x-auth-token");
  axios
    .post(`students/select-class/payment-request`, data)
    .then((response) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setPaymentResponse(response.data));
    })
    .catch((error) => {
      dispatch(setDataFetchingStatus(false));
      dispatch(setErrorMessage(error.response.data.error));
      dispatch(setErrorStatusCode(error.response.status));
    });
};
// export const updateParmsForClass = (data) => (dispatch) => {
//   dispatch(setDataFetchingStatus(true));
//   axios.defaults.headers.common["Authorization"] =
//     "Bearer " + window.localStorage.getItem("x-auth-token");
//   axios
//     .post(`class/update`, data)
//     .then((response) => {
//       dispatch(setDataFetchingStatus(false));
//       dispatch(setErrorMessage(response.data.message));
//     })
//     .catch((error) => {
//       dispatch(setDataFetchingStatus(false));
//       dispatch(setErrorMessage(error.response.data.error));
//       dispatch(setErrorStatusCode(error.response.status));
//     });
// };
// export const getTermData = () => (dispatch) => {
//   dispatch(removeElementsFromArray([]));
//   dispatch(setDataFetchingStatus(true));
//   axios.defaults.headers.common["Authorization"] =
//     "Bearer " + window.localStorage.getItem("x-auth-token");
//   axios
//     .get(`class/classes/getTerms`)
//     .then((response) => {
//       // dispatch(setDataFetchingStatus(false));
//       dispatch(setTermsData(response.data));
//     })
//     .catch((error) => {
//       // dispatch(setDataFetchingStatus(false));
//       dispatch(setErrorMessage(error.response.data.error));
//       dispatch(setErrorStatusCode(error.response.status));
//     });
// };
export const clearSelectClassData = () => (dispatch) => {
  dispatch(removeElementsFromArray([]));
};
export const addSelectClassData = (classData) => (dispatch) => {
  dispatch(setSelectclassData(classData));
};
export const addSelectModalData = (classData) => (dispatch) => {
  dispatch(removeModalSelectclassData([]));
  dispatch(setModalData(classData));
};

export const clearErrorStatusCode = () => (dispatch) => {
  dispatch(setErrorStatusCode(undefined));
};
export const clearErrorMessage = () => (dispatch) => {
  dispatch(setErrorMessage(undefined));
};

export const removeParticularModalData = (data) => (dispatch) => {
  dispatch(setSelectclassDataAfterModify(data));
};
export const updatePrice = (price) => (dispatch) => {
  dispatch(setPrice(price));
};
export const updateEuroPrice = (price) => (dispatch) => {
  dispatch(setEuroPrice(price));
};

export default selectClassSlice.reducer;
