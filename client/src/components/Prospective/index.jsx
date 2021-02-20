import React, { useState, useEffect } from "react";
import { makeStyles, Typography, Grid, Button } from "@material-ui/core/";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import countryCodes from "country-codes-list";

import Aux from "hoc/Auxilliary";
import FormBuilder from "components/FormBuilder";
import FormSourceData from "components/Prospective/formData";
import FormStyle from "components/Prospective/prospective.module.css";
import UploadForm from "components/Prospective/formUpload";
import ApplicationFee from "components/Prospective/ApplicationFee";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getApplicationData,
  updateApplicationEditData,
  postApplicationData,
  clearErrorStatusCode,
  clearErrorMessage,
  clearApplicationData,
  saveFileUploadData,
  getApplicantFee,
  clearApplicantStatus,
} from "reduxSlices/applicationSlice";
import { isObjectEmpty } from "utils/general";
import Backdrop from "components/Backdrop/";
import FormHeader from "components/FormHeader";
import ConatactInformation from "./contactInformation";
import GraduateInformation from "components/Prospective/educationDetails";
import fields from "components/Prospective/requiredFields";
import MessageIndicator from "components/SnackBar";
import { dateFormatter } from "utils/general";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";

const useStyle = makeStyles((theme) => ({
  container: {
    padding: "1rem 0",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  profileFont: {
    fontSize: "1.8rem",
    fontWeight: 500,
    flex: 1,
  },
  formDesignMain: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  formHead: {
    padding: "0.9rem 0.7rem",
    background: "#005598",
    color: "#fff",
    width: "95.7%",
  },
  formDesign: {
    width: "95%",
    margin: "0 auto",
  },
  bottomControls: {
    display: "flex",
    justifyContent: "space-between",
    margin: "0.6rem auto",
    width: "100%",
  },
  btnNext: {
    marginRight: "4.5rem",
    [theme.breakpoints.down("xs")]: {
      marginRight: "0",
    },
  },
}));
const formNavData = [
  {
    id: FormSourceData.personalInformation,
    value: "Personal and Program",
  },
  {
    id: FormSourceData.miscellanous,
    value: "Conatact Information",
  },
  {
    id: FormSourceData.education.Undergraduate,
    value: "Education Information Undergraduate",
  },
  {
    id: FormSourceData.applicationFee,
    value: "demo",
  },
  {
    id: FormSourceData.financialAid,
    value: "Financial Aid",
  },
  {
    id: FormSourceData.applicationFee,
    value: "Application Fee",
  },
];

var filtterFormData = {};
var fileUploadForm = [];
let {
  personalInformation,
  conatactInformation,
  education,
  miscellanous,
  financialAid,
} = FormSourceData;
// console.log(financialAid);

for (let key in personalInformation) {
  filtterFormData[key] = personalInformation[key].value;
}
for (let key in conatactInformation) {
  filtterFormData[key] = conatactInformation[key].value;
}
for (let key in education.Undergraduate) {
  filtterFormData[key] = education.Undergraduate[key].value;
}
for (let key in education.graduate) {
  filtterFormData[key] = education.graduate[key].value;
}
for (let key in financialAid) {
  filtterFormData[key] = financialAid[key].value;
}
// for (let key in education.graduate) {
//   filtterFormData[key] = education.graduate[key].value;
// }
for (let key in miscellanous) {
  filtterFormData[key] = miscellanous[key].value;
}
var programs = [];
const ProspectivePage = (props) => {
  const classes = useStyle(props);

  const dispatch = useDispatch();
  const applicationData = useSelector(
    (state) => state.applicationData.applicationData
  );

  const applicationDataEdit = useSelector(
    (state) => state.applicationData.applicationDataEdit
  );
  const applicantFee = useSelector(
    (state) => state.applicationData.applicantFee
  );

  const dataFetchingStatus = useSelector(
    (state) => state.applicationData.dataFetchingStatus
  );

  const errorMessage = useSelector(
    (state) => state.applicationData.errorMessage
  );
  // console.log("errorMessage begin", errorMessage);
  const errorStatusCode = useSelector(
    (state) => state.applicationData.errorStatusCode
  );

  if (!isObjectEmpty(applicantFee)) {
    console.log("applicantFee", applicantFee);
    window.localStorage.setItem(
      "eslsca_applicationfee",
      applicantFee.eslsca_applicationfee
    );
  }

  useEffect(() => {
    dispatch(
      getApplicationData(window.localStorage.getItem("x-auth-contactId"))
    );
  }, [dispatch]);
  // console.log("filtterFormData", filtterFormData);
  const [jsonData, setJsonData] = useState(filtterFormData);
  const [key, setKey] = useState(0);
  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });
  const [event, setEvent] = useState({
    isEvent: false,
    message: "",
    showSnackbar: false,
  });
  const [validationError, setValidationError] = useState(false);

  const [showGuardian, setShowGuardian] = useState(false);

  const [fileData, setFileData] = useState({});

  // console.log("fileData", fileData);
  const textFieldChangeHandler = (event) => {
    if (event.target.name === "firstname") {
    }
    const filtterFormDataCopy = { ...jsonData };
    filtterFormDataCopy[event.target.name] = event.target.value;
    setJsonData(filtterFormDataCopy);
    dispatch(updateApplicationEditData(filtterFormDataCopy));
  };

  const handelLogout = () => {
    dispatch(clearLoginData());
    window.localStorage.removeItem("x-auth-token");
    window.localStorage.removeItem("x-auth-fullname");
    window.localStorage.removeItem("x-auth-contactId");
    window.localStorage.removeItem("isUserLoggedIn");
    window.localStorage.removeItem("eslsca_applicationfee");
    dispatch(isLoggedInUpdate(false));
    dispatch(clearErrorStatusCode());
    dispatch(clearErrorMessage());
    dispatch(clearApplicationData());
    dispatch(clearApplicantStatus());
    props.history.push("/login");
  };

  useEffect(() => {
    if (!isObjectEmpty(errorMessage) && errorMessage !== undefined) {
      // console.log("errorMessage", errorMessage);
      if (errorStatusCode === 401) {
        let event = {
          isEvent: false,
          message: "Session Expired",
          showSnackbar: true,
        };
        setEvent(event);
        setTimeout(() => {
          handelLogout();
        }, 1600);
      } else {
        let event = {
          isEvent: false,
          message: errorMessage,
          showSnackbar: true,
        };
        setEvent(event);
      }
    }
  }, [errorMessage, errorStatusCode]);

  const handelDateChange = (event, eventName) => {
    const filtterFormDataCopy = { ...jsonData };
    if (eventName === "eslsca_accepttermsanddonditions") {
      filtterFormDataCopy[eventName] = event.target.checked;
    } else {
      filtterFormDataCopy[eventName] = dateFormatter(event);
    }

    setJsonData(filtterFormDataCopy);
    dispatch(updateApplicationEditData(filtterFormDataCopy));
  };
  const handleProgramChange = (eventName, programValue) => {
    let programName = programs.find((data) => {
      return data.value === programValue;
    });
    if (programName.displayValue.includes("Bachelor")) {
      let copyApplicationDataEdit = { ...applicationDataEdit };
      copyApplicationDataEdit[eventName] = programValue;
      copyApplicationDataEdit.ses_applicanttype = 284210001;
      setJsonData(copyApplicationDataEdit);
      dispatch(updateApplicationEditData(copyApplicationDataEdit));
      setShowGuardian(true);
    } else {
      let copyApplicationDataEdit = { ...applicationDataEdit };
      copyApplicationDataEdit[eventName] = programValue;
      copyApplicationDataEdit.ses_applicanttype = 284210000;
      setJsonData(copyApplicationDataEdit);
      dispatch(updateApplicationEditData(copyApplicationDataEdit));
      setShowGuardian(false);
    }
  };
  const handleProgramChangeOnLoad = (programValue) => {
    if (programValue !== undefined && programValue.length > 0) {
      let programName = programs.find((data) => {
        return data.value === programValue;
      });
      if (programName.displayValue.includes("Bachelor")) {
        setShowGuardian(true);
      } else {
        setShowGuardian(false);
      }
    }
  };
  const handelTransferFieldValidation = (isTransfer) => {
    if (isTransfer) {
      education.Undergraduate[
        "eslsca_transferfacultyorprogram"
      ].elementConfig.required = true;
      education.Undergraduate[
        "eslsca_semesternumberfortransfer"
      ].elementConfig.required = true;
      fields.underGraduate.eslsca_transferfacultyorprogram =
        "Current Faculty or Study Program";
      fields.underGraduate.eslsca_semesternumberfortransfer = "Semester Number";
    } else {
      delete education.Undergraduate["eslsca_transferfacultyorprogram"]
        .elementConfig.required;
      delete education.Undergraduate["eslsca_semesternumberfortransfer"]
        .elementConfig.required;

      delete fields.underGraduate.eslsca_transferfacultyorprogram;
      delete fields.underGraduate.eslsca_semesternumberfortransfer;
    }
  };

  const handelChange = (event, eventName) => {
    console.log("event triggered", eventName, event.target.value);
    const filtterFormDataCopy = { ...jsonData };
    if (eventName === "_ses_certificationprogram_value") {
      handleProgramChange(eventName, event.target.value);
    } else if (
      eventName === "mobilephone" ||
      eventName === "gurd_mobilephone"
    ) {
      // console.log(
      //   "event.target.value",
      //   event.target.value,
      //   filtterFormDataCopy[eventName]
      // );
      const countryName = countryCodes.findOne(
        "countryCode",
        event.target.value
      );
      // console.log("countryName", countryName);
      if (filtterFormDataCopy[eventName] === undefined) {
        filtterFormDataCopy[eventName] =
          "+" + countryName.countryCallingCode + "-";
      } else {
        filtterFormDataCopy[eventName] = filtterFormDataCopy[eventName].replace(
          filtterFormDataCopy[eventName].substr(0, 5),
          "+" + countryName.countryCallingCode + "-"
        );
      }

      setJsonData(filtterFormDataCopy);
      dispatch(updateApplicationEditData(filtterFormDataCopy));
    } else if (eventName === "eslsca_applyforfinancialaid") {
      if (event.target.value === true) {
        FormSourceData.financialAid.eslsca_scholarshiptype.elementConfig.required = true;
        FormSourceData.financialAid.eslsca_scholarshiptype.elementConfig.label =
          "Scholarship Type *";
        // FormSourceData.financialAid.eslsca_otherscholarship.elementConfig.required = true;
        // FormSourceData.financialAid.eslsca_siblingateslsca.elementConfig.required = true;
        // FormSourceData.financialAid.eslsca_siblingateslsca.elementConfig.label =
        //   "Sibling at ESLSCA *";
        // FormSourceData.financialAid.eslsca_siblingname.elementConfig.required = true;
        // FormSourceData.financialAid.eslsca_siblinguniversityid.elementConfig.required = true;
        fields.financialAid.eslsca_scholarshiptype = "Scholarship Type";
        // fields.financialAid.eslsca_otherscholarship = "Other Scholarship";
        // fields.financialAid.eslsca_siblingateslsca = "Sibling at ESLSCA";
        // fields.financialAid.eslsca_siblingname = "Sibling Name";
        // fields.financialAid.eslsca_siblinguniversityid =
        //   "Sibling University ID";
      } else {
        FormSourceData.financialAid.eslsca_scholarshiptype.elementConfig.required = false;
        FormSourceData.financialAid.eslsca_scholarshiptype.elementConfig.label =
          "Scholarship Type";
        // FormSourceData.financialAid.eslsca_otherscholarship.elementConfig.required = false;
        // FormSourceData.financialAid.eslsca_siblingateslsca.elementConfig.required = false;
        // FormSourceData.financialAid.eslsca_siblingateslsca.elementConfig.label =
        //   "Sibling at ESLSCA ";
        // FormSourceData.financialAid.eslsca_siblingname.elementConfig.required = false;
        // FormSourceData.financialAid.eslsca_siblinguniversityid.elementConfig.required = false;
        filtterFormDataCopy.eslsca_scholarshiptype = undefined;
        filtterFormDataCopy.eslsca_otherscholarship = "";
        filtterFormDataCopy.eslsca_siblingateslsca = undefined;
        filtterFormDataCopy.eslsca_siblingname = "";
        filtterFormDataCopy.eslsca_siblinguniversityid = "";
        delete fields.financialAid.eslsca_scholarshiptype;
        // delete fields.financialAid.eslsca_otherscholarship;
        // delete fields.financialAid.eslsca_siblingateslsca;
        // delete fields.financialAid.eslsca_siblingname;
        // delete fields.financialAid.eslsca_siblinguniversityid;
      }

      filtterFormDataCopy[eventName] = event.target.value;
      setJsonData(filtterFormDataCopy);
      dispatch(updateApplicationEditData(filtterFormDataCopy));
    } else {
      if (eventName === "eslsca_transfer" && showGuardian) {
        handelTransferFieldValidation(event.target.value);
      }
      filtterFormDataCopy[eventName] = event.target.value;
      setJsonData(filtterFormDataCopy);
      dispatch(updateApplicationEditData(filtterFormDataCopy));
    }
  };

  const mapDocumentType = (type) => {
    if (type === 284210000) return "Passport";
    else if (type === 284210001) return "Transcript";
    else if (type === 284210002) return "Photo";
    else if (type === 284210003) return "Assessment";
    else if (type === 284210004) return "Financials";
    else if (type === 284210005) return "Any";
    return "";
  };
  const mapFileType = (type) => {
    if (type === 284210000) return "Any";
    else if (type === 284210001) return "PDF";
    else if (type === 284210002) return "DOC";
    else if (type === 284210003) return "JPG";
    else if (type === 284210004) return "PNG";
    else if (type === 284210005) return "XLS";
    return "";
  };
  // console.log("applicationDataEdit", applicationDataEdit, jsonData);
  const scanForErrorFields = () => {
    let regex = /^[a-zA-Z ]*$/;
    let arabic = /[\u0600-\u06FF]/;
    let emailExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let errorFields = "";
    var count = 0;
    let loopFields = "";
    if (key === 0) {
      if (
        jsonData.firstname.length < 3 ||
        jsonData.lastname.length < 3 ||
        jsonData.eslsca_arabicname.length < 8 ||
        !jsonData.firstname.match(regex) ||
        !jsonData.middlename.match(regex) ||
        !jsonData.lastname.match(regex) ||
        !jsonData.eslsca_arabicname.match(arabic)
      ) {
        setValidationError(true);
      } else {
        setValidationError(false);
      }
      loopFields = fields.personalInformation;
    } else if (key === 1) {
      // console.log("key is 1", jsonData);
      if (
        (jsonData.hasOwnProperty("gurd_firstname") &&
          jsonData.gurd_firstname.length < 3) ||
        (jsonData.hasOwnProperty("gurd_lastname") &&
          jsonData.gurd_lastname.length < 3) ||
        (jsonData.hasOwnProperty("gurd_firstname") &&
          !jsonData.gurd_firstname.match(regex)) ||
        (jsonData.hasOwnProperty("gurd_middlename") &&
          !jsonData.gurd_middlename.match(regex)) ||
        (jsonData.hasOwnProperty("gurd_lastname") &&
          !jsonData.gurd_lastname.match(regex)) ||
        (jsonData.hasOwnProperty("gurd_emailaddress1") &&
          !emailExp.test(String(jsonData.gurd_emailaddress1).toLowerCase())) ||
        (jsonData.emailaddress2.length > 0 &&
          !emailExp.test(String(jsonData.emailaddress2).toLowerCase()))
      ) {
        setValidationError(true);
        console.log("key is 1 error");
      } else {
        console.log("key is 1 not error");
        setValidationError(false);
      }
      loopFields = fields.contact;
      if (showGuardian) {
        loopFields = { ...loopFields, ...fields.guardian };
      }
      // console.log("loopFields in contact", loopFields);
    } else if (key === 2 && showGuardian) {
      loopFields = fields.underGraduate;
    } else if (key === 2 && showGuardian === false) {
      loopFields = fields.Graduate;
    } else if (key === 4) {
      loopFields = fields.financialAid;
    } else if (key === 6) {
      if (
        (jsonData.hasOwnProperty("eslsca_esignature") &&
          jsonData.eslsca_esignature.length < 3) ||
        (jsonData.hasOwnProperty("eslsca_accepttermsanddonditions") &&
          !jsonData.eslsca_accepttermsanddonditions) ||
        (jsonData.hasOwnProperty("eslsca_esignature") &&
          !jsonData.eslsca_esignature.match(regex))
      )
        setValidationError(true);
      else setValidationError(false);
    } else {
      // loopFields = fields.Graduate;
    }
    for (let key in loopFields) {
      // console.log("All valid fields are", errorFields, key, loopFields[key]);
      if (
        applicationDataEdit[key] === undefined ||
        applicationDataEdit[key].length === 0
      ) {
        // console.log("error are",errorFields,key,loopFields[key])
        count++;
        errorFields = errorFields + " " + loopFields[key];
      }
    }
    // console.log("error fields", errorFields);

    if (errorFields.length !== 0) {
      // console.log("inside error block");
      let error = {
        isError: true,
        message:
          count === 1
            ? errorFields + " Field Can't be blank"
            : errorFields + " Fields Can't be blank",
        showSnackbar: false,
      };
      setError(error);
    } else {
      let error = {
        isError: false,
        message: "",
        showSnackbar: false,
      };
      setError(error);
    }
  };
  // console.log("error", error);
  const setfileUploadFields = () => {
    if (key === 3) {
      var filtterFormDataCopy = { ...fileData };
      // console.log("All set for file upload");

      let mapFileUpload = [...applicationDataEdit.fileUploadsDetails].map(
        (element) => {
          filtterFormDataCopy[mapDocumentType(element.ses_documenttype)] = "";
          return {
            ses_description: element.ses_description,
            ses_mandatory: element.ses_mandatory,
            ses_documenttype: mapDocumentType(element.ses_documenttype),
            ses_filetype: mapFileType(element.ses_filetype),
            ses_fileuploadlineid: element.ses_fileuploadlineid,
            uploadedFileData: fileData,
          };
        }
      );

      if (showGuardian) {
        fileUploadForm = mapFileUpload.filter((element) =>
          element.ses_description.includes("Undergraduate")
        );
      } else {
        fileUploadForm = mapFileUpload.filter((element) =>
          element.ses_description.includes("Graduate")
        );
      }

      setFileData(filtterFormDataCopy);
    }
  };

  useEffect(() => {
    scanForErrorFields();
    setfileUploadFields();
  }, [applicationDataEdit, key]);

  const handleSave = () => {
    // console.log("error.isError", error.isError);
    if (error.isError) {
      let errorCopy = { ...error };
      errorCopy.showSnackbar = true;
      setError(errorCopy);
    } else {
      if (key === 3) {
        let formDataValue = new FormData();
        Object.keys(fileData).forEach((e) =>
          formDataValue.append("files", fileData[e])
        );

        formDataValue.append(
          "folderName",
          JSON.stringify(
            `${applicationDataEdit["firstname"]} ${
              applicationDataEdit["lastname"]
            }_${window.localStorage
              .getItem("x-auth-contactId")
              .replace(/-/g, "")}/ses_applicant/${
              applicationDataEdit["ses_applicant"]
            }_${applicationDataEdit["ses_applicantid"].replace(/-/g, "")}`
          )
        );

        dispatch(saveFileUploadData(formDataValue));
        dispatch(
          getApplicantFee({
            ses_applicantid: applicationDataEdit.ses_applicantid,
          })
        );
      } else {
        dispatch(
          postApplicationData({
            ...applicationDataEdit,
            isGuardian: showGuardian,
            key: key,
            contactid: window.localStorage.getItem("x-auth-contactId"),
          })
        );
      }
    }
  };

  const updateProgramFields = (applicationData) => {
    if (applicationData.hasOwnProperty("programs")) {
      programs = [...applicationData.programs];
      programs = programs.map((data) => {
        return {
          value: data.ses_certificationprogramid,
          displayValue: data.ses_certificationprogramname,
        };
      });
      personalInformation[
        "_ses_certificationprogram_value"
      ].elementConfig.options = programs;
    }

    if (applicationData.hasOwnProperty("campuses")) {
      let campuses = [...applicationData.campuses];

      campuses = campuses.map((data) => {
        return {
          value: data.ses_campusid,
          displayValue: data.ses_campusname,
        };
      });
      education.graduate.attendanceJoiningDate[
        "_eslsca_campus_value"
      ].elementConfig.options = campuses;
    }

    if (applicationData.hasOwnProperty("tracks")) {
      let tracks = [...applicationData.tracks];

      tracks = tracks.map((data) => {
        return {
          value: data.ses_trackid,
          displayValue: data.ses_track,
        };
      });
      education.Undergraduate[
        "_ses_track_value"
      ].elementConfig.options = tracks;
    }
    if (applicationData.hasOwnProperty("attendance")) {
      let attendance = [...applicationData.attendance];

      attendance = attendance.map((data) => {
        return {
          value: data.eslsca_attendanceoptionid,
          displayValue: data.eslsca_attendanceoption,
        };
      });
      education.graduate.attendanceJoiningDate[
        "_eslsca_firstattendancescheduleoption_value"
      ].elementConfig.options = attendance;
      education.graduate.attendanceJoiningDate[
        "_eslsca_seconattendancescheduleoption_value"
      ].elementConfig.options = attendance;
    }
    if (applicationData.hasOwnProperty("academicyear")) {
      let academicyear = [...applicationData.academicyear];

      academicyear = academicyear.map((data) => {
        return {
          value: data.ses_academicperiodid,
          displayValue: data.ses_academicperiod,
        };
      });

      education.Undergraduate[
        "_eslsca_startingacademicyearundergraduate_value"
      ].elementConfig.options = academicyear.filter((data) => {
        return data.displayValue.length === 5;
      });
      education.graduate.attendanceJoiningDate[
        "_eslsca_startingacademicyeargraduate_value"
      ].elementConfig.options = academicyear.filter((data) => {
        return data.displayValue.length === 4;
      });
    }
    handleProgramChangeOnLoad(
      applicationData["_ses_certificationprogram_value"]
    );
  };
  useEffect(() => {
    if (!isObjectEmpty(applicationData)) {
      updateProgramFields(applicationData);
      setJsonData(applicationData);
      window.localStorage.setItem(
        "eslsca_accepttermsanddonditions",
        applicationData.eslsca_accepttermsanddonditions
      );
      window.localStorage.setItem(
        "eslsca_esignature",
        applicationData.eslsca_esignature
      );
      window.localStorage.setItem(
        "ses_applicantid",
        applicationData.ses_applicantid
      );
      dispatch(updateApplicationEditData(applicationData));
    }
  }, [applicationData, dispatch]);

  const handleNextClick = (data) => {
    if (formNavData.length <= data) {
      setKey(0);
    } else {
      setKey((prevState) => prevState + 1);
    }
  };
  const handlePrevClick = (data) => {
    if (data >= 0) {
      if (formNavData.length < data) {
        setKey(0);
      } else {
        setKey((prevState) => prevState - 1);
      }
    }
  };
  const handleClose = () => {
    if (event.showSnackbar) {
      let eventCopy = { ...event };
      eventCopy.showSnackbar = false;
      setEvent(eventCopy);
    } else {
      let errorCopy = { ...error };
      errorCopy.showSnackbar = false;
      setError(errorCopy);
    }
  };

  const getFileUploadFormDetails = () => {
    return fileUploadForm;
  };

  // console.log("jsonData", jsonData);
  function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }

  const handleFile = (event) => {
    var filtterFormDataCopy = { ...fileData };

    console.log("file event name ", event.target);
    if (event.target.value) {
      filtterFormDataCopy[event.target.name] = renameFile(
        event.target.files[0].name,
        event.target.name + "-" + event.target.files[0].name
      );
    }

    setFileData(filtterFormDataCopy);
  };

  // const countryName = countryCodes.findOne("countryCode", "IN");
  // console.log("countryName", countryName);
  // console.log("applicationDataEdit data error ", applicationDataEdit);
  // console.log("error", error);
  // console.log("programs", programs);

  const removeDuplicateFromObjects = (objectArray) => {
    if (objectArray.length > 0) {
      return objectArray.filter(
        (v, i, a) =>
          a.findIndex((t) => t.ses_documenttype === v.ses_documenttype) === i
      );
    }
    return [];
  };
  return (
    <Aux>
      <MessageIndicator
        open={event.showSnackbar || error.showSnackbar}
        message={error.message || event.message}
        handleClose={handleClose}
      />
      <Backdrop show={dataFetchingStatus} />
      <Grid className={classes.container}>
        <Typography component="div" className={classes.profileFont}>
          Apply Today
        </Typography>
      </Grid>

      <Grid container item>
        <Grid
          container
          item
          xs={12}
          sm={8}
          direction="column"
          style={{ margin: "0 auto" }}
        >
          {key === 3 ? (
            <UploadForm
              fileHandle={handleFile}
              formDetails={removeDuplicateFromObjects(
                getFileUploadFormDetails()
              )}
              uploadedFile={applicationDataEdit.files}
            />
          ) : key === 1 ? (
            <ConatactInformation
              formDetails={FormSourceData.conatactInformation}
              value={jsonData}
              changed={textFieldChangeHandler}
              handelChange={handelChange}
              handelDateChange={handelDateChange}
              showGuardian={showGuardian}
            />
          ) : key === 2 && showGuardian ? (
            <Typography component="div" className={FormStyle.formContainer}>
              <FormHeader name="Education Information Undergraduate" />
              <div className={classes.formDesign}>
                <FormBuilder
                  formDetails={FormSourceData.education.Undergraduate}
                  value={jsonData}
                  changed={textFieldChangeHandler}
                  handelChange={handelChange}
                  handelDateChange={handelDateChange}
                />
              </div>
            </Typography>
          ) : key === 2 && showGuardian === false ? (
            <GraduateInformation
              formDetails={FormSourceData.education.graduate}
              value={jsonData}
              changed={textFieldChangeHandler}
              handelChange={handelChange}
              handelDateChange={handelDateChange}
              showGuardian={showGuardian}
            />
          ) : key === 5 ? (
            <ApplicationFee
              value={jsonData}
              changed={textFieldChangeHandler}
              handelChange={handelChange}
              handelDateChange={handelDateChange}
              showGuardian={showGuardian}
            />
          ) : (
            <Typography component="div" className={FormStyle.formContainer}>
              <FormHeader name={formNavData[key].value} />
              <div className={classes.formDesign}>
                <FormBuilder
                  formDetails={formNavData[key].id}
                  value={jsonData}
                  changed={textFieldChangeHandler}
                  handelChange={handelChange}
                  handelDateChange={handelDateChange}
                />
              </div>
            </Typography>
          )}

          <Grid container item className={classes.bottomControls}>
            <Typography component="div">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handlePrevClick(key - 1)}
                disabled={key === 0}
                startIcon={<NavigateBeforeIcon />}
              >
                Back
              </Button>
            </Typography>
            <Typography component="div">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSave}
                disabled={validationError}
              >
                Save
              </Button>
            </Typography>

            <Typography component="div" className={classes.btnNext}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  dispatch(clearErrorStatusCode());
                  key === 5
                    ? props.history.push("/prospective/terms")
                    : handleSave();
                  handleNextClick(key + 1);
                }}
                disabled={error.isError || validationError}
                endIcon={<NavigateNextIcon />}
              >
                Next
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Aux>
  );
};

export default withRouter(ProspectivePage);
