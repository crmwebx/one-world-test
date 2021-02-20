import React from "react";

import { Grid, makeStyles, Typography } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import focus from "assests/focus.png";

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    padding: "2rem 0",
  },
  heading: {
    color: "#005598",
    fontSize: "1.5rem",
    fontWeight: 400,
  },
  focusContainer: {
    display: "flex",
    width: "100%",
    // justifyContent: "space-between",
  },
  focusItemHeading: {
    color: "#000000",
    fontWeight: 700,
    fontSize: "1.1rem",
    marginBottom: "0.6rem",
    [theme.breakpoints.down("xs")]: {
      marginTop: "1rem",
    },
  },
  itemMain: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    paddingBottom: "1rem",
    [theme.breakpoints.down("xs")]: {
      height: "auto",
    },
  },
  focusImage: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  marginGap: {
    marginTop: "5%",
    [theme.breakpoints.down("xs")]: {
      marginTop: "auto",
    },
  },
}));

const Focus = (props) => {
  const classes = useStyle(props);
  return (
    <Aux>
      <Grid container item className={classes.root}>
        <Typography component="h1" className={classes.heading}>
          Our Core Values
        </Typography>
      </Grid>
      <Grid container item xs={11} sm={12} className={classes.focusContainer}>
        <Grid container item xs={11} sm={4} style={{ margin: "0 auto" }}>
          <Grid container item className={classes.itemMain}>
            <Typography component="div">
              <Typography component="h2" className={classes.focusItemHeading}>
                Collegiality
              </Typography>
              <Typography>
                We are united in our commitment to the university community,
                each individual is greatly appreciated and respected regardless
                of their religion, culture, ethnic background or physical and
                mental ability.
              </Typography>
            </Typography>
            <Typography component="div" className={classes.marginGap}>
              <Typography component="h2" className={classes.focusItemHeading}>
                Innovation
              </Typography>
              <Typography>
                To boldly approach the future with curiosity and excellence.
              </Typography>
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={11} sm={4} style={{ margin: "0 auto" }}>
          <div className={classes.focusImage}>
            <img src={focus} width="60%" alt="Focus" />
          </div>
        </Grid>

        <Grid container item xs={11} sm={4} style={{ margin: "0 auto" }}>
          <Grid container item className={classes.itemMain}>
            <Typography component="div">
              <Typography component="h2" className={classes.focusItemHeading}>
                Inclusivity
              </Typography>
              <Typography>
                ESLSCA acknowledges that individuals have unique needs when it
                comes to learning. Therefore, all lectures are approached with a
                wide range of teaching methods to accommodate everyone.
              </Typography>
            </Typography>
            <Typography component="div" className={classes.marginGap}>
              <Typography component="h2" className={classes.focusItemHeading}>
                Excellence
              </Typography>
              <Typography>
                strive for the highest standards of quality in all what we
                offer, and we expect nothing less from our employees, students
                and Alum
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Aux>
  );
};

export default Focus;
