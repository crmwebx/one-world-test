import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core/";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import {
  getApplicationTestData,
  clearErrorStatusCode,
  clearErrorMessage,
  clearApplicantStatus,
} from "reduxSlices/applicationSlice";
import { isObjectEmpty } from "utils/general";
import FormHeader from "components/FormHeader";
import Backdrop from "components/Backdrop/";
import Aux from "hoc/Auxilliary";
import MessageIndicator from "components/SnackBar";
import DateTime from "components/Prospective/Admission Test/DateTime";
import OnlineComponent from "components/Prospective/Admission Test/Online";

const useStyle = makeStyles((theme) => ({
  root: {
    padding: "1rem 0",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  main: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
}));

const AdmissionTest = (props) => {
  const classes = useStyle(props);
  const dispatch = useDispatch();
  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });
  const [value, setValue] = useState("online");

  const dataFetchingStatus = useSelector(
    (state) => state.applicationData.dataFetchingStatus
  );

  const errorMessage = useSelector(
    (state) => state.applicationData.errorMessage
  );

  const errorStatusCode = useSelector(
    (state) => state.applicationData.errorStatusCode
  );

  const applicantStatus = useSelector(
    (state) => state.applicationData.applicantStatus
  );

  useEffect(() => {
    if (applicantStatus.ses_applicantstatus !== undefined) {
      if (
        applicantStatus.ses_applicantstatus.ses_applicantstatus === 991490000 ||
        applicantStatus.ses_applicantstatus.ses_applicantstatus === 991490001
      ) {
      } else {
        props.history.replace("/home");
      }
    }
  }, [applicantStatus.ses_applicantstatus]);

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

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    dispatch(clearErrorMessage());
    dispatch(
      getApplicationTestData(window.localStorage.getItem("x-auth-contactId"))
    );
  }, [dispatch]);

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

  const handleSnackbarClose = () => {
    let errorCopy = { ...error };
    errorCopy.showSnackbar = false;
    setError(errorCopy);
  };

  return (
    <Aux>
      <MessageIndicator
        open={error.showSnackbar}
        message={error.message}
        handleClose={handleSnackbarClose}
      />
      <Backdrop show={dataFetchingStatus} />
      <Typography align="center" component="div" className={classes.root}>
        <FormHeader name="ESLSCA Admission Test" />
      </Typography>

      <Grid className={classes.main}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Mode of Test</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={value}
            onChange={handleChange}
            row
          >
            <FormControlLabel
              value="online"
              control={<Radio />}
              label="Online"
            />
            <FormControlLabel
              value="classroom"
              control={<Radio />}
              label="Classroom"
            />
          </RadioGroup>
          <Grid>{value === "online" ? <DateTime /> : <OnlineComponent />}</Grid>
        </FormControl>
      </Grid>
    </Aux>
  );
};

export default withRouter(AdmissionTest);
