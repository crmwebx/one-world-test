import React from "react";

import { Grid, makeStyles, Typography } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import mainLogo from "assests/about.png";

const useStyle = makeStyles((theme) => ({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    width: "100%",
    padding: "2rem 0",
  },
  heading: {
    color: "#005598",
    fontSize: "1.5rem",
    fontWeight: 400,
  },
  bodyMainContent: {
    display: "flex",
    justifyContent: "space-around",
  },
  bodyText: {
    fontSize: "1rem",
    color: "#000",
    marginTop: "1rem",
    paddingRight: "1rem",
  },
  logoResponsive: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    width: "90%",
    opacity: "0.8",
    [theme.breakpoints.down("xs")]: {
      width: "50%",
      marginLeft: "0",
      display: "none",
    },
  },
}));

function About(props) {
  const classes = useStyle(props);

  return (
    <Aux>
      <div className={classes.rootContainer}>
        <Typography component="h1" className={classes.heading}>
          About ESLSCA University
        </Typography>
        <Grid container item className={classes.bodyMainContent}>
          <Grid item xs={11} sm={9}>
            <Typography className={classes.bodyText}>
              With over 70 years of excellence in management education and a
              worldwide alumni network, we continue to offer accelerated,
              rigorous and innovative programs that allow students to move
              forward in a successful career. Looking forward to welcome our
              students who are strongly motivated to improve themselves and
              broaden their potentials, and are keen to join the ARTIFICIAL
              INTELLIGENCE ERA in any piece of land on this globe. If you are
              seeking a Bachelor, Graduate Diploma, MBA or DBA, ESLSCA is your
              vehicle to reach your destination.
            </Typography>
          </Grid>
          <Grid item xs={11} sm={3}>
            <div className={classes.logoResponsive}>
              <img src={mainLogo} width="50%" alt="oneWorld logo" />
            </div>
          </Grid>
        </Grid>
      </div>
    </Aux>
  );
}

export default About;
