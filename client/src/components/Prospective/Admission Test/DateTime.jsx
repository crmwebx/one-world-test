import React, { useState, useEffect } from "react";
import { Typography, Grid, Button } from "@material-ui/core/";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  SaveApplicationTestData,
  clearErrorMessage,
} from "reduxSlices/applicationSlice";
import { useSelector, useDispatch } from "react-redux";
import Aux from "hoc/Auxilliary";
import Backdrop from "components/Backdrop/";
import { isObjectEmpty } from "utils/general";
import MessageIndicator from "components/SnackBar";

const DateTime = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(
    new Date("2020-01-01T00:00:00")
  );
  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const applicationTest = useSelector(
    (state) => state.applicationData.applicationTest
  );
  const dataFetchingStatus = useSelector(
    (state) => state.applicationData.dataFetchingStatus
  );

  const errorMessage = useSelector(
    (state) => state.applicationData.errorMessage
  );

  const errorStatusCode = useSelector(
    (state) => state.applicationData.errorStatusCode
  );

  const handleDateChange = (date) => {
    const selecteddate = moment(date).format("MM/DD/YYYY, h:mm:ss a");
    setSelectedDate(selecteddate);
  };
  useEffect(() => {
    dispatch(clearErrorMessage());
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
    if (!isObjectEmpty(applicationTest)) {
      if (applicationTest.eslsca_eatscheduleddateandtime.length !== 0) {
        setSelectedDate(
          moment
            .utc(applicationTest.eslsca_eatscheduleddateandtime)
            .format("MM/DD/YYYY, h:mm:ss a")
        );
      }
    }
  }, [applicationTest]);

  const handleSnackbarClose = () => {
    let errorCopy = { ...error };
    errorCopy.showSnackbar = false;
    setError(errorCopy);
  };

  const handleSave = (event) => {
    event.preventDefault();
    console.log("selectedDate", selectedDate);
    dispatch(
      SaveApplicationTestData({
        ses_applicantid: applicationTest.ses_applicantid,
        eslsca_eattype: applicationTest.eslsca_eattype,
        eslsca_eatscheduleddateandtime: moment
          .utc(selectedDate)
          .format("MM/DD/YYYY, h:mm:ss a"),
      })
    );
  };
  var date = "";
  if (!isObjectEmpty(applicationTest)) {
    date = moment
      .utc(applicationTest.eslsca_eatscheduleddateandtime)
      .format("MMMM Do YYYY, h:mm:ss a");
  }
  return (
    <Aux>
      <MessageIndicator
        open={error.showSnackbar}
        message={error.message}
        handleClose={handleSnackbarClose}
      />
      <Backdrop show={dataFetchingStatus} />
      {!isObjectEmpty(applicationTest) &&
      applicationTest.eslsca_eatscheduleddateandtime.length !== 0 ? (
        <Typography variant="subtitle2">{`You are scheduled to take the EAT on ${date}`}</Typography>
      ) : (
        <Typography variant="subtitle2">{`You are not scheduled to take the EAT test, you can schedule now `}</Typography>
      )}
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Select Date"
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Select Time"
            value={selectedDate}
            minutesStep="30"
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change time",
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
      <Typography component="div" align="center" style={{ padding: "1rem 0" }}>
        <Button variant="outlined" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Typography>
    </Aux>
  );
};

export default DateTime;
