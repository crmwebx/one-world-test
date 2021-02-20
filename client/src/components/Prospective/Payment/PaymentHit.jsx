import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  TextField,
} from "@material-ui/core/";
import publicIp from "public-ip";
import Cards from "react-credit-cards";
import styled from "styled-components";
import "react-credit-cards/es/styles-compiled.css";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import { withRouter } from "react-router-dom";
import {
  PaymentRequest,
  clearErrorMessage,
  clearErrorStatusCode,
  clearApplicantStatus,
  updateApplicantPaymentDetails,
} from "reduxSlices/applicationSlice";
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
  },
  cards: {
    display: "flex",
    margin: "0 auto",
    gap: "1rem",
    padding: "1rem",
  },
}));

const CardWrapper = styled.div`
  .rccs {
    margin: 0;
  }
`;
let ipAddress = "";
publicIp
  .v4()
  .then((res) => {
    ipAddress = res;
  })
  .catch((err) => console.log("cannot detect ip Address", err));

const PaymentHit = (props) => {
  if (props.location.state === undefined) {
    props.history.replace("/");
  }

  const classes = useStyle(props);
  const [cardDetails, setCardDetails] = React.useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const dispatch = useDispatch();
  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const dataFetchingStatus = useSelector(
    (state) => state.applicationData.dataFetchingStatus
  );
  const paymentResponse = useSelector(
    (state) => state.applicationData.paymentResponse
  );

  const errorMessage = useSelector(
    (state) => state.applicationData.errorMessage
  );

  const errorStatusCode = useSelector(
    (state) => state.applicationData.errorStatusCode
  );

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
    if (!isObjectEmpty(paymentResponse)) {
      // console.log("payment response", paymentResponse);
      if (paymentResponse.hasOwnProperty("3ds_url")) {
        const url = paymentResponse["3ds_url"];
        window.open(url, "_blank");
        props.history.replace("/home");
      } else if (
        paymentResponse.hasOwnProperty("response_code") &&
        paymentResponse.response_code === "14000"
      ) {
        dispatch(
          updateApplicantPaymentDetails(props.location.state.ses_applicantid)
        );
        props.history.replace("/home");
      }
    }
  }, [paymentResponse]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const cardsCopy = { ...cardDetails };
    cardsCopy[name] = value;

    setCardDetails(cardsCopy);
  };

  const handleSnackbarClose = () => {
    let errorCopy = { ...error };
    errorCopy.showSnackbar = false;
    setError(errorCopy);
  };

  const handelPaymentRequest = (e) => {
    // console.log("card", cardDetails);
    let randomString =
      props.location.state.ses_applicant + "-" + new Date().getSeconds();
    // console.log("ipAddress", ipAddress);
    dispatch(
      PaymentRequest({
        ...cardDetails,
        merchantReference: randomString,
        amount: parseInt(props.location.state.amount) * 100,
        ses_applicantid: props.location.state.ses_applicantid,
        emailaddress1: props.location.state.emailaddress1,
        ipAddress: ipAddress,
      })
    );
  };

  return (
    <Aux>
      <MessageIndicator
        open={error.showSnackbar}
        message={error.message}
        handleClose={handleSnackbarClose}
      />
      <Backdrop show={dataFetchingStatus} />
      <Grid container className={classes.main}>
        <Typography
          align="center"
          style={{ padding: "1rem", fontSize: "1.5rem" }}
        >
          Enter Payment Details
        </Typography>
        <Grid container item xs={12} sm={10} className={classes.cards}>
          <CardWrapper>
            <Cards
              cvc={cardDetails.cvc}
              expiry={cardDetails.expiry}
              focused={cardDetails.focus}
              name={cardDetails.name}
              number={cardDetails.number}
            />
          </CardWrapper>
          <form style={{ width: "50%" }}>
            <TextField
              onChange={handleInputChange}
              value={cardDetails.number}
              label="Card Number"
              variant="outlined"
              type="number"
              fullWidth
              name="number"
            />
            <TextField
              onChange={handleInputChange}
              value={cardDetails.name}
              name="name"
              label="Card Holder Name"
              variant="outlined"
              type="text"
              fullWidth
              style={{ marginTop: "0.5rem" }}
            />
            <Typography
              component="div"
              style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}
            >
              <TextField
                onChange={handleInputChange}
                value={cardDetails.expiry}
                label="Valid Thru(YYMM)"
                variant="outlined"
                type="number"
                fullWidth
                name="expiry"
              />
              <TextField
                onChange={handleInputChange}
                value={cardDetails.cvc}
                name="cvc"
                label="CVV/CVC"
                variant="outlined"
                type="number"
                fullWidth
              />
            </Typography>
            <Typography component="div" style={{ marginTop: "1rem" }}>
              <Button
                variant="contained"
                color="primary"
                disabled={
                  cardDetails.number.length < 16 ||
                  cardDetails.name.length < 4 ||
                  cardDetails.expiry.length < 4 ||
                  cardDetails.cvc.length < 3
                }
                onClick={handelPaymentRequest}
                style={{ textTransform: "capitalize" }}
              >
                {`Make Payment of ${props.location.state.amount} EGP`}
              </Button>
            </Typography>
          </form>
        </Grid>
      </Grid>
    </Aux>
  );
};

export default withRouter(PaymentHit);
