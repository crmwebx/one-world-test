import React, { useState, useEffect } from "react";
import { makeStyles, Typography, Grid, Button } from "@material-ui/core/";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import TableDialog from "components/Students/SelectClass/TableModal";

import { isObjectEmpty } from "utils/general";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import {
  getSelectClassDataFromAPI,
  addSelectModalData,
  clearErrorStatusCode,
  clearErrorMessage,
} from "reduxSlices/selectClassSlice";
import Backdrop from "components/Backdrop/";
import Aux from "hoc/Auxilliary";
import MessageIndicator from "components/SnackBar";

const useStyle = makeStyles((theme) => ({
  classConatiner: {
    padding: "1rem 0",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  classFont: {
    fontSize: "1.8rem",
    fontWeight: 500,
    flex: 1,
  },
}));

const TopItems = (props) => {
  const classes = useStyle(props);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const classDataFromAPI = useSelector(
    (state) => state.selectClassData.classDataFromAPI
  );

  console.log("classDataFromAPI", classDataFromAPI);

  const dataFetchingStatus = useSelector(
    (state) => state.selectClassData.dataFetchingStatus
  );

  const errorMessage = useSelector(
    (state) => state.selectClassData.errorMessage
  );
  // console.log("errorMessage",errorMessage)
  const errorStatusCode = useSelector(
    (state) => state.selectClassData.errorStatusCode
  );

  const applicantStatus = useSelector(
    (state) => state.applicationData.applicantStatus
  );

  useEffect(() => {
    if (!isObjectEmpty(classDataFromAPI)) {
      dispatch(addSelectModalData(classDataFromAPI.data));
    }
  }, [classDataFromAPI]);

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
    if (
      classDataFromAPI.length === 0 &&
      applicantStatus.ses_applicantstatus !== undefined
    ) {
      dispatch(
        getSelectClassDataFromAPI(
          applicantStatus.ses_applicantstatus.eslsca_studenttype
        )
      );
    }
    dispatch(clearErrorMessage());
  }, [dispatch, applicantStatus]);

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
      <Grid className={classes.classConatiner}>
        <Typography component="div" className={classes.classFont}>
          Select Classes
        </Typography>
        <Typography component="div">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            style={{ textTransform: "capitalize" }}
            onClick={handleClickOpen}
          >
            Add New
          </Button>
          <TableDialog open={open} handleClose={handleClose} />
        </Typography>
      </Grid>
    </Aux>
  );
};

export default withRouter(TopItems);
