import React from "react";

import { Grid, makeStyles } from "@material-ui/core/";

import InfoBarItems from "components/Navigation/InfoBar/InfoBarItems";

const useStyle = makeStyles((theme) => ({
  container: {
    margin: "0",
    paddingBottom: "0.8rem",
    background: "#005598",
    height: "6vh",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      height: "auto",
    },
  },
  itemContainer: {
    margin: "0 auto",
  },
}));

const HeaderTop = (props) => {
  const classes = useStyle(props);

  return (
    <section className={classes.container}>
      <Grid container>
        <Grid
          item
          container
          xs={12}
          sm={11}
          classes={{ root: classes.itemContainer }}
        >
          <InfoBarItems {...props} />
        </Grid>
      </Grid>
    </section>
  );
};

export default HeaderTop;
