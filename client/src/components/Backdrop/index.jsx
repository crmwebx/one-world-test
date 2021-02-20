import React from "react";
import BackdropItem from "components/Backdrop/BackdropItem/BackdropItem";
import Aux from "hoc/Auxilliary";

const Backdrop = (props) => {
  return <Aux>{props.show ? <BackdropItem /> : null}</Aux>;
};

export default Backdrop;
