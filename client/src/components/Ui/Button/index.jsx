import React from "react";
import { Button } from "@material-ui/core/";

function ButtonUi(props) {
  return (
    <Button type="submit" fullWidth variant="contained" color="primary">
      {props.children}
    </Button>
  );
}

export default ButtonUi;
