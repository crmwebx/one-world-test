import React from "react";
import { makeStyles, Typography } from "@material-ui/core/";

const useStyle = makeStyles((theme) => ({
  formContainer: {
    padding: "0.9rem 0.7rem",
    margin: "0",
    background: "#005598",
    display: "flex",
    alignItems: "center",
    color: "#fff",
  },
}));

function Header(props) {
  const classes = useStyle(props);
  return (
    <Typography component="div" className={classes.formContainer}>
      {props.name}
    </Typography>
  );
}

export default Header;
