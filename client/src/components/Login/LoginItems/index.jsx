import React, { useState, useEffect } from "react";
import { makeStyles, Typography, Grid, Link } from "@material-ui/core/";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useSelector, useDispatch } from "react-redux";
import loginStyle from "components/Login/LoginItems/loginItems.module.css";
import Backdrop from "components/Backdrop/";
import Aux from "hoc/Auxilliary";
import logo from "assests/logo.png";
import { loginRequest, isLoggedInUpdate } from "reduxSlices/loginSlice";
import Input from "components/Ui/input";
import Button from "components/Ui/Button";
import { isObjectEmpty } from "utils/general";
import SnackBar from "components/SnackBar";

const useStyle = makeStyles((theme) => ({
  container: {
    margin: "0",
    padding: "1rem 0",
  },
  itemContainer: {
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
  formControl: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  bottomContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "1rem",
  },
}));

const LoginItems = (props) => {
  const classes = useStyle(props);
  const dispatch = useDispatch();
  const loginRequestData = useSelector(
    (state) => state.loginRequest.loginRequestData
  );

  const errorMessage = useSelector((state) => state.loginRequest.errorMessage);

  if (!isObjectEmpty(loginRequestData)) {
    let responseData = loginRequestData;
    window.localStorage.setItem("x-auth-token", responseData.token);
    window.localStorage.setItem("x-auth-fullname", responseData.fullname);
    window.localStorage.setItem("x-auth-contactId", responseData.contactid);
    window.localStorage.setItem("x-auth-email", responseData.emailaddress1);
    window.localStorage.setItem("x-auth-mobile", responseData.mobilephone);
    window.localStorage.setItem("isUserLoggedIn", true);
    dispatch(isLoggedInUpdate(true));
    props.history.push({
      pathname: "/home",
    });
  }
  const dataFetchingStatus = useSelector(
    (state) => state.loginRequest.dataFetchingStatus
  );

  // const errorMessage = useSelector((state) => state.loginRequest.errorMessage);

  const [loginData, setLoginData] = useState({
    form: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          label: "Email Address",
          autoComplete: "email",
          name: "email",
          required: true,
          autoFocus: true,
          fullWidth: true,
        },
        icon: <MailOutlineIcon style={{ color: "#959595" }} />,
        value: "",
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          label: "Password",
          autoComplete: "current-password",
          name: "password",
          required: true,
          fullWidth: true,
        },
        icon: <LockOutlinedIcon style={{ color: "#959595" }} />,
        value: "",
      },
    },
  });
  const [showSnackBar, setShowSnackBar] = useState({
    status: false,
    message: "",
  });
  const textFieldChangeHandler = (event) => {
    const formData = { ...loginData.form };
    formData[event.target.name].value = event.target.value.trim();
    setLoginData((prevState) => ({
      ...prevState,
      form: formData,
    }));
  };
  // console.log("loginRequestData",loginRequestData,errorMessage,showSnackBar)
  useEffect(() => {
    if (!isObjectEmpty(errorMessage) && errorMessage !== undefined) {
      let status = { ...showSnackBar };
      status.status = true;
      status.message = errorMessage.error;
      setShowSnackBar(status);
    }
  }, [errorMessage]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let status = { ...showSnackBar };
    status.status = false;
    setShowSnackBar(status);
    const formData = {};
    for (let formDataIdentifier in loginData.form) {
      formData[formDataIdentifier] = loginData.form[formDataIdentifier].value;
    }
    dispatch(loginRequest(formData));
  };

  let formDataElementArray = [];

  for (let key in loginData.form) {
    formDataElementArray.push({
      id: key,
      config: loginData.form[key],
    });
  }

  let form = (
    <form className={classes.form} onSubmit={handleSubmit}>
      {formDataElementArray.map((data, index) => {
        return (
          <Input
            key={index}
            inputType={data.config.elementType}
            elementConfig={data.config.elementConfig}
            value={data.config.value}
            changed={(event) => textFieldChangeHandler(event)}
            icon={data.config.icon}
          />
        );
      })}
      <div className={classes.formControl}>
        <div style={{ flex: 1 }}>
          {/* <Input inputType="checkbox" label="Remember me" /> */}
        </div>

        <Link variant="body2" style={{ cursor: "pointer" }}>
          Forgot password?
        </Link>
      </div>
      <Button>Sign In</Button>
      <Grid container className={classes.bottomContainer}>
        <Typography>
          <span> Don't have an account ?</span>
          <Link
            variant="body2"
            style={{ cursor: "pointer", marginLeft: "4px" }}
            onClick={() => {
              props.history.push("/register");
            }}
          >
            Create a new Account
          </Link>
        </Typography>
      </Grid>
    </form>
  );

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
      <div className={loginStyle.loginContainer}>
        <div className={loginStyle.loginContent}>
          <div className={classes.logoAvatar}>
            <img src={logo} width="100%" alt="Eslsca logo" />
          </div>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {form}
        </div>
      </div>
    </Aux>
  );
};

export default LoginItems;
