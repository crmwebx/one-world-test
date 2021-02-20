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
import {
  SaveApplicationTestOnlineData,
  clearErrorMessage,
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

function Online(props) {
  const classes = useStyle(props);
  const dispatch = useDispatch();
  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const [selectedValue, setSelectedValue] = React.useState(null);

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

  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedValue(event.target.value);
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

  let mapFileUploadFields = "";
  if (applicationTest.slots.length > 0) {
    mapFileUploadFields = applicationTest.slots.map((element, index) => {
      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            <Radio
              checked={selectedValue === element.eslsca_eatdateandtimeid}
              onChange={handleChange}
              value={element.eslsca_eatdateandtimeid}
              name="radio-button-demo"
              inputProps={{ "aria-label": "A" }}
            />
          </TableCell>

          <TableCell>
            {moment
              .utc(element.eslsca_proctordateandtime)
              .format("Do MMMM YYYY, h:mm a")}
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

    const selelctedTimeSlot = applicationTest.slots.find(
      (element) => element.eslsca_eatdateandtimeid === selectedValue
    );

    dispatch(
      SaveApplicationTestOnlineData({
        ses_applicantid: applicationTest.ses_applicantid,
        eslsca_eatdateandtimeid: selectedValue,
        eslsca_numberofslotstaken_date:
          selelctedTimeSlot.eslsca_proctordateandtime,
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
      <Grid container item className={classes.tableStyle}>
        <TableContainer component={Paper}>
          <Table aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Select Item</TableCell>
                <TableCell style={{ fontWeight: 600 }}>
                  Avaliable Slots
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{mapFileUploadFields}</TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Typography component="div" align="center" style={{ padding: "1rem 0" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSave}
          disabled={selectedValue == null}
        >
          Save
        </Button>
      </Typography>
    </Aux>
  );
}

export default Online;
