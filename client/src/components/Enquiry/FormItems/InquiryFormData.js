import React from "react";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import PhoneIcon from "@material-ui/icons/Phone";
import CakeIcon from "@material-ui/icons/Cake";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import PublicIcon from "@material-ui/icons/Public";
import StreetviewIcon from "@material-ui/icons/Streetview";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

let inquiryData = {
  general: {
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        autoFocus: true,
        label: "Email",
        autoComplete: "Email",
        name: "email",
        required: true,
        fullWidth: true,
      },
      icon: <MailOutlineIcon style={{ color: "#959595" }} />,
      value: "test728@oneworldsis.com",
    },
    password: {
      elementType: "input",
      elementConfig: {
        type: "password",
        label: "Password",
        autoComplete: "password",
        name: "password",
        required: true,
        fullWidth: true,
      },
      icon: <LockOpenIcon style={{ color: "#959595" }} />,
      value: "123456",
    },
    confirmPassword: {
      elementType: "input",
      elementConfig: {
        type: "password",
        label: "Confirm Password",
        autoComplete: "confirmPassword",
        name: "confirmPassword",
        required: true,
        fullWidth: true,
      },
      icon: <LockIcon style={{ color: "#959595" }} />,
      value: "123456",
    },
  },
  conatactInformation: {
    salutation: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Salutation",
        autoComplete: "Salutation",
        name: "salutation",
        required: true,
        fullWidth: true,
      },
      icon: <SupervisorAccountIcon style={{ color: "#959595" }} />,
      value: "Fred",
    },
    firstname: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "First Name",
        autoComplete: "first-name",
        name: "firstname",
        required: true,
        fullWidth: true,
      },
      icon: <AccountBoxIcon style={{ color: "#959595" }} />,
      value: "Fred",
    },
    middlename: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Middle Name",
        autoComplete: "middle-name",
        name: "middlename",
        required: true,
        fullWidth: true,
      },
      icon: <AccountBoxIcon style={{ color: "#959595" }} />,
      value: "Said",
    },
    lastname: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Last Name",
        autoComplete: "last-name",
        name: "lastname",
        required: true,
        fullWidth: true,
      },
      icon: <AccountBoxIcon style={{ color: "#959595" }} />,
      value: "Thomas",
    },
    birthdate: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Birthday",
        autoComplete: "birthdate",
        name: "birthdate",
        required: true,
        fullWidth: true,
      },
      icon: <CakeIcon style={{ color: "#959595" }} />,
      value: "",
    },
    mobilePhone: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Mobile Phone",
        autoComplete: "mobile-phone",
        name: "mobilePhone",
        required: true,
        fullWidth: true,
      },
      icon: <PhoneIcon style={{ color: "#959595" }} />,
      value: "012122445684",
    },
    telephone1: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Home Phone",
        autoComplete: "mobile-phone",
        name: "telephone1",
        required: true,
        fullWidth: true,
      },
      icon: <PhoneAndroidIcon style={{ color: "#959595" }} />,
      value: "555-5555-5556",
    },
    contactMode: {
      elementType: "select",
      elementConfig: {
        options: [
          { value: "Any", displayValue: "Any" },
          { value: "Email", displayValue: "Email" },
          { value: "phone", displayValue: "phone" },
          { value: "Fax", displayValue: "Fax" },
          { value: "Mail", displayValue: "Mail" },
        ],
        name: "contactMode",
      },
      value: "Any",
    },
    comments: {
      elementType: "textArea",
      elementConfig: {
        name: "comments",
      },
      value: "Enter Comments",
    },
  },
  homeAddress: {
    address2_country: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Country",
        autoComplete: "Country",
        name: "address2_country",
        required: true,
        fullWidth: true,
      },
      icon: <PublicIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address2_line1: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Street",
        autoComplete: "Street",
        name: "address2_line1",
        required: true,
        fullWidth: true,
      },
      icon: <StreetviewIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address2_city: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "City",
        autoComplete: "City",
        name: "address2_city",
        required: true,
        fullWidth: true,
      },
      icon: <LocationCityIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address2_stateorprovince: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "State or Province",
        autoComplete: "State or Province",
        name: "address2_stateorprovince",
        required: true,
        fullWidth: true,
      },
      icon: <LocationCityIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address2_postalcode: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Zip Code/Postal Code",
        autoComplete: "Zip Code/Postal Code",
        name: "address2_postalcode",
        required: true,
        fullWidth: true,
      },
      icon: <AddLocationIcon style={{ color: "#959595" }} />,
      value: "",
    },
  },
  mailingAddress: {
    address2_country: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Country",
        autoComplete: "Country",
        name: "address2_country",
        required: true,
        fullWidth: true,
      },
      icon: <PublicIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address2_line1: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Street",
        autoComplete: "Street",
        name: "address2_line1",
        required: true,
        fullWidth: true,
      },
      icon: <StreetviewIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address2_city: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "City",
        autoComplete: "City",
        name: "address2_city",
        required: true,
        fullWidth: true,
      },
      icon: <LocationCityIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address2_stateorprovince: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "State or Province",
        autoComplete: "State or Province",
        name: "address2_stateorprovince",
        required: true,
        fullWidth: true,
      },
      icon: <LocationCityIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address2_postalcode: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Zip Code/Postal Code",
        autoComplete: "Zip Code/Postal Code",
        name: "address2_postalcode",
        required: true,
        fullWidth: true,
      },
      icon: <AddLocationIcon style={{ color: "#959595" }} />,
      value: "",
    },
  },
};

export default inquiryData;
