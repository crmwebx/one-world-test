import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import TablePagination from "@material-ui/core/TablePagination";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";
import {
  getClassData,
  clearErrorStatusCode,
  clearErrorMessage,
  clearClassData,
  getTermData,
  updateParmsForClass,
} from "reduxSlices/classesSlice";
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
  const classes = useStyles();
  const dispatch = useDispatch();
  const [termsData, setTerms] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState({
    isError: false,
    message: "",
    showSnackbar: false,
  });

  const [tableMapData, setTableMapData] = useState([]);

  const classData = useSelector((state) => state.classData.classData);
  const terms = useSelector((state) => state.classData.terms);
  const dataFetchingStatus = useSelector(
    (state) => state.classData.dataFetchingStatus
  );

  const errorMessage = useSelector((state) => state.classData.errorMessage);
  // console.log("errorMessage",errorMessage)
  const errorStatusCode = useSelector(
    (state) => state.classData.errorStatusCode
  );
  useEffect(() => {
    dispatch(getClassData(window.localStorage.getItem("x-auth-contactId")));
    dispatch(getTermData());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClose = () => {
    let errorCopy = { ...error };
    errorCopy.showSnackbar = false;
    setError(errorCopy);
  };

  const handleUpdate = (e, sessionId) => {
    e.preventDefault();
    // console.log("Called for update", sessionId);
    dispatch(updateParmsForClass({ sessionId }));
  };

  const handelLogout = () => {
    dispatch(clearLoginData());
    window.localStorage.removeItem("x-auth-token");
    window.localStorage.removeItem("x-auth-fullname");
    window.localStorage.removeItem("x-auth-contactId");
    window.localStorage.removeItem("isUserLoggedIn");
    dispatch(isLoggedInUpdate(false));
    dispatch(clearErrorStatusCode());
    dispatch(clearErrorMessage());
    dispatch(clearClassData());
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

  const compareDate = (date) => {
    // console.log("date", date);
    var currentDate = new Date();
    var givenDate = new Date(date);

    if (givenDate.getTime() > currentDate.getTime()) return true;
    return false;
  };

  useEffect(() => {
    if (!isObjectEmpty(classData)) setTableMapData(classData.data);
  }, [classData]);

  console.log("classData", classData);

  let tableData = "";
  let termData = "";
  if (!isObjectEmpty(classData.data)) {
    if (classData.data) {
      if (Array.isArray(classData.data)) {
        // console.log("table map data is ", tableMapData);
        tableData =
          tableMapData.length > 0
            ? tableMapData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((element, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {element.ses_class}
                      </StyledTableCell>
                      <StyledTableCell>
                        {element.ses_coursename}
                      </StyledTableCell>
                      <StyledTableCell>{element.ses_section}</StyledTableCell>
                      <StyledTableCell>
                        {element.ses_credits
                          ? element.ses_credits.toFixed(2)
                          : ""}
                      </StyledTableCell>
                      <StyledTableCell>
                        {element.ses_classstatus}
                      </StyledTableCell>
                      <StyledTableCell>
                        {element.ses_studentstatus}
                      </StyledTableCell>
                      <StyledTableCell>
                        {element.ses_gradeoption}
                      </StyledTableCell>

                      <StyledTableCell>{element.ses_termname}</StyledTableCell>
                      <StyledTableCell>
                        <IconButton
                          color="secoundary"
                          disabled={!compareDate(element.ses_lastdatetodrop)}
                          onClick={(e) =>
                            handleUpdate(e, element.ses_sessionid)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })
            : null;

        //setTerms(snap);
        //setClasess(classData.data);
        termData = terms.data.map((element, index) => (
          <MenuItem value={element.ses_termname} key={index}>
            {element.ses_termname}
          </MenuItem>
        ));
      }
    }
  }

  const handleChange = (event) => {
    const copyTableMapData = [...classData.data];
    if (event.target.value.length === 0) {
      setTableMapData(copyTableMapData);
    } else {
      let copyData = copyTableMapData.filter(
        (element) => element.ses_termname === event.target.value
      );
      setTableMapData(copyData);
    }

    setTerms(event.target.value);
  };
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
              <StyledTableCell>Class ID</StyledTableCell>
              <StyledTableCell>Course</StyledTableCell>
              <StyledTableCell>Class Section</StyledTableCell>
              <StyledTableCell>Credits</StyledTableCell>
              <StyledTableCell>Class status</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Grading option</StyledTableCell>

              <StyledTableCell>
                <div className={classes.TableControl}>
                  <FormControl className={classes.formControl}>
                    <Select
                      value={termsData}
                      onChange={handleChange}
                      className={classes.formControl}
                      displayEmpty
                    >
                      <MenuItem value="">All Terms</MenuItem>
                      {termData}
                    </Select>
                  </FormControl>
                </div>
              </StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableData}</TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={tableMapData.length > 0 ? tableMapData.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Aux>
  );
}

export default withRouter(PageConatiner);
