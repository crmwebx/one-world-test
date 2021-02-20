import React from "react";
import { Grid } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import ProspectivePage from "components/Prospective";

function Prospective(props) {
  return (
    <Aux>
      <Grid container>
        <Grid item container xs={11} sm={10} style={{ margin: "0 auto" }}>
          <ProspectivePage {...props} />
        </Grid>
      </Grid>
    </Aux>
  );
}

export default Prospective;
