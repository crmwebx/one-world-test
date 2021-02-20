import React from "react";

import Aux from "hoc/Auxilliary";
import HeaderTop from "components/Navigation/InfoBar";
import NavigationItems from "components/Navigation/NavigationItems";

function index(props) {
  return (
    <Aux>
      <HeaderTop {...props} />
      <NavigationItems />
    </Aux>
  );
}

export default index;
