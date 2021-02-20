import React from "react";
import Aux from "hoc/Auxilliary";
import TopItem from "components/Students/Class/TopItem";
import Container from "components/Students/Class/TableContainer";

function ClassContent() {
  return (
    <Aux>
      <TopItem />
      <Container />
    </Aux>
  );
}

export default ClassContent;
