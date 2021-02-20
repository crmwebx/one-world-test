import React from "react";
import RegisterPage from "components/Register";
import Aux from "hoc/Auxilliary";

function Register(props) {
  return (
    <Aux>
      <RegisterPage {...props} />
    </Aux>
  );
}

export default Register;
