import React from "react";
import Aux from "hoc/Auxilliary";
import TopItem from "components/Students/SelectClass/TopItem";
import Container from "components/Students/SelectClass/TableContainer";

function ClassContent() {
  return (
    <Aux>
      <TopItem />
      <Container />
    </Aux>
  );
}

export default ClassContent;
