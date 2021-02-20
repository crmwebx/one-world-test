import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import { intiateVapulusPayment } from "reduxSlices/selectClassSlice";
import { paymentRequest } from "reduxSlices/selectClassSlice";
import { useSelector, useDispatch } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Grid,
} from "@material-ui/core/";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

import { isObjectEmpty } from "utils/general";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import Backdrop from "components/Backdrop/";
import Aux from "hoc/Auxilliary";
import MessageIndicator from "components/SnackBar";
import parse from "html-react-parser";
import config from "app/config";

const useStyles = makeStyles({
  TableControl: {
    display: "flex",
    flexDirection: "column",
  },

  formControl: {
    color: "white",
  },
  classConatiner: {
    padding: "1rem 0",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  classFont: {
    fontSize: "1.8rem",
    fontWeight: 500,
    flex: 1,
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#005598",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function Checkout(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const [tableMapData, setTableMapData] = useState([]);
  const payRef = useRef(null);
  const selectClassData = useSelector(
    (state) => state.selectClassData.selectClassData
  );
  const dataFetchingStatus = useSelector(
    (state) => state.selectClassData.dataFetchingStatus
  );
  const paymentResponse = useSelector(
    (state) => state.selectClassData.paymentResponse
  );

  const errorMessage = useSelector(
    (state) => state.selectClassData.errorMessage
  );
  const price = useSelector((state) => state.selectClassData.price);
  const euroPrice = useSelector((state) => state.selectClassData.euroPrice);
  const errorStatusCode = useSelector(
    (state) => state.selectClassData.errorStatusCode
  );

  const handleClose = () => {
    let errorCopy = { ...error };
    errorCopy.showSnackbar = false;
    setError(errorCopy);
  };

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(paymentRequest());
  };

  const handelLogout = () => {
    dispatch(clearLoginData());
    window.localStorage.removeItem("x-auth-token");
    window.localStorage.removeItem("x-auth-fullname");
    window.localStorage.removeItem("x-auth-contactId");
    window.localStorage.removeItem("isUserLoggedIn");
    dispatch(isLoggedInUpdate(false));
    // dispatch(clearErrorStatusCode());
    // dispatch(clearErrorMessage());
    // dispatch(clearClassData());
    props.history.push("/login");
  };

  useEffect(() => {
    if (!isObjectEmpty(errorMessage) && errorMessage !== undefined) {
      if (errorStatusCode === 401) {
        let error = {
          isError: false,
          message: "Session Expired",
          showSnackbar: true,
        };
        setError(error);
        setTimeout(() => {
          handelLogout();
        }, 1600);
      } else {
        let error = {
          isError: false,
          message: errorMessage,
          showSnackbar: true,
        };
        setError(error);
      }
    }
  }, [errorMessage, errorStatusCode]);

  useEffect(() => {
    if (selectClassData.length > 0) {
      setTableMapData(selectClassData);
    }
  }, [selectClassData]);

  let tableData = "";

  if (selectClassData.length > 0) {
    if (selectClassData) {
      if (Array.isArray(selectClassData)) {
        tableData =
          tableMapData.length > 0
            ? tableMapData.map((element, index) => {
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {element.ses_termname}
                    </StyledTableCell>
                    <StyledTableCell>{element.ses_course}</StyledTableCell>
                    <StyledTableCell>
                      {element.ses_departmentname} <br />
                      {` Start Date- ${element.ses_startdate}`}
                      <br />
                      {` End Date- ${element.ses_enddate}`}
                    </StyledTableCell>
                    <StyledTableCell>{element.ses_classstatus}</StyledTableCell>
                    <StyledTableCell>
                      {element.ses_creditsavailable
                        ? element.ses_creditsavailable.toFixed(2)
                        : ""}
                    </StyledTableCell>
                    <StyledTableCell>
                      {element.ses_grade ? "Yes" : "No"}
                    </StyledTableCell>
                    <StyledTableCell>{`€ ${element.euros}`}</StyledTableCell>
                    <StyledTableCell>{`E£ ${element.egyptianPounds}`}</StyledTableCell>
                  </StyledTableRow>
                );
              })
            : null;
      }
    }
  }

  if (paymentResponse.length > 0) {
    return parse(paymentResponse);
  }

  const handlePayment = (e) => {
    // props.history.replace(
    //   "https://oneworldwebappcontainer.azurewebsites.net/api/payment"
    // );

    // dispatch(
    //   intiateVapulusPayment({
    //     token: `${window.localStorage.getItem("x-auth-token")}`,
    //     mobile: `${window.localStorage.getItem("x-auth-mobile")}`,
    //     email: `${window.localStorage.getItem("x-auth-email")}`,
    //     amount: `${euroPrice}`,
    //   })
    // );

    window.open(
      `${config.API_BASE_URL}payment?token=${window.localStorage.getItem(
        "x-auth-token"
      )}&mobile=${window.localStorage.getItem(
        "x-auth-mobile"
      )}&email=${window.localStorage.getItem(
        "x-auth-email"
      )}&amount=${euroPrice}`,
      "_blank"
    );
  };

  return (
    <Aux>
      <MessageIndicator
        open={error.showSnackbar}
        message={error.message}
        handleClose={handleClose}
      />
      <Backdrop show={dataFetchingStatus} />
      <Grid container>
        <Grid container item xs={10} style={{ margin: "0 auto" }}>
          <Grid className={classes.classConatiner}>
            <Typography component="div" className={classes.classFont}>
              Select Classes
            </Typography>
            <Typography
              component="div"
              className={classes.classFont}
              style={{ fontSize: "1.2rem" }}
            >
              Please review your course selection and confirm
            </Typography>
          </Grid>
          <TableContainer
            component={Paper}
            style={{ minHeight: "40vh", marginBottom: "10px" }}
          >
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Term</StyledTableCell>
                  <StyledTableCell>Code</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Class status</StyledTableCell>
                  <StyledTableCell>Credits</StyledTableCell>
                  <StyledTableCell>Grade Option</StyledTableCell>
                  <StyledTableCell>Euros</StyledTableCell>
                  <StyledTableCell>Egyptian Pounds</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>{tableData}</TableBody>
            </Table>
          </TableContainer>
          {selectClassData.length > 0 && (
            <Typography
              component="div"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                style={{ textTransform: "capitalize" }}
                startIcon={<NavigateBeforeIcon />}
                onClick={() => props.history.goBack()}
              >
                Back
              </Button>
              <Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ textTransform: "capitalize", marginRight: "0.5rem" }}
                  onClick={handlePayment}
                >
                  {`Pay € ${euroPrice}`}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ textTransform: "capitalize" }}
                  disableRipple
                >
                  {`Pay E£ ${price}`}
                </Button>
              </Typography>
            </Typography>
          )}
        </Grid>
      </Grid>
      <div ref={payRef}></div>
    </Aux>
  );
}

export default withRouter(Checkout);
