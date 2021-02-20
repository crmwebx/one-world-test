import React, { useState, useEffect } from "react";
import { makeStyles, Grid, Typography } from "@material-ui/core/";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import {
  clearErrorMessage,
  clearErrorStatusCode,
  clearApplicantStatus,
} from "reduxSlices/applicationSlice";
import { getTxnDetails } from "reduxSlices/selectClassSlice";
import { useSelector, useDispatch } from "react-redux";
import Aux from "hoc/Auxilliary";
import Backdrop from "components/Backdrop/";
import { isObjectEmpty } from "utils/general";
import MessageIndicator from "components/SnackBar";

const useStyle = makeStyles((theme) => ({
  main: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
  },
  cards: {
    display: "flex",
    margin: "0 auto",
    gap: "1rem",
    padding: "1rem",
  },
}));

const PaymentHandler = (props) => {
  const classes = useStyle(props);
  const dispatch = useDispatch();
  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const dataFetchingStatus = useSelector(
    (state) => state.selectClassData.dataFetchingStatus
  );
  const paymentResponse = useSelector(
    (state) => state.selectClassData.paymentResponse
  );

  const errorMessage = useSelector(
    (state) => state.selectClassData.errorMessage
  );

  const errorStatusCode = useSelector(
    (state) => state.selectClassData.errorStatusCode
  );
  // console.log("props detais", queryString.parse(props.location.search));
  useEffect(() => {
    dispatch(clearErrorMessage());
  }, [dispatch]);

  const handelLogout = () => {
    dispatch(clearLoginData());
    window.localStorage.removeItem("x-auth-token");
    window.localStorage.removeItem("x-auth-fullname");
    window.localStorage.removeItem("x-auth-contactId");
    window.localStorage.removeItem("isUserLoggedIn");
    dispatch(isLoggedInUpdate(false));
    dispatch(clearErrorStatusCode());
    dispatch(clearApplicantStatus());
    dispatch(clearErrorMessage());
    props.history.push("/login");
  };

  useEffect(() => {
    if (!isObjectEmpty(errorMessage) && errorMessage !== undefined) {
      if (errorStatusCode === 401) {
        let error = {
          isError: false,
          message: "Session Expired",
          showSnackbar: true,
        };
        setError(error);
        setTimeout(() => {
          handelLogout();
        }, 1600);
      } else {
        let error = {
          isError: false,
          message: errorMessage,
          showSnackbar: true,
        };
        setError(error);
      }
    }
  }, [errorMessage, errorStatusCode]);

  useEffect(() => {
    const querParms = queryString.parse(props.location.search);
    // console.log("querParms", querParms);
    dispatch(getTxnDetails(querParms.transactionId));
  }, [dispatch, props.location.search]);

  const handleSnackbarClose = () => {
    let errorCopy = { ...error };
    errorCopy.showSnackbar = false;
    setError(errorCopy);
  };

  // const handelPaymentRequest = (e) => {
  //   // console.log("card", cardDetails);
  //   let randomString =
  //     props.location.state.ses_applicant + "-" + new Date().getSeconds();
  //   // console.log("ipAddress", ipAddress);
  //   dispatch(
  //     PaymentRequest({
  //       ...cardDetails,
  //       merchantReference: randomString,
  //       amount: parseInt(props.location.state.amount) * 100,
  //       ses_applicantid: props.location.state.ses_applicantid,
  //       emailaddress1: props.location.state.emailaddress1,
  //       ipAddress: ipAddress,
  //     })
  //   );
  // };

  return (
    <Aux>
      <MessageIndicator
        open={error.showSnackbar}
        message={error.message}
        handleClose={handleSnackbarClose}
      />
      <Backdrop show={dataFetchingStatus} />

      <Grid
        container
        item
        className={classes.main}
        xs={6}
        style={{ height: "18rem" }}
      >
        <Typography
          align="center"
          style={{ padding: "1rem", fontSize: "1.5rem" }}
        >
          Payment - {queryString.parse(props.location.search).status}
        </Typography>
      </Grid>
    </Aux>
  );
};

export default withRouter(PaymentHandler);
