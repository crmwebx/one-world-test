import React from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core/";

import FooterItem from "components/Footer/FooterItems";

import Aux from "hoc/Auxilliary";

const useStyle = makeStyles((theme) => ({
  footerStyle: {
    background: "#005598",
  },
  rootStyle: {
    margin: "0 auto",
  },
  footerBelow: {
    display: "flex",
    justifyContent: "center",
    padding: "0.6rem 0",
    background: "#043358",
    color: "#fff",
  },
}));

const Footer = (props) => {
  const classes = useStyle(props);

  return (
    <Aux>
      <footer className={classes.footerStyle}>
        <Grid container>
          <Grid item container xs={12} sm={11} className={classes.rootStyle}>
            <FooterItem />
          </Grid>
        </Grid>
      </footer>
      <Grid container className={classes.footerBelow}>
        <Typography style={{ fontSize: "0.9rem" }}>
          © ESLSCA 2021 - All rights reserved.
        </Typography>
      </Grid>
    </Aux>
  );
};

export default Footer;
