import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
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
} from "@material-ui/core/";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";
import {
  removeParticularModalData,
  updatePrice,
  updateEuroPrice,
} from "reduxSlices/selectClassSlice";

import { isObjectEmpty } from "utils/general";
import { clearLoginData, isLoggedInUpdate } from "reduxSlices/loginSlice";
import Backdrop from "components/Backdrop/";
import Aux from "hoc/Auxilliary";
import MessageIndicator from "components/SnackBar";

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

const useStyles = makeStyles({
  TableControl: {
    display: "flex",
    flexDirection: "column",
  },

  formControl: {
    color: "white",
  },
});

function PageConatiner(props) {
  const dispatch = useDispatch();

  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const [tableMapData, setTableMapData] = useState([]);

  const selectClassData = useSelector(
    (state) => state.selectClassData.selectClassData
  );
  const price = useSelector((state) => state.selectClassData.price);
  const euroPrice = useSelector((state) => state.selectClassData.euroPrice);
  const dataFetchingStatus = useSelector(
    (state) => state.selectClassData.dataFetchingStatus
  );

  const errorMessage = useSelector(
    (state) => state.selectClassData.errorMessage
  );

  const errorStatusCode = useSelector(
    (state) => state.selectClassData.errorStatusCode
  );

  const handleClose = () => {
    let errorCopy = { ...error };
    errorCopy.showSnackbar = false;
    setError(errorCopy);
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

  const handleDelete = (id) => {
    const copyTableMapData = [...tableMapData];

    dispatch(
      removeParticularModalData(
        copyTableMapData.filter((data) => data.id !== id)
      )
    );
  };

  const handleClick = (e) => {
    e.preventDefault();

    props.history.push({
      pathname: "/students/select-class/checkout",
    });
  };

  const calcuatePrice = (selectClassData) => {
    let intialPrice = 0;
    let euroIntialPrice = 0;
    selectClassData.forEach((element) => {
      intialPrice += parseInt(element.egyptianPounds);
    });
    selectClassData.forEach((element) => {
      euroIntialPrice += element.euros;
    });

    dispatch(updatePrice(intialPrice));
    dispatch(updateEuroPrice(euroIntialPrice));
  };
  useEffect(() => {
    if (selectClassData.length > 0) {
      calcuatePrice(selectClassData);
      setTableMapData(selectClassData);
    }
  }, [selectClassData]);

  let tableData = "";
  console.log("selectClassData", selectClassData);
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
                    {/* <StyledTableCell>
                      {element.ses_grade ? "Yes" : "No"}
                    </StyledTableCell> */}
                    <StyledTableCell>{`€ ${element.euros}`}</StyledTableCell>
                    <StyledTableCell>{`E£ ${element.egyptianPounds}`}</StyledTableCell>

                    <StyledTableCell>
                      <IconButton onClick={() => handleDelete(element.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            : null;
      }
    }
  }

  // {`Total ${
  //   tableMapData.length > 0 && tableMapData[0].currency
  // } ${euroPrice}`}

  return (
    <Aux>
      <MessageIndicator
        open={error.showSnackbar}
        message={error.message}
        handleClose={handleClose}
      />
      <Backdrop show={dataFetchingStatus} />
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
              {/* <StyledTableCell>Grade Option</StyledTableCell> */}
              <StyledTableCell>Euros</StyledTableCell>
              <StyledTableCell>Egyptian Pounds</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
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
            endIcon={<NavigateNextIcon />}
            onClick={handleClick}
          >
            Next
          </Button>
          <Typography>
            <Button
              variant="outlined"
              color="primary"
              style={{ textTransform: "capitalize", marginRight: "0.5rem" }}
              disableRipple
            >
              {`Total € ${euroPrice}`}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              style={{ textTransform: "capitalize" }}
              disableRipple
            >
              {`Total E£ ${price}`}
            </Button>
          </Typography>
        </Typography>
      )}
    </Aux>
  );
}

export default withRouter(PageConatiner);
