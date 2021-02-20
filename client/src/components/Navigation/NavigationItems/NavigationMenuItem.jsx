import React, { useState, useEffect } from "react";

import { makeStyles, List, Menu, MenuItem } from "@material-ui/core/";
import { useSelector, useDispatch } from "react-redux";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import { Link, withRouter } from "react-router-dom";
import logo from "assests/logo.png";
import NavMenuItem from "components/Navigation/NavigationItems/MenuItems.jsx";
import Items from "components/Navigation/NavigationItems/MenuData";
import { isObjectEmpty } from "utils/general";
import Backdrop from "components/Backdrop/";
import {
  clearErrorStatusCode,
  clearErrorMessage,
  getApplicantStatus,
  clearApplicantStatus,
} from "reduxSlices/applicationSlice";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";

const useStyle = makeStyles((theme) => ({
  navRoot: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  grow: {
    // flex: 1,
    width: "15%",
  },
  logoResponsive: {
    width: "100%",
    marginLeft: "0.5rem",
    [theme.breakpoints.up("md")]: {
      width: "60%",
      marginLeft: "0",
    },
  },
  navMenu: {
    display: "flex",
    alignItems: "center",
  },
  listDisplay: {
    display: "flex",
    alignItems: "center",
  },
  listItem: {
    fontSize: "1rem",
    color: "#005598",
    textDecoration: "none",
    "&:hover": {
      color: "#e02222",
    },
  },
  ListItemRoot: {
    width: "auto",
    padding: "0 0.8rem",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    justifyContent: "flex-end",
    color: "#005598",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  contentFont: {
    fontSize: "0.92rem",
  },
}));

const NavigationMenuItem = (props) => {
  const classes = useStyle(props);
  const dispatch = useDispatch();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const applicantStatus = useSelector(
    (state) => state.applicationData.applicantStatus
  );

  // const clearApplicantStatus = useSelector(
  //   (state) => state.applicationData.clearApplicantStatus
  // );

  const errorMessage = useSelector(
    (state) => state.applicationData.errorMessage
  );
  // console.log("errorMessage begin", errorMessage);
  const errorStatusCode = useSelector(
    (state) => state.applicationData.errorStatusCode
  );

  const handelLogout = () => {
    dispatch(clearLoginData());
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
    dispatch(clearApplicantStatus());
    props.history.push("/login");
  };

  useEffect(() => {
    dispatch(
      getApplicantStatus(window.localStorage.getItem("x-auth-contactId"))
    );
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

  useEffect(() => {
    if (applicantStatus.ses_applicantstatus !== undefined) {
      if (
        applicantStatus.ses_applicantstatus.ses_applicantstatus === 991490000 ||
        applicantStatus.ses_applicantstatus.ses_applicantstatus === 991490001
      ) {
        Items[0].subMenuItems[1].display = "block";
      } else {
        Items[0].subMenuItems[1].display = "none";
      }
      if (
        applicantStatus.ses_applicantstatus.ses_applicantstatus === 991490004
      ) {
        Items[0].subMenuItems[2].display = "block";
      } else {
        Items[0].subMenuItems[2].display = "none";
      }

      if (
        applicantStatus.ses_applicantstatus.statuscode === 1 &&
        applicantStatus.ses_applicantstatus.ses_student != null
      ) {
        Items[1].display = "block";
      } else {
        Items[1].display = "none";
      }
      setError({
        isError: false,
        message: errorMessage,
        showSnackbar: true,
      });
    }
  }, [applicantStatus.ses_applicantstatus]);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (isMenuOpen) => {
    handleMobileMenuClose();
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {Items.length > 0
        ? Items.map((element, index) => {
            return (
              <MenuItem onClick={handleMenuClose} key={index}>
                <Link to="/" className={classes.listItem}>
                  {element.name}
                </Link>
              </MenuItem>
            );
          })
        : null}
    </Menu>
  );

  let menuDeskstopItems = "";
  menuDeskstopItems =
    Items.length > 0
      ? Items.map((element, index) => {
          return (
            <NavMenuItem
              key={index}
              name={element.name}
              id={element.id}
              url={element.url}
              hasSubmenu={element.hasSubmenu}
              subMenuItems={element.subMenuItems}
              display={element.display}
              {...props}
            />
          );
        })
      : null;

  return (
    <nav className={classes.navRoot}>
      <Backdrop />
      <div className={classes.grow}>
        <Link to="/">
          <div className={classes.logoResponsive}>
            <img src={logo} width="100%" alt="Eslsca logo" />
          </div>
        </Link>
      </div>
      <div className={classes.sectionDesktop}>
        <List className={classes.listDisplay}>{menuDeskstopItems}</List>
      </div>

      <div className={classes.sectionMobile}>
        <IconButton
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
      </div>
      {renderMobileMenu}
    </nav>
  );
};

export default withRouter(NavigationMenuItem);
