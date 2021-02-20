import React from "react";
import { Link } from "react-router-dom";
import { Grid, makeStyles, Typography } from "@material-ui/core/";
import Aux from "hoc/Auxilliary";
import imageFirst from "assests/ESC.png";
import imageSecound from "assests/class.png";
import imageThird from "assests/admission.png";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyle = makeStyles((theme) => ({
  rootGallery: {
    display: "flex",
    width: "100%",
    cursor: "pointer",
    justifyContent: "space-between",
    padding: "2rem 0",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
  galleryItems: {
    width: "31%",
    textAlign: "center",
    position: "relative",
    paddingBottom: "0.6rem",
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  imageText: {
    display: "flex",
    width: "100%",
    background: "#000",
    opacity: 0.35,
    color: "#fff",
    textTransform: "uppercase",
    justifyContent: "space-between",
    position: "absolute",
    bottom: "-1rem",
  },
}));

function Gallery(props) {
  const classes = useStyle(props);
  return (
    <Aux>
      <Grid container item xs={12} sm={12} className={classes.rootGallery}>
        <Grid item className={classes.galleryItems}>
          <img src={imageFirst} width="30%" alt="iamge1" />
          <Typography component="div" className={classes.imageText}>
            <Typography>
              <span style={{ marginLeft: "6px", fontSize: "0.8rem" }}>
                Student Profile
              </span>
            </Typography>
            <ChevronRightIcon />
          </Typography>
        </Grid>
        <Grid item className={classes.galleryItems}>
          <img src={imageSecound} width="30%" alt="iamge1" />
          <Typography component="div" className={classes.imageText}>
            <Typography>
              <span style={{ marginLeft: "6px", fontSize: "0.8rem" }}>
                Classes
              </span>
            </Typography>
            <ChevronRightIcon />
          </Typography>
        </Grid>
        <Grid item className={classes.galleryItems}>
          <Link to="/prospective/application">
            <img src={imageThird} width="30%" alt="iamge1" />
            <Typography component="div" className={classes.imageText}>
              <Typography>
                <span style={{ marginLeft: "6px", fontSize: "0.8rem" }}>
                  Admission
                </span>
              </Typography>
              <ChevronRightIcon />
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Aux>
  );
}

export default Gallery;
