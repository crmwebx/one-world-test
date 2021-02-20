import React from "react";
import { Grid } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import InquiryPage from "components/Prospective/Enquiry/";

function Enquiry(props) {
  return (
    <Aux>
      <Grid container>
        <Grid item container xs={11} sm={10} style={{ margin: "0 auto" }}>
          <InquiryPage {...props} />
        </Grid>
      </Grid>
    </Aux>
  );
}

export default Enquiry;
