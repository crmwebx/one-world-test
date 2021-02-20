import React from "react";
import { makeStyles, Grid } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import FormBuilder from "components/FormBuilder";
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
  conatinerWidth: {
    width: "50%",
  },
  formDesign: {
    width: "97%",
    margin: "0 auto",
  },
}));

const FormItems = (props) => {
  const classes = useStyle(props);

  return (
    <Aux>
      <Grid container item className={classes.formDesignMain}>
        <Grid
          direction="column"
          container
          item
          className={`${InquiryStyle.mainConatiner} ${InquiryStyle.conatinerWidth2}`}
          style={{ alignSelf: "flex-start" }}
        >
          <FormHeader name="Previous Education" />
          <div className={classes.formDesign}>
            <FormBuilder
              formDetails={props.formDetails.prevEducation}
              value={props.value}
              changed={props.changed}
              handelChange={props.handelChange}
              handelDateChange={props.handelDateChange}
            />
          </div>
        </Grid>
        <Grid
          className={InquiryStyle.conatinerWidth2}
          direction="column"
          container
        >
          <Grid
            direction="column"
            container
            item
            className={InquiryStyle.mainConatiner}
          >
            <FormHeader name="Previous Employment" />
            <div className={classes.formDesign}>
              <FormBuilder
                formDetails={props.formDetails.prevEmployment}
                value={props.value}
                changed={props.changed}
                handelChange={props.handelChange}
                handelDateChange={props.handelDateChange}
              />
            </div>
          </Grid>
        </Grid>
        <Grid
          className={InquiryStyle.conatinerWidth2}
          direction="column"
          container
        >
          <Grid
            direction="column"
            container
            item
            className={InquiryStyle.mainConatiner}
          >
            <FormHeader name="Attendance and Joining Dates " />
            <div className={classes.formDesign}>
              <FormBuilder
                formDetails={props.formDetails.attendanceJoiningDate}
                value={props.value}
                changed={props.changed}
                handelChange={props.handelChange}
                handelDateChange={props.handelDateChange}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Aux>
  );
};

export default FormItems;
