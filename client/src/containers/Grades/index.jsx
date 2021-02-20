import React from "react";
import { Grid } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import GradesPage from "components/Grades";

function Profile(props) {
  return (
    <Aux>
      <Grid container>
        <Grid item container xs={11} sm={10} style={{ margin: "0 auto" }}>
          <GradesPage />
        </Grid>
      </Grid>
    </Aux>
  );
}

export default Profile;
