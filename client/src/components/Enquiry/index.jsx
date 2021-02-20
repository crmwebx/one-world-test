import React from "react";
import InquiryTopItem from "components/Enquiry/TopItems";
import FormItems from "components/Enquiry/FormItems";
import Aux from "hoc/Auxilliary";

function InquiryPage() {
  return (
    <Aux>
      <InquiryTopItem />
      <FormItems />
    </Aux>
  );
}

export default InquiryPage;
