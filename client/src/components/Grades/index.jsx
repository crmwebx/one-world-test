import React, { useState, useRef } from "react";
import { makeStyles, Typography, Grid } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import GradesData from "components/Grades/GradesData";

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
  },
  btnContainer: {
    display: "flex",
    gap: "6px",
  },
}));

function GradesPage() {
  const classes = useStyle();
  const [selected, setSelected] = useState(false);
  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const handleClick = (e) => {
    console.log("ref is ", btnRef1.current);
    console.log(" data is ", e);
    setSelected(true);
  };
  return (
    <Aux>
      <Grid className={classes.container}>
        <Typography component="div" className={classes.profileFont}>
          Grades
        </Typography>
        <Typography component="div" className={classes.btnContainer}>
          <GradesData
            clicked={handleClick}
            ref={btnRef1}
            selected={selected}
            data="1"
          />
          <GradesData
            clicked={handleClick}
            ref={btnRef2}
            selected={selected}
            data="2"
          />
        </Typography>
      </Grid>
    </Aux>
  );
}

export default GradesPage;
