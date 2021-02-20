import React from "react";

const paymentForm = (props) => {
  return <div dangerouslySetInnerHTML={{ __html: props.body }} />;
};

export default paymentForm;
