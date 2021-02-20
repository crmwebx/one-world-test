import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
} from "@material-ui/core/";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { useSelector, useDispatch } from "react-redux";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import registerStyle from "components/Register/RegisterItems/registerItems.module.css";
import logo from "assests/logo.png";
import { registerRequest } from "reduxSlices/registerSlice";
import Backdrop from "components/Backdrop/";
import Aux from "hoc/Auxilliary";
import SnackBar from "components/SnackBar";
import config from "app/config";
import { isObjectEmpty } from "utils/general";

const useStyle = makeStyles((theme) => ({
  container: {
    margin: "0",
    padding: "1rem 0",
  },
  itemContainer: {
    background: "red",
    margin: "0 auto",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  logoAvatar: {
    width: "30%",
    height: "auto",
  },
  bottomContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "1rem",
  },
}));

const RegisterItems = (props) => {
  const classes = useStyle(props);

  const registerRequestData = useSelector(
    (state) => state.resgisterRequest.registerRequestData
  );
  const errorMessage = useSelector(
    (state) => state.resgisterRequest.errorMessage
  );
  const dispatch = useDispatch();

  if (registerRequestData.token !== undefined) {
    dispatch(clearLoginData());
    window.localStorage.removeItem("x-auth-token");
    window.localStorage.removeItem("x-auth-fullname");
    window.localStorage.removeItem("x-auth-contactId");
    window.localStorage.removeItem("isUserLoggedIn");
    dispatch(isLoggedInUpdate(false));
    window.localStorage.setItem("x-auth-token", registerRequestData.token);
    props.history.push({
      pathname: "/home",
      state: { isRegister: true },
    });
  }
  const dataFetchingStatus = useSelector(
    (state) => state.resgisterRequest.dataFetchingStatus
  );

  // const errorMessage = useSelector(
  //   (state) => state.resgisterRequest.errorMessage
  // );
  const [showSnackBar, setShowSnackBar] = useState({
    status: false,
    message: "",
  });
  const [registerData, setregisterData] = useState({
    form: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const [confirmPassword, setConfirmPssword] = useState("");
  const [isValid, setIsValid] = useState(false);
  let emailExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const textFieldChangeHandler = (event) => {
    const formData = { ...registerData.form };
    if (event.target.name === "email") {
      setIsValid(!emailExp.test(String(event.target.value).toLowerCase()));
    }
    formData[event.target.name] = event.target.value.trim();
    setregisterData({
      form: formData,
    });
  };

  const confirmPasswordChangeHandler = (event) => {
    setConfirmPssword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!(registerData.form.password === confirmPassword)) {
      let status = { ...showSnackBar };
      status.status = true;
      status.message = config.CONFIRM_PASSWORD;
      setShowSnackBar(status);
    } else {
      window.localStorage.setItem("email", registerData.form.email);
      window.localStorage.setItem("password", registerData.form.password);
      dispatch(registerRequest(registerData.form));
    }
  };

  useEffect(() => {
    if (!isObjectEmpty(errorMessage) && errorMessage !== undefined) {
      let status = { ...showSnackBar };
      status.status = true;
      status.message = errorMessage.error;
      setShowSnackBar(status);
    }
  }, [errorMessage]);

  const handleClose = () => {
    let status = { ...showSnackBar };
    status.status = false;
    setShowSnackBar(status);
  };

  return (
    <Aux>
      <SnackBar
        open={showSnackBar.status}
        message={showSnackBar.message}
        handleClose={handleClose}
      />
      <Backdrop show={dataFetchingStatus} />
      <div className={registerStyle.registerContainer}>
        <div className={registerStyle.registerContent}>
          <div className={classes.logoAvatar}>
            <img src={logo} width="100%" alt="Eslsca logo" />
          </div>

          <Typography component="h1" variant="h5">
            Register
          </Typography>

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              name="firstName"
              value={registerData.form.firstName}
              onChange={textFieldChangeHandler}
              label="First Name"
              autoComplete="first-name"
              color="secondary"
              InputProps={{
                endAdornment: <AccountBoxIcon style={{ color: "#959595" }} />,
              }}
              inputProps={{
                maxLength: 100,
                minLength: 3,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="text"
              name="lastName"
              value={registerData.form.lastName}
              onChange={textFieldChangeHandler}
              label="Last Name"
              autoComplete="last-name"
              color="secondary"
              InputProps={{
                endAdornment: <AccountBoxIcon style={{ color: "#959595" }} />,
              }}
              inputProps={{
                maxLength: 100,
                minLength: 3,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              name="email"
              value={registerData.form.email}
              onChange={textFieldChangeHandler}
              label="Email Address"
              autoComplete="email"
              color="secondary"
              InputProps={{
                endAdornment: <MailOutlineIcon style={{ color: "#959595" }} />,
              }}
              inputProps={{
                maxLength: 100,
              }}
            />
            {isValid && (
              <Typography style={{ color: "#f50057", fontSize: "0.8rem" }}>
                {"Invalid Email"}
              </Typography>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={registerData.form.password}
              onChange={textFieldChangeHandler}
              label="Password"
              type="password"
              autoComplete="current-password"
              color="secondary"
              InputProps={{
                endAdornment: <LockOutlinedIcon style={{ color: "#959595" }} />,
              }}
              inputProps={{
                maxLength: 16,
                minLength: 4,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="current-password"
              color="secondary"
              onChange={confirmPasswordChangeHandler}
              value={confirmPassword}
              InputProps={{
                endAdornment: <LockOutlinedIcon style={{ color: "#959595" }} />,
              }}
              inputProps={{
                maxLength: 16,
                minLength: 4,
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isValid}
            >
              Register
            </Button>
            <Grid container className={classes.bottomContainer}>
              <Typography>
                <span> Already an account ?</span>
                <Link
                  variant="body2"
                  style={{ cursor: "pointer", marginLeft: "4px" }}
                  onClick={() => {
                    props.history.push("/login");
                  }}
                >
                  SIGN IN
                </Link>
              </Typography>
            </Grid>
          </form>
        </div>
      </div>
    </Aux>
  );
};

export default RegisterItems;
