import React from "react";

import { Grid, makeStyles } from "@material-ui/core/";
import RegisterItems from "components/Register/RegisterItems";

const useStyle = makeStyles((theme) => ({
  container: {
    margin: "0",
    padding: "1rem 0",
  },
  itemContainer: {
    margin: "0 auto",
  },
}));

const RegisterPage = (props) => {
  const classes = useStyle(props);

  return (
    <section className={classes.container}>
      <Grid container>
        <Grid
          item
          container
          xs={11}
          md={8}
          classes={{ root: classes.itemContainer }}
        >
          <RegisterItems {...props} />
        </Grid>
      </Grid>
    </section>
  );
};

export default RegisterPage;
