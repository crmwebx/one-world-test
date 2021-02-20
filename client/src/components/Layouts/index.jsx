import React from "react";
import Aux from "hoc/Auxilliary";
import Toolbar from "components/Navigation/Toolbar";
import Footer from "components/Footer";

function index(props) {
  return (
    <Aux>
      <main>
        <Toolbar {...props} />
        {props.children}
      </main>
      <Footer />
    </Aux>
  );
}

export default index;
