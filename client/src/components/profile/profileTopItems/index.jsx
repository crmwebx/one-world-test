import React from "react";
import { makeStyles, Typography, Grid, Button } from "@material-ui/core/";
import { useSelector, useDispatch } from "react-redux";
import { getprofileData, postprofileData } from "reduxSlices/profileSlice";

const useStyle = makeStyles((theme) => ({
  container: {
    padding: "1rem 0",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  profileFont: {
    fontSize: "1.8rem",
    fontWeight: 500,
    flex: 1,
  },
}));

const TopItems = (props) => {
  const classes = useStyle(props);
  const dispatch = useDispatch();
  const profileDataEdit = useSelector(
    (state) => state.profileData.profileDataEdit
  );

  const handleSave = () => {
    dispatch(
      postprofileData({
        ...profileDataEdit,
        contactid: window.localStorage.getItem("x-auth-contactId"),
      })
    );
  };
  return (
    <Grid className={classes.container}>
      <Typography component="div" className={classes.profileFont}>
        My profile
      </Typography>
      <Typography component="div">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="outlined"
          color="primary"
          style={{ marginLeft: "0.5rem" }}
          onClick={() =>
            dispatch(
              getprofileData(window.localStorage.getItem("x-auth-contactId"))
            )
          }
        >
          Refresh
        </Button>
      </Typography>
    </Grid>
  );
};

export default TopItems;
