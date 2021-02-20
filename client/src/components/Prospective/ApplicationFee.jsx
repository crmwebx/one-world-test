import React from "react";
import { makeStyles, Typography, Grid, Button } from "@material-ui/core/";
import { withRouter } from "react-router-dom";
import moment from "moment";
import FormHeader from "components/FormHeader";
import Aux from "hoc/Auxilliary";
import masterCardLogo from "assests/mastercard.png";
import visaCardLogo from "assests/visa.png";
import sha256 from "js-sha256";
import config from "app/config";

const useStyle = makeStyles((theme) => ({
  root: {
    height: "50vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

const ApplicationFee = (props) => {
  const paymentParams = {
    command: "PURCHASE",
    access_code: config.ACCESSCODE,
    merchant_identifier: config.MERCHANTIDENTIFIER,
    merchant_extra: props.value.ses_applicantid,
    merchant_reference: `${
      props.value.ses_applicant
    }-${new Date().getSeconds()}`,
    amount:
      parseInt(window.localStorage.getItem("eslsca_applicationfee")) * 100,
    currency: "EGP",
    language: "en",
    customer_email: props.value.emailaddress1,
    order_description: "ESLSCA Applicant Fee",
    return_url: config.return_url,
  };

  const classes = useStyle(props);
  // console.log(
  //   "props is application fee",
  //   props,
  //   props.value.eslsca_applicationfee
  // );
  let fee = window.localStorage.getItem("eslsca_applicationfee");
  // console.log("fee ", fee);
  // if (
  //   fee === 0 ||
  //   props.value.eslsca_applicationfee === undefined ||
  //   props.value.eslsca_applicationfee === ""
  // ) {
  //   fee = 1;
  // }

  const generatehash256SignatureForTokenization = (
    access_code,
    amount,
    merchant_reference,
    command,
    currency,
    customer_email,
    merchant_identifier,
    merchant_extra,
    order_description,
    return_url
  ) => {
    const message = `${config.SHAREQUESTPHRASE}access_code=${access_code}amount=${amount}command=${command}currency=${currency}customer_email=${customer_email}language=enmerchant_extra=${merchant_extra}merchant_identifier=${merchant_identifier}merchant_reference=${merchant_reference}order_description=${order_description}return_url=${return_url}${config.SHAREQUESTPHRASE}`;
    return sha256.sha256(message);
  };
  return (
    <Aux>
      <FormHeader name="Application Fee Payment" />
      <Grid>
        {props.value.ses_admissionfeepaid === false &&
        props.value.ses_applicationfeepaiddate.length === 0 ? (
          <Typography component="div" className={classes.root}>
            <form method="post" action={`${config.PURCHASEHOSTURL}`}>
              {Object.keys(paymentParams).map((data) => (
                <input type="hidden" name={data} value={paymentParams[data]} />
              ))}
              <input
                type="hidden"
                name="signature"
                value={generatehash256SignatureForTokenization(
                  paymentParams.access_code,
                  paymentParams.amount,
                  paymentParams.merchant_reference,
                  paymentParams.command,
                  paymentParams.currency,
                  paymentParams.customer_email,
                  paymentParams.merchant_identifier,
                  paymentParams.merchant_extra,
                  paymentParams.order_description,
                  paymentParams.return_url
                )}
              />
              <Typography component="div" align="center">
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ textTransform: "capitalize" }}
                  disabled={fee === 0 || fee === null || fee === undefined}
                  type="submit"
                >
                  {`Click here to make payment ${fee} EG`}
                </Button>
              </Typography>
            </form>
            <Typography component="div" align="center" style={{ gap: "1rem" }}>
              <img src={masterCardLogo} alt="mastercard" width="10%" />
              <img src={visaCardLogo} alt="visacard" width="10%" />
            </Typography>
          </Typography>
        ) : (
          <Typography component="div" className={classes.root}>
            <Typography component="div" align="center">
              {`Application fee paid on Date -  ${moment
                .utc(props.value.ses_applicationfeepaiddate)
                .format("Do MMMM YYYY")}`}
            </Typography>
          </Typography>
        )}
      </Grid>
    </Aux>
  );
};

export default withRouter(ApplicationFee);
