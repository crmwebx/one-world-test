import React from "react";
import { Grid } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import Admission from "components/Prospective/Admission Test/";

function AdmissionTest(props) {
  return (
    <Aux>
      <Grid container>
        <Grid item container xs={11} sm={10} style={{ margin: "0 auto" }}>
          <Admission {...props} />
        </Grid>
      </Grid>
    </Aux>
  );
}

export default AdmissionTest;
