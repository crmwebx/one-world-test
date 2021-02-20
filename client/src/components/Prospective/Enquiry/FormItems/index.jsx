import React, { useState } from "react";
import { makeStyles, Typography, Grid, Button } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import FormBuilder from "components/FormBuilder";
import InquiryDataSource from "components/Enquiry/FormItems/InquiryFormData";
import InquiryStyle from "components/Enquiry/FormItems/inquiry.module.css";
import FormHeader from "components/FormHeader";

const useStyle = makeStyles((theme) => ({
  formDesignMain: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  formContainer: {
    padding: "0.9rem 0.7rem",
    margin: "0",
    background: "#005598",
    display: "flex",
    alignItems: "center",
    color: "#fff",
  },
  formDesign: {
    width: "95%",
    margin: "0 auto",
  },
}));

var filtterInquiryFormData = {};
let {
  general,
  conatactInformation,
  homeAddress,
  mailingAddress,
} = InquiryDataSource;

for (let key in general) {
  filtterInquiryFormData[key] = general[key].value;
}
for (let key in conatactInformation) {
  filtterInquiryFormData[key] = conatactInformation[key].value;
}
for (let key in homeAddress) {
  filtterInquiryFormData[key] = homeAddress[key].value;
}
for (let key in mailingAddress) {
  filtterInquiryFormData[key] = mailingAddress[key].value;
}

const FormItems = (props) => {
  const classes = useStyle(props);
  const [jsonData, setJsonData] = useState(filtterInquiryFormData);
  const textFieldChangeHandler = (event) => {
    // const filtterFormDataCopy = { ...jsonData };
    // filtterFormDataCopy[event.target.name] = event.target.value;
    // setJsonData(filtterFormDataCopy);
    // dispatch(updateProfileEditData(filtterFormDataCopy));
  };
  const handelChange = (event) => {
    // const filtterFormDataCopy = { ...jsonData };
    // filtterFormDataCopy["gendercode"] = event.target.value;
    // setJsonData(filtterFormDataCopy);
    // dispatch(updateProfileEditData(filtterFormDataCopy));
  };
  return (
    <Aux>
      <Grid container item className={classes.formDesignMain}>
        <Grid
          direction="column"
          container
          item
          className={`${InquiryStyle.mainConatiner} ${InquiryStyle.conatinerWidth}`}
          style={{ alignSelf: "flex-start" }}
        >
          <FormHeader name="General" />
          <div className={classes.formDesign}>
            <FormBuilder
              formDetails={InquiryDataSource.general}
              value={jsonData}
              changed={(event) => textFieldChangeHandler(event)}
              handelChange={(event) => handelChange(event)}
            />
          </div>
        </Grid>
        <Grid
          className={InquiryStyle.conatinerWidth}
          direction="column"
          container
        >
          <Grid
            direction="column"
            container
            item
            className={InquiryStyle.mainConatiner}
          >
            <FormHeader name="Contact Information" />
            <div className={classes.formDesign}>
              <FormBuilder
                formDetails={InquiryDataSource.conatactInformation}
                value={jsonData}
                changed={(event) => textFieldChangeHandler(event)}
              />
            </div>
          </Grid>
        </Grid>
        <Grid
          className={InquiryStyle.conatinerWidth}
          container
          direction="column"
        >
          <Grid
            direction="column"
            container
            item
            className={InquiryStyle.mainConatiner}
          >
            <FormHeader name="Home address" />
            <div className={classes.formDesign}>
              <FormBuilder
                formDetails={InquiryDataSource.mailingAddress}
                value={jsonData}
                changed={(event) => textFieldChangeHandler(event)}
              />
            </div>
          </Grid>
          <Grid
            direction="column"
            container
            item
            className={InquiryStyle.mainConatiner}
          >
            <FormHeader name="Mailing address (if different)" />
            <div className={classes.formDesign}>
              <FormBuilder
                formDetails={InquiryDataSource.mailingAddress}
                value={jsonData}
                changed={(event) => textFieldChangeHandler(event)}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container item style={{ marginBottom: "0.6rem" }}>
          <Typography component="div">
            <Button variant="contained" color="primary">
              Save
            </Button>
            <Button
              variant="outlined"
              color="primary"
              style={{ marginLeft: "0.5rem" }}
            >
              Clear
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </Aux>
  );
};

export default FormItems;
