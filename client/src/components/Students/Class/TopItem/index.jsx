import React from "react";
import { makeStyles, Typography, Grid, Button } from "@material-ui/core/";
import { useDispatch } from "react-redux";
import { getClassData } from "reduxSlices/classesSlice";

const useStyle = makeStyles((theme) => ({
  classConatiner: {
    padding: "1rem 0",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  classFont: {
    fontSize: "1.8rem",
    fontWeight: 500,
    flex: 1,
  },
}));

const TopItems = (props) => {
  const classes = useStyle(props);
  const dispatch = useDispatch();
  return (
    <Grid className={classes.classConatiner}>
      <Typography component="div" className={classes.classFont}>
        Classes
      </Typography>
      <Typography component="div">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            dispatch(
              getClassData(window.localStorage.getItem("x-auth-contactId"))
            );
          }}
        >
          Refresh
        </Button>
      </Typography>
    </Grid>
  );
};

export default TopItems;
