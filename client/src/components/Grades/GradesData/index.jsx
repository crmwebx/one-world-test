import React from "react";
import { Typography, Button } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";

const GradesItems = (props, ref) => {
  return (
    <Aux>
      <Typography component="div">
        <Button
          variant={props.selected ? "contained" : "outlined"}
          color="primary"
          onClick={() => props.clicked(props.data)}
          style={{ borderRadius: "0px" }}
          ref={ref}
        >
          History of Fashion
        </Button>
      </Typography>
    </Aux>
  );
};

const forwardInput = React.forwardRef(GradesItems);

export default forwardInput;
