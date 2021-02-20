import React from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core/";

import Aux from "hoc/Auxilliary";
import mainLogo from "assests/ESLSCALogo.png";

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    padding: "2rem 0",
    justifyContent: "space-between",
    margin: "0 auto",
    alignItems: "flex-start",
  },
  footerItem: {
    width: "15%",
    [theme.breakpoints.down("xs")]: {
      width: "90%",
      margin: "0 auto",
    },
  },
  logoPlace: {
    width: "60%",
    padding: "4px",
    [theme.breakpoints.down("xs")]: {
      width: "30%",
    },
  },
  about: {
    display: "flex",
    flexDirection: "column",
  },
  footerText: {
    color: "#fff",
    fontSize: "0.8rem",
  },
  footerHead: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#fff",
    textTransform: "uppercase",
    borderBottom: "1px solid white",
    width: "100%",
    paddingBottom: "6px",
  },
  footerMenuList: {
    listStyle: "none",
    margin: "0",
    padding: "0.5rem 0",
  },
  menuFooter: {
    color: "#fff",
    marginTop: "6px",
  },
  footerContact: {
    display: "flex",
    flexDirection: "column",
    color: "#fff",
  },
}));

const FooterItems = (props) => {
  const classes = useStyle(props);
  return (
    <Aux>
      <Grid container item className={classes.root}>
        <Grid container item className={classes.footerItem}>
          <Typography component="div" className={classes.about}>
            <div className={classes.logoPlace}>
              <img src={mainLogo} width="100%" alt="oneWorld logo" />
            </div>
            <Typography className={classes.footerText}>
              Preparing world-class calibers since 1949
            </Typography>
            <Typography className={classes.footerText}>
              Pyramids Heights, Building B06, Km 22 of Cairo – Alexandria Desert
              Road, Giza, Egypt
            </Typography>
          </Typography>
        </Grid>
        <Grid container item className={classes.footerItem}>
          <Typography component="h2" className={classes.footerHead}>
            Students
          </Typography>
          <Typography component="div">
            <ul className={classes.footerMenuList}>
              <li className={classes.menuFooter}>
                <Typography className={classes.footerText}>Profile</Typography>
              </li>
              <li className={classes.menuFooter}>
                <Typography className={classes.footerText}>Classes</Typography>
              </li>
              <li className={classes.menuFooter}>
                <Typography className={classes.footerText}>
                  Attendance
                </Typography>
              </li>
              <li className={classes.menuFooter}>
                <Typography className={classes.footerText}>Schedule</Typography>
              </li>
              <li className={classes.menuFooter}>
                <Typography className={classes.footerText}>Grades</Typography>
              </li>
            </ul>
          </Typography>
        </Grid>
        <Grid container item className={classes.footerItem}>
          <Typography component="h2" className={classes.footerHead}>
            FACULTY & STAFF
          </Typography>
          <Typography component="div">
            <ul className={classes.footerMenuList}>
              <li className={classes.menuFooter}>
                <Typography className={classes.footerText}>Profile</Typography>
              </li>
              <li className={classes.menuFooter}>
                <Typography className={classes.footerText}>Classes</Typography>
              </li>
              <li className={classes.menuFooter}>
                <Typography className={classes.footerText}>
                  Attendance
                </Typography>
              </li>
              <li className={classes.menuFooter}>
                <Typography className={classes.footerText}>
                  Tests & Score
                </Typography>
              </li>
              <li className={classes.menuFooter}>
                <Typography className={classes.footerText}>
                  Learning Management
                </Typography>
              </li>
            </ul>
          </Typography>
        </Grid>
        <Grid container item className={classes.footerItem}>
          <Typography component="h2" className={classes.footerHead}>
            CONTACT US
          </Typography>
          <Typography component="div" className={classes.footerContact}>
            <Typography
              style={{
                display: "flex",
                fontSize: "0.8rem",
                alignItems: "center",
                width: "100%",
              }}
              component="div"
            >
              Email -
              <Typography
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "0.7rem",
                  color: "#fff",
                  marginLeft: "6px",
                }}
              >
                <span>admission@eslsca.edu.eg</span>
              </Typography>
            </Typography>

            <Typography
              component="div"
              style={{ display: "flex", fontSize: "0.7rem", color: "#fff" }}
            >
              Phone - <span style={{ marginLeft: "6px" }}> 19298</span>
            </Typography>
          </Typography>
        </Grid>
      </Grid>
    </Aux>
  );
};

export default FooterItems;
