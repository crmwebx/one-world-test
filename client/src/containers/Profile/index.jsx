import React from "react";
import { Grid } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import ProfilePage from "components/profile";

function Profile(props) {
  return (
    <Aux>
      <Grid container>
        <Grid item container xs={11} sm={10} style={{ margin: "0 auto" }}>
          <ProfilePage {...props} />
        </Grid>
      </Grid>
    </Aux>
  );
}

export default Profile;
