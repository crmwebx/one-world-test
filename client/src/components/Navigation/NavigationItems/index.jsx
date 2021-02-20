import React from "react";
import { Grid, makeStyles, AppBar, Toolbar } from "@material-ui/core/";

import NavigationMenuItem from "components/Navigation/NavigationItems/NavigationMenuItem";
import { useSelector } from "react-redux";

const useStyle = makeStyles((theme) => ({
  root: {
    background: "#fff",
    boxShadow: "none",
    borderBottom: "1px solid #eee",
  },
}));

const NavigationItems = (props) => {
  const isUserLoggedIn = useSelector((state) => state.loginRequest.isLoggedIn);
  const classes = useStyle(props);

  return (
    <AppBar position="static" classes={{ root: classes.root }}>
      {window.localStorage.getItem("isUserLoggedIn") || isUserLoggedIn ? (
        <Toolbar disableGutters>
          <Grid container item xs={12} sm={11} style={{ margin: "0 auto" }}>
            <NavigationMenuItem />
          </Grid>
        </Toolbar>
      ) : null}
    </AppBar>
  );
};
export default NavigationItems;
