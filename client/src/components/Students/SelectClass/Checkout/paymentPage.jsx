import React from "react";
import parse from "html-react-parser";
import { withRouter } from "react-router-dom";
import Aux from "hoc/Auxilliary";
import { useSelector, useDispatch } from "react-redux";

function PaymentPage(props) {
  const paymentResponse = useSelector(
    (state) => state.selectClassData.paymentResponse
  );

  console.log("response", paymentResponse);

  if (paymentResponse.length > 0) {
    return <Aux>{parse(paymentResponse)}</Aux>;
  }

  return <Aux>{parse(window.localStorage.getItem("payment"))}</Aux>;
}

export default withRouter(PaymentPage);
