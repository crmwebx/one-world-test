import React from "react";
import { makeStyles, Typography, Grid, Button } from "@material-ui/core/";

const useStyle = makeStyles((theme) => ({
  container: {
    padding: "1rem 0",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  profileFont: {
    fontSize: "1.8rem",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  textContent: {
    marginTop: "0.5rem",
    fontSize: "0.85rem",
    background: "#eee",
    padding: "0.9rem 1rem",
  },
}));

const TopItems = (props) => {
  const classes = useStyle(props);

  return (
    <Grid className={classes.container}>
      <Typography component="div" className={classes.profileFont}>
        <Button variant="contained" color="primary">
          Test Data
        </Button>
        <Typography style={{ marginLeft: "6px" }}>
          Request information
        </Typography>
      </Typography>
      <Typography className={classes.textContent}>
        Let us know about you and any questions or comments you might have.
        Please complete the following form and submit it, or send an e-mail to
        admissions@oneworldsis.com.
      </Typography>
    </Grid>
  );
};

export default TopItems;
