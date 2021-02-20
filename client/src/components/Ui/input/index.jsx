import React, { useState } from "react";
import {
  TextField,
  FormControlLabel,
  FormControl,
  Select,
  Checkbox,
  MenuItem,
  TextareaAutosize,
  InputLabel,
  FormGroup,
  Typography,
} from "@material-ui/core/";
import moment from "moment";
import countryCodes from "country-codes-list";
import { countries } from "country-flags-svg";

import Aux from "hoc/Auxilliary";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const InputFiled = (props) => {
  // console.log("props", props);
  let message = "All good";
  const validateField = (props) => {
    if (props.elementConfig.name === "eslsca_esignature") {
      let regex = /^[a-zA-Z ]*$/;
      message = `Invalid ${props.elementConfig.autoComplete} should contain only albhabets`;
      return props.value.length < 3
        ? (message = `The ${props.elementConfig.autoComplete} should contain a minimum of three characters`)
        : !props.value.match(regex)
        ? true
        : false;
    }
    if (
      props.elementConfig.name === "firstname" ||
      props.elementConfig.name === "middlename" ||
      props.elementConfig.name === "lastname" ||
      props.elementConfig.name === "gurd_firstname" ||
      props.elementConfig.name === "gurd_middlename" ||
      props.elementConfig.name === "gurd_lastname"
    ) {
      let regex = /^[a-zA-Z ]*$/;
      message = `Invalid ${props.elementConfig.label} should contain only albhabets`;
      return props.value.length < 3
        ? (message = `The ${props.elementConfig.label} should contain a minimum of three characters`)
        : !props.value.match(regex)
        ? true
        : false;
    }
    if (
      props.elementConfig.name === "gurd_emailaddress1" ||
      props.elementConfig.name === "emailaddress2"
    ) {
      let emailExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailExp.test(String(props.value).toLowerCase())
        ? false
        : (message = `Invalid Email`);
    }

    if (props.elementConfig.name === "eslsca_arabicname") {
      let regex = /[\u0600-\u06FF]/;
      message = `Invalid ${props.elementConfig.label} should contain only arabic letters`;
      return props.value.length < 8
        ? (message = `${props.elementConfig.label} should contain minimum of eight characters`)
        : !props.value.match(regex)
        ? true
        : false;
    }
    if (props.isValid !== undefined && props.value.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  let inputElement = null;
  switch (props.inputType) {
    case "input":
      // console.log("props", props);
      inputElement = (
        <Aux>
          <TextField
            margin="normal"
            value={props.value}
            onChange={props.changed}
            {...props.elementConfig}
            color="secondary"
            InputProps={{
              endAdornment: props.icon,
            }}
            inputProps={{
              maxLength: props.maxLength ? props.maxLength : 50,
            }}
          />
          {validateField(props) ? (
            <Typography style={{ color: "#f50057", fontSize: "0.8rem" }}>
              {props.value.length === 0 ? props.errorMessage : message}
            </Typography>
          ) : null}
        </Aux>
      );
      break;

    case "mobile":
      let countryName = undefined;
      let countryValue =
        props.value.substr(0, 1) !== undefined
          ? props.value.substr(0, 1) === "+"
            ? props.value.substr(1, 3)
            : ""
          : "";

      countryName =
        countryValue.length > 0
          ? countryValue.substr(2, 1) === "-"
            ? countryCodes.findOne(
                "countryCallingCode",
                countryValue.substr(0, 2)
              )
            : countryCodes.findOne("countryCallingCode", countryValue)
          : undefined;

      // console.log("countries value", countryName);
      // console.log("countries value", countries[0]);
      inputElement = (
        <Aux>
          <InputLabel id={props.elementConfig.label}>
            Mobile Phone (000-9999999999)
          </InputLabel>
          <FormGroup row style={{ display: "flex", width: "100%" }}>
            <Select
              value={countryName !== undefined ? countryName.countryCode : ""}
              onChange={(event) =>
                props.handelChange(event, props.elementConfig.name)
              }
              displayEmpty
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: "4px",
              }}
            >
              {countries.map((data, index) => {
                return (
                  <MenuItem key={index} value={data.iso2}>
                    <img
                      src={data.flag}
                      width="20px"
                      style={{ marginRight: "8px" }}
                    />
                    {data.name}
                  </MenuItem>
                );
              })}
            </Select>
            <TextField
              margin="normal"
              value={props.value}
              onChange={props.changed}
              {...props.elementConfig}
              color="secondary"
              InputProps={{
                endAdornment: props.icon,
              }}
              inputProps={{
                maxLength: props.maxLength ? props.maxLength : 50,
              }}
              style={{ flex: "1", marginBottom: "0px" }}
            />
            {validateField(props) ? (
              <Typography style={{ color: "#f50057", fontSize: "0.8rem" }}>
                {props.errorMessage}
              </Typography>
            ) : null}
          </FormGroup>
        </Aux>
      );
      break;
    case "date":
      inputElement = (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            format="dd/MM/yyyy"
            value={props.value}
            maxDate={moment().subtract(10, "years").format()} //maxDate
            onChange={(event) =>
              props.handelDateChange(event, props.elementConfig.name)
            }
            {...props.elementConfig}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      );
      break;
    case "exactDate":
      inputElement = (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            format="dd/MM/yyyy"
            value={props.value}
            maxDate={new Date()} //maxDate
            onChange={(event) =>
              props.handelDateChange(event, props.elementConfig.name)
            }
            {...props.elementConfig}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      );
      break;
    case "checkbox":
      console.log("props", props);
      inputElement = (
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.value}
                onChange={(event) =>
                  props.handelDateChange(event, props.elementConfig.name)
                }
                name={props.elementConfig.name}
                style={{ fontSize: "0.5rem" }}
              />
            }
            label={props.elementConfig.label}
          />
        </FormGroup>
      );
      break;
    case "condition":
      inputElement = (
        <Aux>
          <Typography style={{ marginTop: "0.5rem" }}>
            • This application is only valid for the selected program.
          </Typography>
          <Typography>
            • The validity of this application is one year from the date of the
            submission.
          </Typography>
          <Typography>• The application fee is non-refundable</Typography>
          <Typography>
            • The schedule of choice in the application is for reference only,
            and ESLSCA reserves the right to publish classes with different
            schedules based upon our internal research and reports.
          </Typography>
          <Typography>
            • ESLSCAUniversity has the right to cancel this application without
            prior notice.
          </Typography>
          <Typography>
            • Decisions taken by ESLSCAUniversity are in good faith,based on the
            statements made in the students’ admission application, any false
            statements / omission of information discovered in the students’
            application, the University reserves the right to withdraw, amend
            its offer, or terminate the students’ registration at
            ESLSCAUniversity.
          </Typography>
          <Typography>• ESLSCAUniversity holds the right:</Typography>
          <ul>
            <li>
              For all the foregoing reasons, ESLSCA reserves the right not to
              provide any particular course, curriculum or facility to make
              variations to the content or method of delivery of courses, to
              discontinue courses and to merge or combine courses if such action
              is reasonably considered to be necessary by ESLSCA. If ESLSCA
              discontinues any course it will use reasonable endeavors to
              provide a suitable alternative and will take all reasonable steps
              to minimize any disruption that might result from such changes.
            </li>
            <li>
              Any offer of a place at ESLSCAUniversity is made on the
              understanding that; in accepting it the student undertakes to
              observe the Ordinances and Resolutions of the University and to
              abide by the rules and regulations that the University makes for
              its students from time to time. These currently include general
              disciplinary regulations and rules relating to examinations,
              libraries, and computing.
            </li>
          </ul>
        </Aux>
      );
      break;
    case "label":
      inputElement = (
        <Typography style={{ margin: "0.5rem 0" }}>
          {props.elementConfig.value}
        </Typography>
      );
      break;
    case "textArea":
      inputElement = (
        <TextareaAutosize
          rowsMax={10}
          aria-label="maximum height"
          placeholder="Comments"
          {...props.elementConfig}
          value={props.value}
          style={{ width: "100%", height: "8vh", marginTop: "8px" }}
        />
      );
      break;
    case "select":
      // console.log("select", props);
      inputElement = (
        <FormControl
          style={{ width: "100%", marginTop: "8px", marginBottom: "6px" }}
        >
          <InputLabel id={props.elementConfig.label}>
            {props.elementConfig.label}
          </InputLabel>
          <Select
            value={props.value}
            onChange={(event) =>
              props.handelChange(event, props.elementConfig.name)
            }
            displayEmpty
            labelId={props.elementConfig.label}
          >
            {props.elementConfig.options.map((data, index) => {
              return (
                <MenuItem key={index} value={data.value}>
                  {data.displayValue}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
      break;
    default:
      inputElement = (
        <TextField
          margin="normal"
          value={props.value}
          onChange={props.changed}
          {...props.elementConfig}
          color="secondary"
        />
      );
  }

  return <Aux>{inputElement}</Aux>;
};

export default InputFiled;
