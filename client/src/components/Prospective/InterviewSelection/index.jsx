import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
} from "@material-ui/core/";
import moment from "moment";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import {
  saveInterviewSlot,
  getInterviewSlotAvliable,
  clearErrorMessage,
  clearErrorStatusCode,
} from "reduxSlices/applicationSlice";
import { useSelector, useDispatch } from "react-redux";
import Aux from "hoc/Auxilliary";
import Backdrop from "components/Backdrop/";
import { isObjectEmpty } from "utils/general";
import MessageIndicator from "components/SnackBar";

const useStyle = makeStyles((theme) => ({
  tableStyle: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

function InterviewSelection(props) {
  const classes = useStyle(props);
  const dispatch = useDispatch();
  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const [selectedValue, setSelectedValue] = useState(null);

  const interviewSlot = useSelector(
    (state) => state.applicationData.interviewSlot
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

  const applicantStatus = useSelector(
    (state) => state.applicationData.applicantStatus
  );

  useEffect(() => {
    if (applicantStatus.ses_applicantstatus !== undefined) {
      if (
        applicantStatus.ses_applicantstatus.ses_applicantstatus === 991490004
      ) {
      } else {
        props.history.replace("/home");
      }
    }
  }, [applicantStatus.ses_applicantstatus]);

  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedValue(event.target.value);
  };

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
    dispatch(clearErrorMessage());
    props.history.push("/login");
  };

  useEffect(() => {
    dispatch(getInterviewSlotAvliable());
  }, []);

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

  let interviewSlotsData = "";
  if (interviewSlot.length > 0) {
    interviewSlotsData = interviewSlot.map((element, index) => {
      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            <Radio
              checked={selectedValue === element.eslsca_interviewdateandtimeid}
              onChange={handleChange}
              value={element.eslsca_interviewdateandtimeid}
              name="radio-button-demo"
              inputProps={{ "aria-label": "A" }}
            />
          </TableCell>

          <TableCell>
            {moment.utc(element.eslsca_start).format("Do MMMM YYYY, h:mm a")}
          </TableCell>
          <TableCell>
            {moment.utc(element.eslsca_end).format("Do MMMM YYYY, h:mm a")}
          </TableCell>
        </TableRow>
      );
    });
  }

  const handleSnackbarClose = () => {
    let errorCopy = { ...error };
    errorCopy.showSnackbar = false;
    setError(errorCopy);
  };

  const handleSave = (event) => {
    event.preventDefault();

    const getinterviewSlot = interviewSlot.find(
      (element) => element.eslsca_interviewdateandtimeid === selectedValue
    );

    dispatch(
      saveInterviewSlot({
        contactid: window.localStorage.getItem("x-auth-contactId"),
        interviewSlot: getinterviewSlot,
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
      <Grid container style={{ margin: "1rem 0" }}>
        <Grid
          container
          xs={10}
          style={{ margin: "0 auto", width: "100%" }}
          item
          className={classes.tableStyle}
        >
          <TableContainer component={Paper}>
            <Table aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 600 }}>Select Item</TableCell>
                  <TableCell style={{ fontWeight: 600 }}>
                    Start Date and Time
                  </TableCell>
                  <TableCell style={{ fontWeight: 600 }}>
                    End Date and Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{interviewSlotsData}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Typography component="div" align="center" style={{ padding: "1rem 0" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSave}
          disabled={selectedValue === null}
        >
          Save
        </Button>
      </Typography>
    </Aux>
  );
}

export default InterviewSelection;
