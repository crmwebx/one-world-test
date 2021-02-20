import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  Grid,
  Button,
  FormGroup,
  Checkbox,
  TextField,
  FormControlLabel,
} from "@material-ui/core/";
import { useSelector, useDispatch } from "react-redux";
import { isObjectEmpty } from "utils/general";
import {
  postApplicationData,
  clearErrorStatusCode,
  clearErrorMessage,
  clearApplicationData,
  clearApplicantStatus,
} from "reduxSlices/applicationSlice";
import Backdrop from "components/Backdrop/";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { withRouter } from "react-router-dom";
import FormHeader from "components/FormHeader";
import MessageIndicator from "components/SnackBar";
import Aux from "hoc/Auxilliary";

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
  conatinerWidth: {
    width: "50%",
  },
  formDesign: {
    width: "97%",
    margin: "0 auto",
    fontSize: "0.9rem",
  },
  fontAdjustment: {
    fontSize: "0.9rem",
  },
}));

const TermsCondition = (props) => {
  const classes = useStyle(props);

  const getEslsca_accepttermsanddonditions = window.localStorage.getItem(
    "eslsca_accepttermsanddonditions"
  );

  const getEslsca_esignature = window.localStorage.getItem("eslsca_esignature");

  const dispatch = useDispatch();

  const dataFetchingStatus = useSelector(
    (state) => state.applicationData.dataFetchingStatus
  );

  const errorMessage = useSelector(
    (state) => state.applicationData.errorMessage
  );
  // console.log("errorMessage",errorMessage)
  const errorStatusCode = useSelector(
    (state) => state.applicationData.errorStatusCode
  );

  const [terms, setTerms] = useState({
    eslsca_accepttermsanddonditions: getEslsca_accepttermsanddonditions,
    eslsca_esignature: getEslsca_esignature,
  });

  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const handelLogout = () => {
    dispatch(clearLoginData());
    window.localStorage.removeItem("x-auth-token");
    window.localStorage.removeItem("x-auth-fullname");
    window.localStorage.removeItem("x-auth-contactId");
    window.localStorage.removeItem("isUserLoggedIn");
    window.localStorage.removeItem("eslsca_accepttermsanddonditions");
    window.localStorage.removeItem("eslsca_esignature");
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
        if (errorStatusCode === 200) {
          let error = {
            isError: false,
            message: "Your Application has been submitted",
            showSnackbar: true,
          };
          setError(error);
          setTimeout(() => {
            props.history.replace("/home");
          }, 1000);
        } else {
          let error = {
            isError: false,
            message: errorMessage,
            showSnackbar: true,
          };
          setError(error);
        }
      }
    }
  }, [errorMessage, errorStatusCode]);

  const textFieldChangeHandler = (event) => {
    const termsCopy = { ...terms };
    termsCopy[event.target.name] = event.target.value;
    setTerms(termsCopy);
  };

  const handleCheck = (event, eventName) => {
    console.log("event", event.target);
    const termsCopy = { ...terms };
    if (eventName === "eslsca_accepttermsanddonditions") {
      termsCopy[eventName] = event.target.checked;
    }
    setTerms(termsCopy);
  };

  const handleSave = () => {
    dispatch(
      postApplicationData({
        ...terms,
        key: 6,
        contactid: window.localStorage.getItem("x-auth-contactId"),
      })
    );
  };

  const handleClose = () => {
    let errorCopy = { ...error };
    errorCopy.showSnackbar = false;
    setError(errorCopy);
  };

  return (
    <Aux>
      <MessageIndicator
        open={error.showSnackbar}
        message={error.message}
        handleClose={handleClose}
      />
      <Backdrop show={dataFetchingStatus} />
      <Grid container>
        <Grid
          conatiner
          item
          xs={12}
          sm={8}
          style={{ margin: "0 auto", padding: "1rem 0" }}
        >
          <FormHeader name="Application Terms and Conditions" />
          <Typography component="div" className={classes.formDesign}>
            <Typography
              style={{ marginTop: "0.5rem" }}
              className={classes.fontAdjustment}
            >
              • This application is only valid for the selected program.
            </Typography>
            <Typography className={classes.fontAdjustment}>
              • The validity of this application is one year from the date of
              the submission.
            </Typography>
            <Typography className={classes.fontAdjustment}>
              • The application fee is non-refundable
            </Typography>
            <Typography className={classes.fontAdjustment}>
              • The schedule of choice in the application is for reference only,
              and ESLSCA reserves the right to publish classes with different
              schedules based upon our internal research and reports.
            </Typography>
            <Typography className={classes.fontAdjustment}>
              • ESLSCAUniversity has the right to cancel this application
              without prior notice.
            </Typography>
            <Typography className={classes.fontAdjustment}>
              • Decisions taken by ESLSCAUniversity are in good faith,based on
              the statements made in the students’ admission application, any
              false statements / omission of information discovered in the
              students’ application, the University reserves the right to
              withdraw, amend its offer, or terminate the students’ registration
              at ESLSCAUniversity.
            </Typography>
            <Typography className={classes.fontAdjustment}>
              • ESLSCAUniversity holds the right:
            </Typography>
            <ul>
              <li>
                For all the foregoing reasons, ESLSCA reserves the right not to
                provide any particular course, curriculum or facility to make
                variations to the content or method of delivery of courses, to
                discontinue courses and to merge or combine courses if such
                action is reasonably considered to be necessary by ESLSCA. If
                ESLSCA discontinues any course it will use reasonable endeavors
                to provide a suitable alternative and will take all reasonable
                steps to minimize any disruption that might result from such
                changes.
              </li>
              <li>
                Any offer of a place at ESLSCAUniversity is made on the
                understanding that; in accepting it the student undertakes to
                observe the Ordinances and Resolutions of the University and to
                abide by the rules and regulations that the University makes for
                its students from time to time. These currently include general
                disciplinary regulations and rules relating to examinations,
                libraries, and computing.
              </li>
            </ul>
          </Typography>
          <Grid direction="column" container item>
            <div className={classes.formDesign}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={terms.eslsca_accepttermsanddonditions}
                      onChange={(event) =>
                        handleCheck(event, "eslsca_accepttermsanddonditions")
                      }
                      name="eslsca_accepttermsanddonditions"
                      style={{ fontSize: "0.5rem" }}
                    />
                  }
                  label="By checking the “I accept” you hereby agree to all the points mentioned in the terms and conditions agreement, these terms govern your relationship with ESLSCA university, and are subject to change at any time without prior notification, it is your responsibility to stay updated with any changes made"
                />
              </FormGroup>
              <TextField
                label="Type your name as an e-Signature"
                type="text"
                autoComplete="e-Signature"
                value={terms.eslsca_esignature}
                name="eslsca_esignature"
                onChange={textFieldChangeHandler}
                fullWidth
                InputProps={{
                  endAdornment: <AccountBoxIcon />,
                }}
              />
            </div>
          </Grid>
          <Typography
            component="div"
            style={{ display: "flex", paddingTop: "1rem" }}
          >
            <Typography component="div">
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  props.history.replace("/prospective/application")
                }
                startIcon={<NavigateBeforeIcon />}
              >
                Back
              </Button>
            </Typography>
            <Typography
              component="div"
              align="center"
              style={{ width: "100%" }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSave}
                disabled={
                  !terms.eslsca_accepttermsanddonditions ||
                  terms.eslsca_esignature.length === 0
                }
              >
                Submit
              </Button>
            </Typography>
          </Typography>
        </Grid>
      </Grid>
    </Aux>
  );
};

export default withRouter(TermsCondition);
