import React from "react";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import PhoneIcon from "@material-ui/icons/Phone";
import CakeIcon from "@material-ui/icons/Cake";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import DevicesIcon from "@material-ui/icons/Devices";
import PublicIcon from "@material-ui/icons/Public";
import StreetviewIcon from "@material-ui/icons/Streetview";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import TagFacesIcon from "@material-ui/icons/TagFaces";

let FromDetails = {
  primaryDetails: {
    emailaddress1: {
      elementType: "input",
      elementConfig: {
        type: "email",
        label: "Email Address",
        autoComplete: "email",
        name: "emailaddress1",
        required: true,
        fullWidth: true,
        disabled: true,
      },
      icon: <MailOutlineIcon style={{ color: "#959595" }} />,
      value: "",
    },
    firstname: {
      elementType: "input",
      elementConfig: {
        type: "text",
        autoFocus: true,
        label: "First Name",
        autoComplete: "first-name",
        name: "firstname",
        required: true,
        fullWidth: true,
      },
      icon: <AccountBoxIcon style={{ color: "#959595" }} />,
      value: "",
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
      value: "",
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
      value: "",
    },
    suffix: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Suffix",
        autoComplete: "suffix",
        name: "suffix",
        required: true,
        fullWidth: true,
      },
      icon: <AccountBoxIcon style={{ color: "#959595" }} />,
      value: "",
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
    gendercode: {
      elementType: "select",
      elementConfig: {
        options: [
          { value: "1", displayValue: "Male" },
          { value: "2", displayValue: "Female" },
        ],
        name: "gendercode",
      },
      value: "1",
    },
  },
  contact: {
    mobilephone: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Mobile Phone",
        autoComplete: "mobile-phone",
        name: "mobilephone",
        required: true,
        fullWidth: true,
      },
      icon: <PhoneIcon style={{ color: "#959595" }} />,
      value: "",
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
      value: "",
    },
    skypeId: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Skype ID",
        autoComplete: "mobile-phone",
        name: "skypeId",
        required: true,
        fullWidth: true,
      },
      icon: <DevicesIcon style={{ color: "#959595" }} />,
      value: "",
    },
  },
  HomeAddress: {
    address1_country: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Country",
        autoComplete: "Country",
        name: "address1_country",
        required: true,
        fullWidth: true,
      },
      icon: <PublicIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address1_line1: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Street",
        autoComplete: "Street",
        name: "address1_line1",
        required: true,
        fullWidth: true,
      },
      icon: <StreetviewIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address1_city: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "City",
        autoComplete: "City",
        name: "address1_city",
        required: true,
        fullWidth: true,
      },
      icon: <LocationCityIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address1_stateorprovince: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "State or Province",
        autoComplete: "State or Province",
        name: "address1_stateorprovince",
        required: true,
        fullWidth: true,
      },
      icon: <LocationCityIcon style={{ color: "#959595" }} />,
      value: "",
    },
    address1_postalcode: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Zip Code/Postal Code",
        autoComplete: "Zip Code/Postal Code",
        name: "address1_postalcode",
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
  emergenencyContact: {
    name: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Name",
        autoComplete: "name",
        name: "mobilephone",
        required: true,
        fullWidth: true,
        disabled: true,
      },
      icon: <AccountBoxIcon style={{ color: "#959595" }} />,
      value: "",
    },
    relationship: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Relationship",
        autoComplete: "Relationship",
        name: "relationship",
        required: true,
        fullWidth: true,
        disabled: true,
      },
      icon: <TagFacesIcon style={{ color: "#959595" }} />,
      value: "",
    },
    phone: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Emergency contact phone",
        autoComplete: "mobile-phone",
        name: "phone",
        required: true,
        fullWidth: true,
        disabled: true,
      },
      icon: <PhoneIcon style={{ color: "#959595" }} />,
      value: "",
    },
  },
};

export default FromDetails;
