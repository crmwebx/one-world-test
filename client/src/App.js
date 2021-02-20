import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Layout from "components/Layouts";
import Home from "containers/Home/";
import Profile from "containers/Profile";
import Error from "components/404Page";
import Login from "containers/Login";
import Register from "containers/Register";
import ClassPage from "containers/StudentContainer";
import SelectClass from "containers/StudentContainer/selectClass";
import Checkout from "components/Students/SelectClass/Checkout";
import Prospective from "containers/Prospective";
import AdmissionTest from "containers/Admission Test";
import Inquiry from "containers/Inquiry";
import Grades from "containers/Grades";
import PaymentPage from "components/Students/SelectClass/Checkout/paymentPage";
import InterviewSlection from "components/Prospective/InterviewSelection/";
import PaymentPageResponse from "components/Prospective/Payment/";
import PaymentHit from "components/Prospective/Payment/PaymentHit";
import TermsCondition from "components/Prospective/TermsCondition";
import PaymentTest from "components/Payment/";

function App() {
  const isLoggedIn = (props) => {
    if (window.localStorage.getItem("x-auth-token") == null) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <Layout>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route
          path="/faculty/profile"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <Profile {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/faculty/classes"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <ClassPage {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/home"
          exact
          render={(props) =>
            isLoggedIn(props) ? <Home {...props} /> : <Redirect to="/login" />
          }
        />

        <Route
          path="/prospective/application"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <Prospective {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/prospective/inquiry"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <Inquiry {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/prospective/admission-test"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <AdmissionTest {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/prospective/interview-selection"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <InterviewSlection {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/prospective/payment"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <PaymentHit {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/payment"
          exact
          render={(props) =>
            isLoggedIn(props) ? <PaymentTest /> : <PaymentTest />
          }
        />
        <Route
          path="/prospective/terms"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <TermsCondition {...props} />
            ) : (
              <TermsCondition {...props} />
            )
          }
        />
        {/* <Route path="/prospective/payment" exact render={PaymentPageResponse} />
        <Route path="/prospective/makePayment" exact render={PaymentHit} /> */}
        <Route
          path="/students/profile"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <Profile {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/students/classes"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <ClassPage {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/students/select-class"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <SelectClass {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/students/select-class/checkout"
          exact
          render={(props) =>
            isLoggedIn(props) ? (
              <Checkout {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/students/select-class/checkout/payment"
          exact
          render={PaymentPage}
        />
        <Route
          path="/students/grades"
          exact
          render={(props) =>
            isLoggedIn(props) ? <Grades {...props} /> : <Redirect to="/login" />
          }
        />
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>
        <Route path="*" component={Error} />
      </Switch>
    </Layout>
  );
}

export default App;
