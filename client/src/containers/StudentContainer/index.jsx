import React from "react";
import { Grid } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import ClassItem from "components/Students/Class";

const ClassPage = (props) => {
  return (
    <Aux>
      <Grid container>
        <Grid item container xs={12} sm={10} style={{ margin: "0 auto" }}>
          <ClassItem />
        </Grid>
      </Grid>
    </Aux>
  );
};

export default ClassPage;
