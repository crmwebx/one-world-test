import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import About from "containers/Home/About/";
import Focus from "containers/Home/Focus";
import Gallery from "containers/Home/Gallery";
import News from "containers/Home/NewsLetter";
import Slide from "containers/Home/Slide";
import Backdrop from "components/Backdrop/";
import { loginRequest, isLoggedInUpdate } from "reduxSlices/loginSlice";
import { useSelector, useDispatch } from "react-redux";
import { isObjectEmpty } from "utils/general";
import SnackBar from "components/SnackBar";
import {
  removeWebSelectclassData,
  removeElementsFromArray,
} from "reduxSlices/selectClassSlice";
import {
  clearErrorStatusCode,
  clearErrorMessage,
  clearApplicationData,
  getApplicantStatus,
} from "reduxSlices/applicationSlice";

function Home(props) {
  const dispatch = useDispatch();
  const [showSnackBar, setShowSnackBar] = useState({
    status: false,
    message: "",
  });
  const loginRequestData = useSelector(
    (state) => state.loginRequest.loginRequestData
  );
  const dataFetchingStatus = useSelector(
    (state) => state.loginRequest.dataFetchingStatus
  );

  const dataFetchingStatusApp = useSelector(
    (state) => state.applicationData.dataFetchingStatus
  );

  const errorMessage = useSelector((state) => state.loginRequest.errorMessage);
  if (props.history.location.state !== undefined) {
    if (!isObjectEmpty(loginRequestData)) {
      let responseData = loginRequestData;
      window.localStorage.removeItem("email");
      window.localStorage.removeItem("password");
      window.localStorage.setItem("x-auth-token", responseData.token);
      window.localStorage.setItem("x-auth-fullname", responseData.fullname);
      window.localStorage.setItem("x-auth-contactId", responseData.contactid);
      window.localStorage.setItem("isUserLoggedIn", true);
      dispatch(isLoggedInUpdate(true));
    }
  }
  useEffect(() => {
    if (props.history.location.state !== undefined) {
      dispatch(
        loginRequest({
          email: window.localStorage.getItem("email"),
          password: window.localStorage.getItem("password"),
        })
      );
    }
  }, [props.history.location.state]);

  useEffect(() => {
    if (!isObjectEmpty(errorMessage) && errorMessage !== undefined) {
      let status = { ...showSnackBar };
      status.status = true;
      status.message = errorMessage.error;
      setShowSnackBar(status);
    }
  }, [errorMessage]);

  useEffect(() => {
    dispatch(
      getApplicantStatus(window.localStorage.getItem("x-auth-contactId"))
    );
    dispatch(removeWebSelectclassData([]));
    dispatch(removeElementsFromArray([]));
    dispatch(clearErrorStatusCode());
    dispatch(clearErrorMessage());
    dispatch(clearApplicationData());
  }, [dispatch]);

  const handleClose = () => {
    let status = { ...showSnackBar };
    status.status = false;
    setShowSnackBar(status);
  };
  return (
    <Aux>
      <Backdrop show={dataFetchingStatus || dataFetchingStatusApp} />
      <SnackBar
        open={showSnackBar.status}
        message={showSnackBar.message}
        handleClose={handleClose}
      />
      <Grid container>
        <Grid item container xs={12} style={{ margin: "0 auto" }}>
          <Slide />
        </Grid>
      </Grid>
      <Grid container style={{ background: "#EAEBED" }}>
        <Grid item container xs={12} sm={10} style={{ margin: "0 auto" }}>
          <About />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item container xs={12} sm={10} style={{ margin: "0 auto" }}>
          <Focus />
          <Gallery />
        </Grid>
      </Grid>
      <Grid container style={{ background: "#EAEBED" }}>
        <Grid item container xs={12} sm={10} style={{ margin: "0 auto" }}>
          <News />
        </Grid>
      </Grid>
    </Aux>
  );
}

export default Home;
