import React, { useState, useEffect } from "react";
import { makeStyles, Typography, Grid } from "@material-ui/core/";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getprofileData,
  updateProfileEditData,
} from "reduxSlices/profileSlice";
import { isObjectEmpty } from "utils/general";
import profileStyle from "components/profile/profileForms/profile.module.css";
import Aux from "hoc/Auxilliary";
import FormBuilder from "components/FormBuilder";
import FormData from "components/profile/profileForms/formData";
import Backdrop from "components/Backdrop/";
import SnackBar from "components/SnackBar";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import {
  clearErrorStatusCode,
  clearErrorMessage,
  clearApplicationData,
  clearApplicantStatus,
} from "reduxSlices/applicationSlice";

const useStyle = makeStyles((theme) => ({
  formDesignMain: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  formContainer: {
    padding: "0.9rem 0.7rem",
    margin: "0",
    background: "#005598",
    display: "flex",
    alignItems: "center",
    color: "#fff",
  },
  formDesign: {
    width: "95%",
    margin: "0 auto",
  },
}));

var formJson = {};
let {
  primaryDetails,
  contact,
  emergenencyContact,
  HomeAddress,
  mailingAddress,
} = FormData;

for (let key in primaryDetails) {
  formJson[key] = primaryDetails[key].value;
}
for (let key in contact) {
  formJson[key] = contact[key].value;
}
for (let key in emergenencyContact) {
  formJson[key] = emergenencyContact[key].value;
}
for (let key in HomeAddress) {
  formJson[key] = HomeAddress[key].value;
}
for (let key in mailingAddress) {
  formJson[key] = mailingAddress[key].value;
}

const ProfileDesign = (props) => {
  const classes = useStyle(props);
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profileData.profileData);

  const dataFetchingStatus = useSelector(
    (state) => state.profileData.dataFetchingStatus
  );

  const errorMessage = useSelector((state) => state.profileData.errorMessage);

  const errorStatusCode = useSelector(
    (state) => state.profileData.errorStatusCode
  );

  console.log("errorStatusCode", errorStatusCode);
  const [showSnackBar, setShowSnackBar] = useState({
    status: false,
    message: "",
  });
  useEffect(() => {
    dispatch(getprofileData(window.localStorage.getItem("x-auth-contactId")));
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
    dispatch(clearApplicationData());
    dispatch(clearApplicantStatus());
    props.history.push("/login");
  };
  useEffect(() => {
    if (!isObjectEmpty(errorMessage) && errorMessage !== undefined) {
      if (errorStatusCode === 401) {
        let status = { ...showSnackBar };
        status.status = true;
        status.message = "Session Expired";
        setShowSnackBar(status);
        setTimeout(() => {
          handelLogout();
        }, 1600);
      } else {
        let status = { ...showSnackBar };
        status.status = true;
        status.message = errorMessage;
        setShowSnackBar(status);
      }
    }
  }, [errorMessage, errorStatusCode]);

  const [jsonData, setJsonData] = useState(formJson);

  const textFieldChangeHandler = (event) => {
    const formJsonCopy = { ...jsonData };
    formJsonCopy[event.target.name] = event.target.value;
    setJsonData(formJsonCopy);
    dispatch(updateProfileEditData(formJsonCopy));
  };

  useEffect(() => {
    if (!isObjectEmpty(profileData)) {
      setJsonData(profileData);
      dispatch(updateProfileEditData(profileData));
    }
  }, [profileData, dispatch]);

  const handleClose = () => {
    let status = { ...showSnackBar };
    status.status = false;
    setShowSnackBar(status);
  };

  const handelChange = (event, eventName) => {
    const formJsonCopy = { ...jsonData };
    formJsonCopy[eventName] = event.target.value;
    setJsonData(formJsonCopy);
    dispatch(updateProfileEditData(formJsonCopy));
  };

  return (
    <Aux>
      <Backdrop show={dataFetchingStatus} />
      <SnackBar
        open={showSnackBar.status}
        message={showSnackBar.message}
        handleClose={handleClose}
      />
      <Grid container item className={classes.formDesignMain}>
        <Grid
          direction="column"
          container
          item
          className={`${profileStyle.mainConatiner} ${profileStyle.conatinerWidth}`}
          style={{ alignSelf: "flex-start" }}
        >
          <Typography component="div" className={classes.formContainer}>
            Personal Information
          </Typography>
          <div className={classes.formDesign}>
            <FormBuilder
              formDetails={FormData.primaryDetails}
              value={jsonData}
              changed={(event) => textFieldChangeHandler(event)}
              handelChange={handelChange}
            />
          </div>
        </Grid>
        <Grid
          className={profileStyle.conatinerWidth}
          direction="column"
          container
        >
          <Grid
            direction="column"
            container
            item
            className={profileStyle.mainConatiner}
          >
            <Typography component="div" className={classes.formContainer}>
              Contact Information
            </Typography>
            <div className={classes.formDesign}>
              <FormBuilder
                formDetails={FormData.contact}
                value={jsonData}
                changed={(event) => textFieldChangeHandler(event)}
              />
            </div>
          </Grid>
          <Grid
            direction="column"
            container
            item
            className={profileStyle.mainConatiner}
          >
            <Typography component="div" className={classes.formContainer}>
              Emergency contact
            </Typography>
            <div className={classes.formDesign}>
              <FormBuilder
                formDetails={FormData.emergenencyContact}
                value={jsonData}
                changed={(event) => textFieldChangeHandler(event)}
              />
            </div>
          </Grid>
        </Grid>
        <Grid
          className={profileStyle.conatinerWidth}
          container
          direction="column"
        >
          <Grid
            direction="column"
            container
            item
            className={profileStyle.mainConatiner}
          >
            <Typography component="div" className={classes.formContainer}>
              Home address
            </Typography>
            <div className={classes.formDesign}>
              <FormBuilder
                formDetails={FormData.HomeAddress}
                value={jsonData}
                changed={(event) => textFieldChangeHandler(event)}
              />
            </div>
          </Grid>
          <Grid
            direction="column"
            container
            item
            className={profileStyle.mainConatiner}
          >
            <Typography component="div" className={classes.formContainer}>
              Mailing address (if different)
            </Typography>
            <div className={classes.formDesign}>
              <FormBuilder
                formDetails={FormData.mailingAddress}
                value={jsonData}
                changed={(event) => textFieldChangeHandler(event)}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Aux>
  );
};

export default withRouter(ProfileDesign);
