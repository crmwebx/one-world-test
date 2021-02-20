import React from "react";
import { makeStyles, CircularProgress } from "@material-ui/core/";

const useStyle = makeStyles((theme) => ({
  backdropContainer: {
    width: "100vw",
    height: "100vh",
    position: "fixed",
    left: "0",
    top: "0",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
  progressBarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    zIndex: 999,
  },
}));

function BackdropItem(props) {
  const classes = useStyle(props);
  return (
    <div className={classes.backdropContainer}>
      <div className={classes.progressBarContainer}>
        <CircularProgress />
      </div>
    </div>
  );
}

export default BackdropItem;
