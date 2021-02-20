import React from "react";
import {
  makeStyles,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@material-ui/core/";
import FormHeader from "components/FormHeader";
import config from "app/config";

const useStyle = makeStyles((theme) => ({
  tableStyle: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

function FormUpload(props) {
  const classes = useStyle(props);

  // console.log("props.formDetails", props);
  // let name = props.uploadedFile.find((data) => data.name.includes("Passport"))
  //   .name;
  // console.log("name is ", name);
  let mapFileUploadFields = "";
  if (props.formDetails.length > 0) {
    mapFileUploadFields = props.formDetails.map((element, index) => {
      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            {element.ses_documenttype}
          </TableCell>

          <TableCell>
            <TextField
              margin="normal"
              id="Upload File"
              label="Choose File"
              type="file"
              autoComplete="Choose File"
              name={element.ses_documenttype}
              onChange={props.fileHandle}
            />
          </TableCell>
          <TableCell>
            {/* {element.uploadedFileData.hasOwnProperty("Any")
              ? element.uploadedFileData.Any.File.name
              : null} */}
            {props.uploadedFile.length > 0 ? (
              props.uploadedFile.find((data) =>
                data.name.includes(element.ses_documenttype)
              ) !== undefined ? (
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ textTransform: "none", textDecoration: "none" }}
                >
                  <a
                    href={`${config.HOST_NAME}/${
                      props.uploadedFile.find((data) =>
                        data.name.includes(element.ses_documenttype)
                      ).name
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {
                      props.uploadedFile
                        .find((data) =>
                          data.name.includes(element.ses_documenttype)
                        )
                        .name.split("-")[1]
                    }
                  </a>
                </Button>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </TableCell>
        </TableRow>
      );
    });
  }

  return (
    <Grid container item className={classes.tableStyle}>
      <FormHeader name="Application Documents" />
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 700 }}>Document Type</TableCell>
              <TableCell style={{ fontWeight: 700 }}>
                File name of uploaded Document
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mapFileUploadFields.length > 0
              ? mapFileUploadFields
              : "Loading..."}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default FormUpload;
