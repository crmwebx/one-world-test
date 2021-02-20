import React, { useState, useEffect } from "react";
import {
  makeStyles,
  withStyles,
  Button,
  Dialog,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  MenuItem,
  FormControl,
  Select,
  Tooltip,
} from "@material-ui/core/";

import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { isObjectEmpty } from "utils/general";
import { addSelectClassData } from "reduxSlices/selectClassSlice";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles({
  formControl: {
    color: "white",
  },
  formRoot: {
    color: "white",
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

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const ModalDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [termsData, setTerms] = useState("");
  const [dptData, setDptData] = useState("");
  const [courseData, setCourseData] = useState("");
  const [campuses, setCampusData] = useState("");
  const [tableMapData, setTableMapData] = useState([]);

  const modalData = useSelector((state) => state.selectClassData.modalData);
  const selectClassData = useSelector(
    (state) => state.selectClassData.selectClassData
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChange = (event) => {
    const copyTableMapData = [...modalData];
    if (event.target.name === "term") {
      if (event.target.value.length === 0) {
        setTableMapData(copyTableMapData);
      } else {
        let copyData = copyTableMapData.filter(
          (element) => element.ses_termname === event.target.value
        );
        setTableMapData(copyData);
      }

      setTerms(event.target.value);
    }
    if (event.target.name === "dept") {
      if (event.target.value.length === 0) {
        setTableMapData(copyTableMapData);
      } else {
        let copyData = copyTableMapData.filter(
          (element) => element.ses_departmentname === event.target.value
        );
        setTableMapData(copyData);
      }

      setDptData(event.target.value);
    }
    if (event.target.name === "course") {
      if (event.target.value.length === 0) {
        setTableMapData(copyTableMapData);
      } else {
        let copyData = copyTableMapData.filter(
          (element) => element.ses_coursename === event.target.value
        );
        setTableMapData(copyData);
      }

      setCourseData(event.target.value);
    }
    if (event.target.name === "campus") {
      // console.log("campus", event.target.value);
      if (event.target.value.length === 0) {
        setTableMapData(copyTableMapData);
      } else {
        let copyData = copyTableMapData.filter(
          (element) => element.ses_campusname === event.target.value
        );
        setTableMapData(copyData);
      }

      setCampusData(event.target.value);
    }
  };

  const handleAddData = (id) => {
    if (isObjectEmpty(selectClassData.find((data) => data.id === id))) {
      const copyTableMapData = [...tableMapData];

      dispatch(
        addSelectClassData(copyTableMapData.find((data) => data.id === id))
      );
    }

    props.handleClose();
  };

  const removeDuplicateFromObjects = (objectArray, field) => {
    if (objectArray.length > 0) {
      if (field === "termName")
        return objectArray.filter(
          (v, i, a) =>
            a.findIndex((t) => t.ses_termname === v.ses_termname) === i
        );
      else if (field === "dept")
        return objectArray.filter(
          (v, i, a) =>
            a.findIndex(
              (t) => t.ses_departmentname === v.ses_departmentname
            ) === i
        );
      else if (field === "course")
        return objectArray.filter(
          (v, i, a) =>
            a.findIndex((t) => t.ses_coursename === v.ses_coursename) === i
        );
      else if (field === "campus")
        return objectArray.filter(
          (v, i, a) =>
            a.findIndex((t) => t.ses_campusname === v.ses_campusname) === i
        );
    }
    return [];
  };

  useEffect(() => {
    if (!isObjectEmpty(modalData)) {
      setTableMapData(modalData);
    }
  }, [modalData]);

  let tableData = "";
  let termData = "";
  let deptsData = "";
  let coursesData = "";
  let campusData = "";
  if (!isObjectEmpty(modalData)) {
    if (modalData) {
      if (Array.isArray(modalData)) {
        tableData =
          tableMapData.length > 0
            ? tableMapData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((element, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        <HtmlTooltip
                          title={
                            <React.Fragment>
                              <Typography
                                component="body"
                                style={{ fontSize: "0.75rem" }}
                              >
                                Class - {element.ses_class}
                              </Typography>
                              <Typography
                                component="body"
                                style={{ fontSize: "0.75rem" }}
                              >
                                Department - {element.ses_departmentname}
                              </Typography>
                              <Typography
                                component="body"
                                style={{ fontSize: "0.75rem" }}
                              >
                                Start Date - {element.ses_startdate}
                              </Typography>
                              <Typography
                                component="body"
                                style={{ fontSize: "0.75rem" }}
                              >
                                End Date - {element.ses_enddate}
                              </Typography>
                              {element.classDate.length > 0 ? (
                                element.classDate.map((d) => (
                                  <Typography
                                    component="body"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    Class Date -{" "}
                                    {moment(d.ses_start).format("DD/MM/YYYY")}
                                  </Typography>
                                ))
                              ) : (
                                <Typography
                                  component="body"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  Class Dates -{" "}
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                        >
                          <Button>{element.ses_termname}</Button>
                        </HtmlTooltip>
                      </StyledTableCell>
                      <StyledTableCell>
                        {element.ses_departmentname}
                      </StyledTableCell>
                      <StyledTableCell>
                        {` ${element.ses_course}- ${element.ses_coursename}`}
                        <br />
                        {`${element.ses_class}`}
                      </StyledTableCell>
                      <StyledTableCell>
                        {element.ses_campusname}
                      </StyledTableCell>
                      <StyledTableCell>
                        {element.facultyName.length > 0
                          ? element.facultyName.map((e, index) => (
                              <Typography variant="body2" display="block">
                                {e.ses_facultyname}
                                {e.ses_facultyname !== null &&
                                element.facultyName.length > 1 &&
                                element.facultyName.length - index !== 1
                                  ? `,`
                                  : null}
                              </Typography>
                            ))
                          : null}
                      </StyledTableCell>
                      <StyledTableCell>
                        {element.ses_creditsavailable
                          ? element.ses_creditsavailable.toFixed(2)
                          : ""}
                      </StyledTableCell>

                      <StyledTableCell>
                        {element.ses_classcapacity === null
                          ? 0
                          : element.ses_classcapacity}
                        /{element.numberEnrolled}
                      </StyledTableCell>
                      <StyledTableCell>{element.ses_startdate}</StyledTableCell>
                      <StyledTableCell>{`€ ${element.euros}`}</StyledTableCell>
                      <StyledTableCell>{`E£ ${element.egyptianPounds}`}</StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<AddIcon />}
                          style={{ textTransform: "capitalize" }}
                          onClick={() => handleAddData(element.id)}
                        >
                          Add
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })
            : null;

        termData = removeDuplicateFromObjects(modalData, "termName").map(
          (element, index) => (
            <MenuItem value={element.ses_termname} key={index}>
              {element.ses_termname}
            </MenuItem>
          )
        );

        deptsData = removeDuplicateFromObjects(modalData, "dept").map(
          (element, index) => (
            <MenuItem value={element.ses_departmentname} key={index}>
              {element.ses_departmentname}
            </MenuItem>
          )
        );
        coursesData = removeDuplicateFromObjects(modalData, "course").map(
          (element, index) => (
            <MenuItem value={element.ses_coursename} key={index}>
              {` ${element.ses_course}- ${element.ses_coursename}`}
            </MenuItem>
          )
        );
        campusData = removeDuplicateFromObjects(modalData, "campus").map(
          (element, index) => (
            <MenuItem value={element.ses_campusname} key={index}>
              {`${element.ses_campusname}`}
            </MenuItem>
          )
        );
      }
    }
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Dialog
      onClose={props.handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
        Course Catalog
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer
          component={Paper}
          style={{ minHeight: "40vh", marginBottom: "10px" }}
        >
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.formRoot}>
                  Term
                  <FormControl className={classes.formControl}>
                    <Select
                      value={termsData}
                      onChange={handleChange}
                      className={classes.formControl}
                      displayEmpty
                      name="term"
                    >
                      <MenuItem value="">All Terms</MenuItem>
                      {termData}
                    </Select>
                  </FormControl>
                </StyledTableCell>
                <StyledTableCell
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  Department
                  <FormControl className={classes.formControl}>
                    <Select
                      value={dptData}
                      onChange={handleChange}
                      className={classes.formControl}
                      displayEmpty
                      name="dept"
                    >
                      <MenuItem value="">All Department</MenuItem>
                      {deptsData}
                    </Select>
                  </FormControl>
                </StyledTableCell>
                <StyledTableCell>
                  Course
                  <FormControl
                    className={classes.formControl}
                    style={{ display: "flex" }}
                  >
                    <Select
                      value={courseData}
                      onChange={handleChange}
                      className={classes.formControl}
                      displayEmpty
                      name="course"
                    >
                      <MenuItem value="">All Courses</MenuItem>
                      {coursesData}
                    </Select>
                  </FormControl>
                </StyledTableCell>
                <StyledTableCell>
                  Campus
                  <FormControl
                    className={classes.formControl}
                    style={{ display: "flex" }}
                  >
                    <Select
                      value={campuses}
                      onChange={handleChange}
                      className={classes.formControl}
                      displayEmpty
                      name="campus"
                    >
                      <MenuItem value="">All Campuses</MenuItem>
                      {campusData}
                    </Select>
                  </FormControl>
                </StyledTableCell>
                <StyledTableCell>Faculty</StyledTableCell>
                <StyledTableCell>Credits</StyledTableCell>
                <StyledTableCell>Enrolled / Availability</StyledTableCell>
                <StyledTableCell>First Meeting</StyledTableCell>
                <StyledTableCell>Euros</StyledTableCell>
                <StyledTableCell>Egyptian Pounds</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
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
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDialog;
