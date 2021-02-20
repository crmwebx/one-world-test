import React from "react";
import LoginPage from "components/Login";
import Aux from "hoc/Auxilliary";

function Login(props) {
  return (
    <Aux>
      <LoginPage {...props} />
    </Aux>
  );
}

export default Login;
