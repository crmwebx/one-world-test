import React from "react";
import {
  Grid,
  makeStyles,
  Typography,
  TextField,
  Button,
} from "@material-ui/core/";
import Aux from "hoc/Auxilliary";

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
  formStyle: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    gap: "1rem",
  },
  emailField: {
    background: "#fff",
  },
  buttonField: {},
}));

const NewsLetter = (props) => {
  const classes = useStyle(props);
  return (
    <Aux>
      <Grid container item className={classes.root}>
        <Typography component="h1" className={classes.heading}>
          Subscribe to our Newsletter for latest news.
        </Typography>
      </Grid>
      <Grid container item style={{ paddingBottom: "2rem" }}>
        <Typography component="div" className={classes.formStyle}>
          <Typography component="div" className={classes.emailField}>
            <TextField
              label="Your-Email"
              type="email"
              autoComplete="Your-Email"
              variant="outlined"
            />
          </Typography>
          <Typography component="div" className={classes.buttonField}>
            <Button
              variant="contained"
              style={{ height: "auto", background: "#F9A134", color: "#fff" }}
            >
              subscribe
            </Button>
          </Typography>
        </Typography>
      </Grid>
    </Aux>
  );
};

export default NewsLetter;
