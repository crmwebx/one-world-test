import React, { useState, useEffect, useRef } from "react";

import {
  Grid,
  Typography,
  makeStyles,
  Popper,
  MenuList,
  MenuItem,
  Grow,
  Paper,
  ClickAwayListener,
} from "@material-ui/core/";
import PhoneIcon from "@material-ui/icons/Phone";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import {
  clearErrorStatusCode,
  clearErrorMessage,
  clearApplicationData,
  clearApplicantStatus,
} from "reduxSlices/applicationSlice";
import {
  removeWebSelectclassData,
  removeElementsFromArray,
} from "reduxSlices/selectClassSlice";
import { Link, withRouter } from "react-router-dom";
import style from "./infoBar.module.css";

const useStyle = makeStyles((theme) => ({
  main: {
    marginTop: "0.5rem",
    display: "flex",
    alignItems: "center",
  },
  contentIcon: {
    fontSize: "1.3rem",
    opacity: 1,
    color: "#fff",
  },
  contentFont: {
    fontSize: "0.9rem",
    color: "#fff",
  },
}));

const InfoBarItems = (props) => {
  const classes = useStyle(props);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.loginRequest.isLoggedIn);

  const handelLogout = () => {
    dispatch(clearLoginData());
    dispatch(removeWebSelectclassData([]));
    dispatch(removeElementsFromArray([]));
    window.localStorage.removeItem("x-auth-token");
    window.localStorage.removeItem("x-auth-fullname");
    window.localStorage.removeItem("x-auth-contactId");
    window.localStorage.removeItem("isUserLoggedIn");
    window.localStorage.removeItem("x-auth-email");
    window.localStorage.removeItem("x-auth-mobile");
    window.localStorage.removeItem("ses_applicantid");
    window.localStorage.removeItem("eslsca_accepttermsanddonditions");
    window.localStorage.removeItem("eslsca_applicationfee");
    window.localStorage.removeItem("eslsca_esignature");
    dispatch(isLoggedInUpdate(false));
    dispatch(clearErrorStatusCode());
    dispatch(clearErrorMessage());
    dispatch(clearApplicationData());
    dispatch(clearApplicantStatus());
    props.history.push("/login");
    setOpen(false);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    // if (prevOpen.current === true && open === false) {
    //   anchorRef.current.focus();
    // }

    prevOpen.current = open;
  }, [open]);

  return (
    <Grid item container className={classes.main}>
      <Typography component="div" className={style.leftContainer}>
        <div className={style.mainContent}>
          <PhoneIcon className={classes.contentIcon} />
          <span className={style.IconText}>19298</span>
        </div>
        <div className={style.mainContent}>
          <MailOutlineIcon className={classes.contentIcon} />
          <span className={style.IconText}>admission@eslsca.edu.eg</span>
        </div>
      </Typography>
      <Typography component="div" className={style.rightContainer}>
        {isLoggedIn || window.localStorage.getItem("isUserLoggedIn") ? (
          <Typography
            component="div"
            className={style.mainContent}
            style={{ cursor: "pointer" }}
          >
            <Typography
              component="div"
              ref={anchorRef}
              onClick={handleToggle}
              style={{
                marginTop: "6px",
                display: "flex",
              }}
            >
              <span className={classes.contentFont}>
                {window.localStorage.getItem("x-auth-fullname")}
              </span>
              <ExpandMoreIcon className={classes.contentIcon} />
            </Typography>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
              style={{ zIndex: 100 }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                  className={style.subMenuPosition}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem onClick={handleClose}>
                          Change Password
                        </MenuItem>
                        <MenuItem onClick={handelLogout}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Typography>
        ) : (
          <Typography component="div" className={style.mainContent}>
            <Link to="/login" className={style.applyLink}>
              Login
            </Link>
          </Typography>
        )}
        {isLoggedIn || window.localStorage.getItem("isUserLoggedIn") ? null : (
          <Typography component="div" className={style.mainContent}>
            <Link to="/register" className={style.applyLink}>
              Register
            </Link>
          </Typography>
        )}

        <Typography component="div" className={style.mainContent}>
          <Link to="/prospective/application" className={style.btnHero}>
            Apply Today
          </Link>
        </Typography>
      </Typography>
    </Grid>
  );
};

export default withRouter(InfoBarItems);
