import React from "react";
import styles from "components/404Page/error.module.css";
import { Link } from "react-router-dom";

function index() {
  return (
    <div id={styles.notfound}>
      <div className={styles.notfound}>
        <div className={styles.notfound404}>
          <h1>404</h1>
        </div>
        <h2>Oops! Nothing was found</h2>
        <p>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable
          <Link to="/">Return to homepage</Link>
        </p>
      </div>
    </div>
  );
}

export default index;
