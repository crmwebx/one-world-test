const https = require("https");
const config = require("config");
const moment = require("moment");
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var DynamicsWebApi = require("dynamics-web-api");

const { isEmpty, setEmptyValue } = require("../utils/general");
const { response } = require("express");

const crmorg = process.env.CRMORG;
const clientid = process.env.CLIENTID;
const Client_secret = process.env.CLIENTSECRET;
let tokenendpoint = process.env.TOKENENDPOINT;
const crmwebapihost = process.env.CRMWEBAPIHOST;
const crmwebapiContactpath = process.env.CRMWEBAPIPATH;
const CRMBASEPATH = process.env.CRMBASEPATH;

var resource = "https://" + crmwebapihost;
var AuthenticationContext = require("adal-node").AuthenticationContext;
const { error } = require("console");
var adalContext = new AuthenticationContext(tokenendpoint);

function acquireToken(dynamicsWebApiCallback) {
  //a callback for adal-node
  function adalCallback(error, token) {
    // console.log("second");
    if (!error) {
      //call DynamicsWebApi callback only when a token has been retrieved
      dynamicsWebApiCallback(token);
    } else {
      // console.log("Token has not been retrieved. Error: " + error.stack);
    }
  }

  //call a necessary function in adal-node object to get a token
  adalContext.acquireTokenWithClientCredentials(
    resource,
    clientid,
    Client_secret,
    adalCallback
  );
}

var dynamicsWebApi = new DynamicsWebApi({
  webApiUrl: `https://${crmwebapihost}${CRMBASEPATH}`,
  onTokenRefresh: acquireToken,
  webApiVersion: "9.1",
});

const getToken = async () => {
  tokenendpoint = tokenendpoint.toLowerCase().replace("https://", "");
  var authhost = tokenendpoint.split("/")[0];
  var authpath = "/" + tokenendpoint.split("/").slice(1).join("/");
  var reqstring = "client_id=" + clientid;
  reqstring += "&resource=" + encodeURIComponent(crmorg);
  reqstring += "&client_secret=" + Client_secret;
  reqstring += "&grant_type=client_credentials";

  var tokenrequestoptions = {
    host: authhost,
    path: authpath,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(reqstring),
    },
  };
  return await getResultFromHttpRequest(
    tokenrequestoptions,
    reqstring,
    "getToken"
  );
};

const getResultFromHttpRequest = (requestParams, reqstring, purpose) => {
  return new Promise((resolve, reject) => {
    var tokenrequest = https.request(requestParams, function (response) {
      var responseparts = [];
      response.setEncoding("utf8");

      response.on("data", function (chunk) {
        responseparts.push(chunk);
      });
      response.on("end", function () {
        try {
          var completeresponse = responseparts.join("");
          var tokenresponse = JSON.parse(completeresponse);
          // console.log("complete response1 ", tokenresponse);
          if (reqstring !== undefined && purpose === "getToken") {
            var token = tokenresponse.access_token;
            resolve(token);
          } else {
            // console.log("complete response ", tokenresponse);
            resolve(tokenresponse);
          }
        } catch (error) {
          if (completeresponse === "" && purpose === "register") {
            // console.log("error occured ");
            resolve({ state: 1 });
          }
          reject(error);
        }
      });
    });
    tokenrequest.on("error", function (e) {
      reject(e);
    });

    if (reqstring !== undefined) {
      // console.log("write data");
      tokenrequest.write(reqstring);
    }

    tokenrequest.end();
  });
};

const signInRequest = async (email, password) => {
  const token = await getToken();

  var requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; odata.metadata=minimal",

    Prefer: "odata.maxpagesize=500",

    Prefer: "odata.include-annotations=*",
  };
  const requestedFields =
    "emailaddress1,contactid,ses_password,fullname,mobilephone";
  var baseAPIPath = encodeURI(
    crmwebapiContactpath +
      `?$select=${requestedFields}&$filter=emailaddress1 eq '${email}'`
  );

  var crmLoginRequestParams = {
    host: crmwebapihost,
    path: baseAPIPath,
    method: "Get",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(crmLoginRequestParams)
      .then((result) => {
        // console.log("result from login", result);
        if (result.value.length >= 1) {
          return { response: result.value[0], token };
        } else {
          return { error: config.get("InvalidPassword") };
        }
      })
      .catch((err) => {
        // console.log("error login ", err);
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};

const signUpRequest = async (payload) => {
  const token = await getToken();
  const { emailaddress1 } = payload;
  const { response, error } = await getResultFromFields(
    token,
    "emailaddress1",
    emailaddress1
  );
  if (response) {
    // console.log("response from register is ", response, response.length);
    if (response.length > 0) {
      return { error: config.get("userExits") };
    }
  } else {
    // console.log("err is1234 ", error);
    return { error: error };
  }
  let postData = JSON.stringify(payload);
  let requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": postData.length,
  };
  //set the crm request parameters
  var crmrequestoptions = {
    host: crmwebapihost,
    path: encodeURI(crmwebapiContactpath),
    method: "POST",
    headers: requestheaders,
  };
  // console.log("these lines executed");
  try {
    return await getResultFromHttpRequest(
      crmrequestoptions,
      postData,
      "register"
    )
      .then((result) => {
        // console.log("result is ", result);
        return { response: config.get("userRegister"), token };
      })
      .catch((err) => {
        // console.log("Error is ", err);
        return { error: err };
      });
  } catch (err) {
    // console.log("eeror is ", err);
    throw new Error(err);
  }
};

const getResultFromFields = async (token, fields, filterValue, contactId) => {
  var requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; odata.metadata=minimal",

    Prefer: "odata.maxpagesize=500",

    Prefer: "odata.include-annotations=*",
  };
  var baseAPIPath = "";
  if (contactId) {
    baseAPIPath = encodeURI(
      crmwebapiContactpath +
        `?$select=${fields}&$filter=contactid eq '${filterValue}'`
    );
  } else {
    baseAPIPath = encodeURI(
      crmwebapiContactpath +
        `?$select=${fields}&$filter=emailaddress1 eq '${filterValue}'`
    );
  }

  var getRequestParams = {
    host: crmwebapihost,
    path: baseAPIPath,
    method: "Get",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(getRequestParams)
      .then((result) => {
        // console.log("fiedls value from contact ", result);
        return { response: result.value };
      })
      .catch((err) => {
        // console.log("error in http request", err);
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};

const updateContactData = async (token, payload) => {
  // console.log("payload is ", payload, token);
  const leadId = payload.contactid;
  // delete payload.contactid;
  if (payload.birthdate === "") delete payload.birthdate;
  else {
    try {
      payload.birthdate = moment(payload.birthdate).format("YYYY-MM-DD");
    } catch (error) {
      // console.log(error);
      delete payload.birthdate;
    }
  }

  // if (payload.gendercode === "") payload.gendercode = null;

  let postData = JSON.stringify(payload);
  let requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": postData.length,
  };

  //set the crm request parameters
  let crmrequestoptions = {
    host: crmwebapihost,
    path: crmwebapiContactpath + `(${leadId})`,
    method: "PATCH",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(
      crmrequestoptions,
      postData,
      "register"
    )
      .then((result) => {
        return { response: result };
      })
      .catch((err) => {
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};

const getprofileData = async (token, contactId) => {
  return await getDataFromTable(
    token,
    "contacts",
    config.get("profileFields"),
    "contactid",
    contactId,
    context
  );
};

const getDataFromTable = async (
  token,
  tableName,
  fields,
  filterFiledName,
  filterValue,
  context,
  extraDetailsWithStateCodeZero
) => {
  var requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; odata.metadata=minimal",

    Prefer: "odata.maxpagesize=500",

    Prefer: "odata.include-annotations=*",
  };
  var baseAPIPath = "";

  if (extraDetailsWithStateCodeZero) {
    baseAPIPath = encodeURI(
      `${CRMBASEPATH}/${tableName}` +
        `?$select=${fields}&$filter=${"statecode"} eq 0 and ${filterFiledName} eq ${filterValue}`
    );
  } else {
    if (context) {
      baseAPIPath = encodeURI(
        `${CRMBASEPATH}/${tableName}` +
          `?$select=${fields}&$filter=${filterFiledName} eq ${filterValue} `
      );
    } else {
      baseAPIPath = encodeURI(
        `${CRMBASEPATH}/${tableName}` +
          `?$select=${fields}&$filter=${filterFiledName} eq '${filterValue}' `
      );
    }
  }

  // console.log("baseAPIPath", baseAPIPath);
  var getRequestLoginParams = {
    host: crmwebapihost,
    path: baseAPIPath,
    method: "Get",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(getRequestLoginParams)
      .then((result) => {
        if (result.value) {
          return { response: result.value };
        } else if (result.error) {
          return { error: result.error.message };
        }
      })
      .catch((err) => {
        console.log("data fetching error", err);
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};
const getDataFromTableBasedOnMultipleFilter = async (
  token,
  tableName,
  fields,
  filterFiledName,
  filterValue,
  studentType
) => {
  console.log("studentType", studentType);
  var requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; odata.metadata=minimal",

    Prefer: "odata.maxpagesize=500",

    Prefer: "odata.include-annotations=*",
  };
  var baseAPIPath = "";

  baseAPIPath = encodeURI(
    `${CRMBASEPATH}/${tableName}` +
      `?$select=${fields}&$filter=${"statecode"} eq 0 and ${filterFiledName} eq ${filterValue} and eslsca_bookingclosed ne ${true} and eslsca_classtype eq ${studentType}`
  );

  // console.log("baseAPIPath", baseAPIPath);
  var getRequestLoginParams = {
    host: crmwebapihost,
    path: baseAPIPath,
    method: "Get",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(getRequestLoginParams)
      .then((result) => {
        if (result.value) {
          return { response: result.value };
        } else if (result.error) {
          return { error: result.error.message };
        }
      })
      .catch((err) => {
        console.log("data fetching error", err);
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};

const getDataFromTableWithoutFilter = async (token, tableName, fields) => {
  var requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; odata.metadata=minimal",

    Prefer: "odata.maxpagesize=500",

    Prefer: "odata.include-annotations=*",
  };
  var baseAPIPath = encodeURI(
    `${CRMBASEPATH}/${tableName}` + `?$select=${fields}`
  );

  var getRequestLoginParams = {
    host: crmwebapihost,
    path: baseAPIPath,
    method: "Get",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(getRequestLoginParams)
      .then((result) => {
        if (result.value) {
          return { response: result.value };
        } else if (result.error) {
          return { error: result.error.message };
        }
      })
      .catch((err) => {
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};

const getDataFromTableBasedOnDateForTest = async (
  token,
  tableName,
  fields,
  ClassPage
) => {
  var requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; odata.metadata=minimal",

    Prefer: "odata.maxpagesize=500",

    Prefer: "odata.include-annotations=*",
  };
  var baseAPIPath = "";

  if (ClassPage) {
    baseAPIPath = encodeURI(
      `${CRMBASEPATH}/${tableName}` +
        `?$select=${fields}&$filter=${"statecode"} eq 0 and ses_registrationstartdate le ${moment().format(
          moment.HTML5_FMT.DATE
        )} and ses_registrationenddate ge ${moment().format(
          moment.HTML5_FMT.DATE
        )}`
    );
  } else {
    baseAPIPath = encodeURI(
      `${CRMBASEPATH}/${tableName}` +
        `?$select=${fields}&$filter=${"statecode"} eq 0 and eslsca_proctordateandtime ge ${moment().format(
          moment.HTML5_FMT.DATE
        )}`
    );
  }
  // console.log("baseAPIPath", baseAPIPath);
  var getRequestLoginParams = {
    host: crmwebapihost,
    path: baseAPIPath,
    method: "Get",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(getRequestLoginParams)
      .then((result) => {
        if (result.value) {
          return { response: result.value };
        } else if (result.error) {
          return { error: result.error.message };
        }
      })
      .catch((err) => {
        // console.log("error is ", err);
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};

const getDataFromTableBasedOnDateForInterviewSlot = async (
  token,
  tableName,
  fields
) => {
  var requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; odata.metadata=minimal",

    Prefer: "odata.maxpagesize=500",

    Prefer: "odata.include-annotations=*",
  };
  var baseAPIPath = "";
  baseAPIPath = encodeURI(
    `${CRMBASEPATH}/${tableName}` +
      `?$select=${fields}&$filter=${"statecode"} eq 0 and eslsca_numberofslotsleft gt 0 and eslsca_start ge ${moment()
        .utc()
        .add(2, "hours")
        .format()}`
  );

  var getRequestLoginParams = {
    host: crmwebapihost,
    path: baseAPIPath,
    method: "Get",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(getRequestLoginParams)
      .then((result) => {
        if (result.value) {
          return { response: result.value };
        } else if (result.error) {
          return { error: result.error.message };
        }
      })
      .catch((err) => {
        // console.log("error is ", err);
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};

const getDataFromTableBasedOnDate = async (
  token,
  tableName,
  fields,
  filterFiledName,
  filterValue
) => {
  var requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; odata.metadata=minimal",

    Prefer: "odata.maxpagesize=500",

    Prefer: "odata.include-annotations=*",
  };
  var baseAPIPath = "";
  baseAPIPath = encodeURI(
    `${CRMBASEPATH}/${tableName}` +
      `?$select=${fields}&$filter=${"statecode"} eq 0 and ${filterFiledName} eq ${filterValue} and ses_startdate ge ${moment().format(
        moment.HTML5_FMT.DATE
      )}`
  );

  var getRequestLoginParams = {
    host: crmwebapihost,
    path: baseAPIPath,
    method: "Get",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(getRequestLoginParams)
      .then((result) => {
        if (result.value) {
          return { response: result.value };
        } else if (result.error) {
          return { error: result.error.message };
        }
      })
      .catch((err) => {
        // console.log("error is ", err);
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};

const getDataFromTableBasedDateFilter = async (
  token,
  tableName,
  fields,
  filterFiledName,
  filterValue
) => {
  var requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; odata.metadata=minimal",

    Prefer: "odata.maxpagesize=500",

    Prefer: "odata.include-annotations=*",
  };
  var baseAPIPath = "";
  baseAPIPath = encodeURI(
    `${CRMBASEPATH}/${tableName}` +
      `?$select=${fields}&$filter=${"ses_studentstatus"} eq 284210000 and ${filterFiledName} eq ${filterValue} `
  );

  var getRequestLoginParams = {
    host: crmwebapihost,
    path: baseAPIPath,
    method: "Get",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(getRequestLoginParams)
      .then((result) => {
        if (result.value) {
          return { response: result.value };
        } else if (result.error) {
          return { error: result.error.message };
        }
      })
      .catch((err) => {
        //  console.log("error is ", err);
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};

const getDataFromTableOnCustomFilter = async (
  token,
  tableName,
  fields,
  filterData
) => {
  var requestheaders = {
    Authorization: "Bearer " + token,
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    Accept: "application/json",
    "Content-Type": "application/json; odata.metadata=minimal",

    Prefer: "odata.maxpagesize=500",

    Prefer: "odata.include-annotations=*",
  };
  var baseAPIPath = "";
  baseAPIPath = encodeURI(
    `${CRMBASEPATH}/${tableName}` + `?$select=${fields}&$filter=${filterData} `
  );

  var getRequestLoginParams = {
    host: crmwebapihost,
    path: baseAPIPath,
    method: "Get",
    headers: requestheaders,
  };

  try {
    return await getResultFromHttpRequest(getRequestLoginParams)
      .then((result) => {
        if (result.value) {
          return { response: result.value };
        } else if (result.error) {
          return { error: result.error.message };
        }
      })
      .catch((err) => {
        // console.log("error is ", err);
        return { error: err };
      });
  } catch (err) {
    throw new Error(err);
  }
};

const getGuradianDetails = async (token, loggedInContactId) => {
  const applicant_id = await getDataFromTable(
    token,
    "ses_applicants",
    "ses_applicantid",
    "_ses_contactid_value",
    loggedInContactId
  );
  if (
    applicant_id.hasOwnProperty("error") ||
    applicant_id.response[0] === undefined
  ) {
    // console.log("applicant id undefined");
    return {};
  }
  // console.log("applicant_id", applicant_id);
  let _ses_contactid_value = "";
  if (
    applicant_id.hasOwnProperty("response") &&
    applicant_id.response[0] !== undefined
  ) {
    // console.log("fwetch");
    _ses_contactid_value = await getDataFromTable(
      token,
      "ses_parents",
      "_ses_contactid_value",
      "_ses_applicantid_value",
      applicant_id.response[0].ses_applicantid
    );
  }
  // console.log("_ses_contactid_value", _ses_contactid_value);
  if (
    _ses_contactid_value.hasOwnProperty("error") ||
    _ses_contactid_value.response[0] === undefined
  ) {
    //  console.log("_ses_contactid_value undefined1");
    return {};
  }
  let guard = "";
  if (
    _ses_contactid_value.hasOwnProperty("response") &&
    _ses_contactid_value.response[0] !== undefined
  ) {
    guard = await getDataFromTable(
      token,
      "contacts",
      config.get("guardianFields"),
      "contactid",
      _ses_contactid_value.response[0]._ses_contactid_value
    );
  }

  // console.log("gurd", guard.response[0]);
  const sesApplicant = await getDataFromTable(
    token,
    "ses_parents",
    "ses_relationship",
    "_ses_applicantid_value",
    applicant_id.response[0].ses_applicantid
  );

  // console.log(
  //   "sesApplicant relationship",
  //   sesApplicant.response[0].ses_relationship
  // );
  guard.response[0].ses_relationship = sesApplicant.hasOwnProperty("response")
    ? sesApplicant.response[0].ses_relationship
    : {};
  return guard.response[0];
};

const getApplicationResult = async (token, contactId) => {
  try {
    const applicantId = await getDataFromTable(
      token,
      "ses_applicants",
      "ses_applicantid",
      "_ses_contactid_value",
      contactId
    );

    return await Promise.all([
      getDataFromTable(
        token,
        "contacts",
        config.get("conatctApplicationFields"),
        "contactid",
        contactId
      ),
      getDataFromTable(
        token,
        "ses_applicants",
        config.get("ApplicantApplicationFields"),
        "_ses_contactid_value",
        contactId
      ),
      getDataFromTable(
        token,
        "ses_previousschools",
        config.get("schoolsApplicationFields"),
        "_ses_contactid_value",
        contactId
      ),
      getDataFromTable(
        token,
        "ses_previousemployments",
        config.get("prevEmploymentAplicationFields"),
        "_ses_contact_value",
        contactId
      ),
      getDataFromTable(
        token,
        "ses_certificationprograms",
        config.get("programApplicationFields"),
        "statecode",
        0,
        "programs"
      ),
      getDataFromTable(
        token,
        "ses_campuses",
        config.get("campusApplicationFields"),
        "statecode",
        0,
        "programs"
      ),
      getDataFromTable(
        token,
        "ses_tracks",
        config.get("tracksApplicationFields"),
        "statecode",
        0,
        "programs"
      ),
      getGuradianDetails(token, contactId),
      getDataFromTable(
        token,
        "ses_academicperiods",
        config.get("AcademicYearListFields"),
        "statecode",
        0,
        "programs"
      ),
      getDataFromTableWithoutFilter(
        token,
        "eslsca_attendanceoptions",
        "eslsca_attendanceoption,eslsca_attendanceoptionid"
      ),

      getDataFromTableWithoutFilter(
        token,
        "ses_fileuploadlines",
        "ses_documenttype,ses_mandatory,ses_filetype,ses_description"
      ),
      getDataFromTable(
        token,
        "ses_applicants",
        config.get("finanicalAidFields"),
        "ses_applicantid",
        applicantId.response[0].ses_applicantid
      ),
    ]);
  } catch (err) {
    return { error: err };
  }
};

const setFieldIntialValue = (property) => {
  return property.constructor === String && property.length === 0
    ? null
    : property;
};

const formatBirthDay = (birthday) => {
  if (birthday === undefined) return moment("01/01/1900").format("YYYY-MM-DD");
  return birthday.constructor === String && birthday.length === 0
    ? moment("01/01/1900").format("YYYY-MM-DD")
    : moment(birthday).format("YYYY-MM-DD");
};

const createGuardianParentRecord = (parentData) => {
  dynamicsWebApi
    .create(parentData, "ses_parents")
    .then(function (id) {
      //   console.log("Parent record created", id);
    })
    .catch(function (error) {
      // console.log("error while creating parent row ", error);
    });
};

const createGuardianContactRecord = (
  contactRowData,
  applicantId,
  ses_realtionshipData
) => {
  const parentData = {
    ses_parentname:
      contactRowData.firstname +
      " " +
      contactRowData.middlename +
      " " +
      contactRowData.lastname,
    ses_relationship: ses_realtionshipData,
    "ses_ApplicantId@odata.bind": `/ses_applicants(${applicantId})`,
  };

  dynamicsWebApi
    .create(contactRowData, "contacts")
    .then(function (id) {
      (parentData["ses_ContactId@odata.bind"] = `/contacts(${id})`),
        createGuardianParentRecord(parentData);
    })
    .catch(function (error) {
      // console.log("error while creating conatct row ", error);
    });
};

const updateApplicationResult = async (token, payload) => {
  const { response, error } = await getDataFromTable(
    token,
    "ses_applicants",
    "ses_applicantid",
    "_ses_contactid_value",
    payload.contactid
  );
  if (error) return { error: config.get("error") };
  const ses_applicantid = response[0].ses_applicantid;

  if (payload.key === 6) {
    return dynamicsWebApi
      .update(ses_applicantid, "ses_applicants", {
        eslsca_accepttermsanddonditions:
          payload.eslsca_accepttermsanddonditions,
        eslsca_esignature: payload.eslsca_esignature,
        ses_applicantstatus: 284210000,
        ses_applicationdate: moment().format("YYYY-MM-DD"),
      })
      .then(function (res) {
        if (res) return { response: "updated", code: 201 };
        else return { error: config.get("error") };
      })
      .catch(function (error) {
        //  console.log("Error occured in payload key 6", error);
        return { error: config.get("error") };
      });
  }

  const {
    firstname,
    middlename,
    lastname,
    eslsca_arabicname,
    gendercode,
    governmentid,
    birthdate,
    ses_nationality,
    eslsca_dualnationality,
    emailaddress1,
    emailaddress2,
    mobilephone,
    address1_line1,
    address1_city,
    eslsca_cairodistrictbusiness,
    eslsca_cairodistrictresidential,
    address1_country,
    address1_postalcode,
    address2_line1,
    address2_city,
    address2_country,
    address2_postalcode,
    contactid,
    ses_birthcity,
    ses_birthcountry,
    ses_applicanttype,
    _ses_certificationprogram_value,
    _eslsca_startingacademicyeargraduate_value,
    eslsca_applicantsourceother,
    eslsca_applicantsource,
    eslsca_applyforfinancialaid,
    eslsca_scholarshiptype,
    eslsca_otherscholarship,
    eslsca_siblingateslsca,
    eslsca_siblingname,
    eslsca_siblinguniversityid,
    eslsca_accepttermsanddonditions,
    eslsca_esignature,
  } = payload;

  let contactFileds = {
    firstname,
    middlename,
    lastname,
    eslsca_arabicname,
    gendercode,
    governmentid,
    birthdate: formatBirthDay(birthdate),
    ses_nationality: setFieldIntialValue(ses_nationality),
    eslsca_dualnationality: setFieldIntialValue(eslsca_dualnationality),
    emailaddress1,
    emailaddress2,
    mobilephone,
    address1_line1,
    address1_city,
    eslsca_cairodistrictbusiness: setFieldIntialValue(
      eslsca_cairodistrictbusiness
    ),
    eslsca_cairodistrictresidential: setFieldIntialValue(
      eslsca_cairodistrictresidential
    ),
    address1_country,
    address1_postalcode,
    address2_line1,
    address2_city,
    address2_country,
    address2_postalcode,
  };

  let entity = {
    ses_birthcity,
    ses_birthcountry,
    ses_applicanttype,
    eslsca_applicantsourceother,
    eslsca_applicantsource: setFieldIntialValue(eslsca_applicantsource),
    "ses_CertificationProgram@odata.bind": `/ses_certificationprograms(${_ses_certificationprogram_value})`,
  };

  if (payload.key === 4) {
    // console.log("key 4", eslsca_scholarshiptype);
    return dynamicsWebApi
      .update(ses_applicantid, "ses_applicants", {
        eslsca_applyforfinancialaid,
        eslsca_scholarshiptype: parseInt(eslsca_scholarshiptype),
        eslsca_otherscholarship,
        eslsca_siblingateslsca,
        eslsca_siblingname,
        eslsca_siblinguniversityid,
      })
      .then(function (res) {
        if (res) return { response: "updated" };
        else return { error: config.get("error") };
      })
      .catch(function (error) {
        //   console.log("Error occured in payload key 4", error);
        return { error: config.get("error") };
      });
  }

  if (payload.isGuardian) {
    //  console.log("gurd");
    let guardianFields = {
      firstname: payload.gurd_firstname,
      middlename:
        payload.gurd_middlename === undefined ? "" : payload.gurd_middlename,
      lastname: payload.gurd_lastname,
      birthdate: formatBirthDay(payload.gurd_birthdate),
      ses_nationality: payload.gurd_ses_nationality,
      address1_line1: payload.gurd_address1_line1,
      address1_city: payload.gurd_address1_city,
      address1_country: payload.gurd_address1_country,
      address1_postalcode: payload.gurd_address1_postalcode,
      // ses_relationship: payload.ses_relationship,
      emailaddress1: payload.gurd_emailaddress1,
      mobilephone: payload.gurd_mobilephone,
    };
    // console.log("payload key", payload.key);

    // program is bachelor and trying to create/update undergraduate details
    if (payload.key === 2) {
      const isbachelorPrevSchoolexists = await getDataFromTable(
        token,
        "ses_previousschools",
        "ses_previousschoolid",
        "_ses_contactid_value",
        contactid
      );
      // console.log(
      //   "isbachelorPrevSchoolexists12",
      //   isbachelorPrevSchoolexists.response[0]
      // );
      const {
        ses_previousschool,
        ses_country,
        ses_graduationyear,
        ses_schoolcontact,
        eslsca_primaryteachinglanguage,
        eslsca_schoolcertificate,
        ses_certificateearned,
        _eslsca_startingacademicyearundergraduate_value,
        eslsca_startingsemesterundergraduate,
        eslsca_transfer,
        eslsca_semesternumberfortransfer,
        eslsca_transferfacultyorprogram,
        _ses_track_value,
      } = payload;
      // key is 2, gurd exists but edu records is empty
      if (isbachelorPrevSchoolexists.response[0] === undefined) {
        // create prevSchoolRecords
        // console.log("gurd exists but edu records is empty");
        const row = {
          "ses_ContactId@odata.bind": `/contacts(${contactid})`,
          "ses_ApplicantId@odata.bind": `/ses_applicants(${ses_applicantid})`,
          ses_schoollevel: 284210001,
          ses_previousschool,
          ses_country,
          ses_graduationyear,
          ses_schoolcontact,
          eslsca_primaryteachinglanguage,
          eslsca_schoolcertificate,
          ses_certificateearned,
        };
        // console.log("ses_shool_row", row);
        dynamicsWebApi.startBatch();
        dynamicsWebApi.create(row, "ses_previousschools");
        dynamicsWebApi.update(ses_applicantid, "ses_applicants", {
          "ses_Track@odata.bind": `/ses_tracks(${_ses_track_value})`,
          "eslsca_startingacademicyearundergraduate@odata.bind": `/ses_academicperiods(${_eslsca_startingacademicyearundergraduate_value})`,
          eslsca_startingsemesterundergraduate,
          eslsca_transfer,
          eslsca_transferfacultyorprogram,
          eslsca_semesternumberfortransfer: parseInt(
            eslsca_semesternumberfortransfer
          ),
        });
        try {
          return dynamicsWebApi
            .executeBatch()
            .then(function (res) {
              if (res[0] && res[1]) return { response: "updated" };
              else return { error: config.get("error") };
            })
            .catch(function (error) {
              // console.log("Error occured123", error);
              return { error: config.get("error") };
            });
        } catch (err) {
          // console.log("Error in webapi catch occured", err);
          return { error: config.get("error") };
        }
      } else {
        // console.log(
        //   "key is 2, gurd exists but edu records is not empty",
        //   ses_schoolcontact
        // );
        // console.log(
        //   " _eslsca_startingacademicyearundergraduate_value",
        //   _eslsca_startingacademicyearundergraduate_value
        // );
        dynamicsWebApi.startBatch();
        dynamicsWebApi.update(
          isbachelorPrevSchoolexists.response[0].ses_previousschoolid,
          "ses_previousschools",
          {
            ses_previousschool,
            ses_country,
            ses_graduationyear,
            ses_schoolcontact,
            eslsca_primaryteachinglanguage,
            eslsca_schoolcertificate,
            ses_certificateearned,
          }
        );
        dynamicsWebApi.update(ses_applicantid, "ses_applicants", {
          // _eslsca_startingacademicyearundergraduate_value,
          "eslsca_startingacademicyearundergraduate@odata.bind": `/ses_academicperiods(${_eslsca_startingacademicyearundergraduate_value})`,
          "ses_Track@odata.bind": `/ses_tracks(${_ses_track_value})`,
          eslsca_startingsemesterundergraduate,
          eslsca_transfer,
          eslsca_transferfacultyorprogram,
          eslsca_semesternumberfortransfer: parseInt(
            eslsca_semesternumberfortransfer
          ),
        });
        try {
          return dynamicsWebApi
            .executeBatch()
            .then(function (res) {
              // console.log("updated");
              if (res[0] && res[1]) return { response: "updated" };
              else return { error: config.get("error") };
            })
            .catch(function (error) {
              // console.log("Error occured125663", error);
              return { error: config.get("error") };
            });
        } catch (err) {
          // console.log("Error in webapi catch occured", err);
          return { error: config.get("error") };
        }
      }
    }
    if (payload.key !== 0) {
      const isGuardianExists = await getGuradianDetails(
        token,
        payload.contactid
      );

      // Guardian Exists then update contact, applicant and guardian data
      if (!isEmpty(isGuardianExists)) {
        // console.log("isGuardianExists", isGuardianExists.contactid);
        // console.log("_ses_applicantid_value", ses_applicantid);
        const { response, error } = await getDataFromTable(
          token,
          "ses_parents",
          "ses_parentid",
          "_ses_applicantid_value",
          ses_applicantid
        );
        if (error) return { error: config.get("error") };
        // console.log("response got from parent ", response);
        dynamicsWebApi.startBatch();

        dynamicsWebApi.update(contactid, "contacts", contactFileds);
        if (payload.key === 1) {
          dynamicsWebApi.update(ses_applicantid, "ses_applicants", {
            ses_birthcity,
            ses_birthcountry,
            ses_applicanttype,
            eslsca_applicantsourceother,
            eslsca_applicantsource: setFieldIntialValue(eslsca_applicantsource),
            "ses_CertificationProgram@odata.bind": `/ses_certificationprograms(${_ses_certificationprogram_value})`,
          });
        } else {
          dynamicsWebApi.update(ses_applicantid, "ses_applicants", entity);
        }

        dynamicsWebApi.update(
          isGuardianExists.contactid,
          "contacts",
          guardianFields
        );
        dynamicsWebApi.update(response[0].ses_parentid, "ses_parents", {
          ses_relationship: payload.ses_relationship,
        });
        try {
          return dynamicsWebApi
            .executeBatch()
            .then(function (res) {
              if (res[0] && res[1]) return { response: "updated" };
              else return { error: config.get("error") };
            })
            .catch(function (error) {
              //  console.log("Error occured123", error);
              return { error: config.get("error") };
            });
        } catch (err) {
          // console.log("Error in webapi catch occured", err);
          return { error: config.get("error") };
        }
      } else {
        //  console.log("guadian doesn't exist");
        if (payload.key === 1) {
          guardianFields.ses_status = 284210008;
          // console.log("Final gurd fields  ", guardianFields);
          // console.log("applicant id logged in ", ses_applicantid);

          createGuardianContactRecord(
            guardianFields,
            ses_applicantid,
            payload.ses_relationship
          );
        }
      }
    }
  }
  // when key is 0
  // console.log("Outside gurd update", payload.isGuardian, payload.key);
  // when no guardian
  if (payload.key === 2 && payload.isGuardian === false) {
    const isbachelorPrevSchoolexists = await getDataFromTable(
      token,
      "ses_previousschools",
      "ses_previousschoolid",
      "_ses_contactid_value",
      contactid
    );
    // console.log(
    //   "isbachelorPrevSchoolexists",
    //   isbachelorPrevSchoolexists.response[0]
    // );
    const {
      ses_previousschool,
      ses_country,
      eslsca_businessdegree,
      eslsca_gpa,
      ses_graduationyear,
      ses_employer,
      ses_previousemployment,
      ses_startdate,
      eslsca_primaryteachinglanguage,
      eslsca_schoolcertificate,
      ses_certificateearned,
      eslsca_yearsofrelevantexperience,
      _eslsca_campus_value,
      ses_schoolcontact,
      _eslsca_firstattendancescheduleoption_value,
      _eslsca_seconattendancescheduleoption_value,
      eslsca_startingsemestergraduate,
    } = payload;
    // when gurd doesn't exits and school record not exit
    if (isbachelorPrevSchoolexists.response[0] === undefined) {
      // create prevSchoolRecords
      // console.log("when gurd doesn't exits and school record not exit");
      const row = {
        "ses_ContactId@odata.bind": `/contacts(${contactid})`,
        "ses_ApplicantId@odata.bind": `/ses_applicants(${ses_applicantid})`,
        ses_schoollevel: 284210002,
        ses_previousschool,
        eslsca_businessdegree,
        eslsca_gpa: parseFloat(eslsca_gpa),
        ses_schoolcontact,
        ses_country,
        ses_graduationyear,
        eslsca_primaryteachinglanguage,
        eslsca_schoolcertificate,
        ses_certificateearned,
      };
      const prevEmpRow = {
        "ses_Contact@odata.bind": `/contacts(${contactid})`,
        "ses_ApplicantId@odata.bind": `/ses_applicants(${ses_applicantid})`,
        ses_employer,
        ses_previousemployment,
        ses_startdate,
      };
      dynamicsWebApi.startBatch();
      dynamicsWebApi.create(row, "ses_previousschools");
      dynamicsWebApi.create(prevEmpRow, "ses_previousemployments");
      dynamicsWebApi.update(ses_applicantid, "ses_applicants", {
        "eslsca_campus@odata.bind": `/ses_campuses(${_eslsca_campus_value})`,
        "eslsca_startingacademicyeargraduate@odata.bind": `/ses_academicperiods(${_eslsca_startingacademicyeargraduate_value})`,
        "eslsca_firstattendancescheduleoption@odata.bind": `/ses_academicperiods(${_eslsca_firstattendancescheduleoption_value})`,
        "eslsca_seconattendancescheduleoption@odata.bind": `/ses_academicperiods(${_eslsca_seconattendancescheduleoption_value})`,
        eslsca_yearsofrelevantexperience,
        eslsca_startingsemestergraduate,
      });
      try {
        return dynamicsWebApi
          .executeBatch()
          .then(function (res) {
            if (res[0] && res[1]) return { response: "updated" };
            else return { error: config.get("error") };
          })
          .catch(function (error) {
            // console.log("Error occured123", error);
            return { error: config.get("error") };
          });
      } catch (err) {
        // console.log("Error in webapi catch occured", err);
        return { error: config.get("error") };
      }
    } else {
      const prevEmploymentId = await getDataFromTable(
        token,
        "ses_previousemployments",
        "ses_previousemploymentid",
        "_ses_contact_value",
        contactid
      );
      // console.log("prevEmploymentId", prevEmploymentId.response[0]);
      // create prevEmployment Details
      if (prevEmploymentId.response[0] === undefined) {
        dynamicsWebApi.startBatch();
        dynamicsWebApi.update(
          isbachelorPrevSchoolexists.response[0].ses_previousschoolid,
          "ses_previousschools",
          {
            ses_previousschool,
            ses_country,
            ses_graduationyear,
            eslsca_businessdegree,
            eslsca_gpa: parseFloat(eslsca_gpa),
            ses_schoolcontact,
            // eslsca_primaryteachinglanguage,
            // eslsca_schoolcertificate,
            // ses_certificateearned,
          }
        );
        dynamicsWebApi.create(
          {
            "ses_Contact@odata.bind": `/contacts(${contactid})`,
            "ses_ApplicantId@odata.bind": `/ses_applicants(${ses_applicantid})`,
            ses_employer,
            ses_previousemployment,
            ses_startdate,
          },
          "ses_previousemployments"
        );

        dynamicsWebApi.update(ses_applicantid, "ses_applicants", {
          "eslsca_campus@odata.bind": `/ses_campuses(${_eslsca_campus_value})`,
          // "ses_academicperiod@odata.bind": `/ses_academicperiods(${_eslsca_startingacademicyeargraduate_value})`,
          "eslsca_startingacademicyeargraduate@odata.bind": `/ses_academicperiods(${_eslsca_startingacademicyeargraduate_value})`,
          "eslsca_firstattendancescheduleoption@odata.bind": `/ses_academicperiods(${_eslsca_firstattendancescheduleoption_value})`,
          "eslsca_seconattendancescheduleoption@odata.bind": `/ses_academicperiods(${_eslsca_seconattendancescheduleoption_value})`,
          eslsca_yearsofrelevantexperience,
          eslsca_startingsemestergraduate,
        });

        try {
          return dynamicsWebApi
            .executeBatch()
            .then(function (res) {
              if (res[0] && res[1]) return { response: "updated" };
              else return { error: config.get("error") };
            })
            .catch(function (error) {
              // console.log("Error occured update ", error);
              return { error: config.get("error") };
            });
        } catch (err) {
          // console.log("Error occured update catch block ", error);
          return { error: config.get("error") };
        }
      }
      // console.log("all update", _eslsca_campus_value);
      // when prevEmployment details and graduate details are creted
      // console.log("payload for update", payload);
      dynamicsWebApi.startBatch();

      dynamicsWebApi.update(
        isbachelorPrevSchoolexists.response[0].ses_previousschoolid,
        "ses_previousschools",
        {
          ses_previousschool,
          ses_country,
          ses_graduationyear,
          eslsca_businessdegree,
          eslsca_gpa: parseFloat(eslsca_gpa),
          ses_schoolcontact,
          // eslsca_primaryteachinglanguage,
          // eslsca_schoolcertificate,
          // ses_certificateearned,
        }
      );
      dynamicsWebApi.update(
        prevEmploymentId.response[0].ses_previousemploymentid,
        "ses_previousemployments",
        {
          ses_employer,
          ses_previousemployment,
          ses_startdate,
        }
      );
      // console.log(
      //   "eslsca_startingsemestergraduate",
      //   eslsca_startingsemestergraduate
      // );
      dynamicsWebApi.update(ses_applicantid, "ses_applicants", {
        "eslsca_campus@odata.bind": `/ses_campuses(${_eslsca_campus_value})`,
        "eslsca_startingacademicyeargraduate@odata.bind": `/ses_academicperiods(${_eslsca_startingacademicyeargraduate_value})`,
        "eslsca_firstattendancescheduleoption@odata.bind": `/ses_academicperiods(${_eslsca_firstattendancescheduleoption_value})`,
        "eslsca_seconattendancescheduleoption@odata.bind": `/ses_academicperiods(${_eslsca_seconattendancescheduleoption_value})`,
        eslsca_yearsofrelevantexperience,
        eslsca_startingsemestergraduate,
        // _eslsca_firstattendancescheduleoption_value,
      });
      //console.log("campus update", _eslsca_firstattendancescheduleoption_value);
      try {
        return dynamicsWebApi
          .executeBatch()
          .then(function (res) {
            // console.log("updated");
            if (res[0] && res[1]) return { response: "updated" };
            else return { error: config.get("error") };
          })
          .catch(function (error) {
            console.log("Error occured in update.......", error);
            return { error: config.get("error") };
          });
      } catch (err) {
        console.log("Error in webapi catch occured", err);
        return { error: config.get("error") };
      }
    }
  }
  // normal app flow updating conatcts and applicant table
  dynamicsWebApi.startBatch();
  if (payload.key === 0) {
    // console.log("all update key 0");
    dynamicsWebApi.update(contactid, "contacts", contactFileds);
    dynamicsWebApi.update(ses_applicantid, "ses_applicants", {
      ses_birthcity,
      ses_birthcountry,
      ses_applicanttype,
      eslsca_applicantsourceother,
      eslsca_applicantsource: setFieldIntialValue(eslsca_applicantsource),
      "ses_CertificationProgram@odata.bind": `/ses_certificationprograms(${_ses_certificationprogram_value})`,
    });
  } else {
    ///console.log("Applicant and conatct update else block");
    dynamicsWebApi.update(contactid, "contacts", contactFileds);
    if (payload.key === 1) {
      dynamicsWebApi.update(ses_applicantid, "ses_applicants", {
        ses_birthcity,
        ses_birthcountry,
        ses_applicanttype,
        eslsca_applicantsourceother,
        eslsca_applicantsource: setFieldIntialValue(eslsca_applicantsource),
        "ses_CertificationProgram@odata.bind": `/ses_certificationprograms(${_ses_certificationprogram_value})`,
      });
    } else {
      //console.log("jdjdj");
      dynamicsWebApi.update(ses_applicantid, "ses_applicants", entity);
    }
  }

  try {
    return dynamicsWebApi
      .executeBatch()
      .then(function (res) {
        if (res[0]) return { response: "updated" };
        else return { error: config.get("error") };
      })
      .catch(function (error) {
        //console.log("Error update key 0", error);
        return { error: config.get("error") };
      });
  } catch (err) {
    //console.log("Error in webapi catch occured", err);
    return { error: config.get("error") };
  }
};

const fetchClassDetails = async (token, contactId) => {
  const { response, error } = await getDataFromTable(
    token,
    "ses_students",
    "ses_studentid",
    "_ses_contactid_value",
    contactId
  );
  // console.log("response and error ", response, error);
  if (error || response.length === 0) return { error: config.get("error") };

  const studentId = response[0].ses_studentid;

  const studentSessions = await getDataFromTable(
    token,
    "ses_sessions",
    "ses_gradeoption,_ses_classid_value,_ses_courseid_value,ses_sessionid,ses_studentstatus",
    "_ses_studentid_value",
    studentId,
    null,
    "ExtraDetails"
  );

  if (studentSessions.error) return { error: config.get("error") };

  return { response: await setupClassData(token, studentSessions.response) };
};

const setupClassData = async (token, sessionsArray) => {
  if (sessionsArray.length === 0) return;
  var classResponse = [];

  await Promise.all(
    sessionsArray.map(async (element) => {
      classResponse.push(
        await prepareCustomResponseForClassPage(
          token,
          element._ses_classid_value,
          element._ses_courseid_value,
          element.ses_gradeoption,
          element.ses_sessionid,
          element.ses_studentstatus
        )
      );
    })
  );

  return classResponse;
};

const prepareCustomResponseForClassPage = async (
  token,
  classId,
  courseId,
  grade,
  ses_sessionid,
  status
) => {
  var customeResponse = {};
  customeResponse.ses_gradeoption = maskGradeOption(grade);
  customeResponse.ses_sessionid = ses_sessionid;
  customeResponse.ses_studentstatus = maskClassSessionStatus(status);
  return Promise.all([
    getDataFromTable(
      token,
      "ses_classes",
      "ses_classstatus,ses_class,ses_schoolname,ses_section,_ses_term_value",
      "ses_classid",
      classId,
      null,
      "ExtraDetails"
    ),
    getDataFromTable(
      token,
      "ses_courses",
      "ses_credits,ses_coursename",
      "ses_courseid",
      courseId,
      null,
      "ExtraDetails"
    ),
  ])
    .then(async (result) => {
      if (result[0].response.length > 0) {
        customeResponse.ses_classstatus = maskClassStatus(
          result[0].response[0].ses_classstatus
        );
        customeResponse.ses_class = result[0].response[0].ses_class;
        customeResponse.ses_schoolname = result[0].response[0].ses_schoolname;
        customeResponse.ses_section = setEmptyValue(
          result[0].response[0].ses_section
        );
        // console.log("terms is ", result[0].response[0]._ses_term_value);
        // customeResponse.ses_termname = .response[0].ses_termname;
        const term = await getDataFromTable(
          token,
          "ses_terms",
          "ses_termname,ses_lastdatetodrop",
          "ses_termid",
          result[0].response[0]._ses_term_value,
          null,
          "ExtraDetails"
        );
        customeResponse.ses_termname = term.response[0].ses_termname;
        customeResponse.ses_lastdatetodrop =
          term.response[0].ses_lastdatetodrop;
      }
      if (result[1].response.length > 0) {
        customeResponse.ses_credits = result[1].response[0].ses_credits;
        customeResponse.ses_coursename = result[1].response[0].ses_coursename;
      }
      // console.log("customeResponse", customeResponse);
      return customeResponse;
    })
    .catch((error) => {
      // console.log("error in promise ", error);
      return {};
    });
};

const maskClassStatus = (statusId) => {
  if (statusId === 284210000) return "Available";
  else if (statusId === 284210001) return "Full";
  else if (statusId === 284210002) return "Wait List";
  else if (statusId === 284210003) return "Cancelled";
  else if (statusId === 284210004) return "Closed";
  else if (statusId === 284210005) return "Completed";
  return "";
};
const maskGradeOption = (gradeId) => {
  if (gradeId === 284210000) return "Grade";
  else if (gradeId === 284210001) return "Pass/Fail";
  else if (gradeId === 284210002) return "Audit";
  return "";
};
const maskClassSessionStatus = (status) => {
  if (status === 284210000) return "Enrolled";
  else if (status === 284210001) return "Completed";
  else if (status === 284210002) return "Cancelled";
  else if (status === 284210003) return "Incomplete";
  else if (status === 284210004) return "Dropped";
  else if (status === 284210005) return "Tentative";
  else if (status === 284210006) return "Wait List";
  else if (status === 284210007) return "Transfer";
  return "";
};

const maskClassStatusData = (status) => {
  if (status === 284210000) return "Available";
  else if (status === 284210001) return "Full";
  else if (status === 284210002) return "Wait List";
  else if (status === 284210003) return "Cancelled";
  else if (status === 284210004) return "Completed";
  else if (status === 284210005) return "Closed";
  return "";
};

const queryClassTermDetails = async (token) => {
  const result = await getDataFromTableWithoutFilter(
    token,
    "ses_terms",
    "ses_termname"
  );
  return { response: result.response };
};

const updateClassData = (token, sessionId) => {
  return dynamicsWebApi
    .update(sessionId, "ses_sessions", {
      ses_studentstatus: 284210004,
    })
    .then((result) => {
      return { response: "Data Updated" };
    })
    .catch((err) => {
      //  console.log("error ", err);
      return { error: config.get("error") };
    });
};

const fetchSelectClassData = async (token, studentType) => {
  var selectClassResponse = [];
  let finalResponse = [];
  try {
    const terms = await getDataFromTableBasedOnDateForTest(
      token,
      "ses_terms",
      "ses_termid",
      "classPage"
    );
    console.log("terms", terms);
    if (terms.response.length > 0) {
      await Promise.all(
        terms.response.map(async (element, index) => {
          let result = await getDataFromTableBasedOnMultipleFilter(
            token,
            "ses_classes",
            config.get("selectClassFields"),
            "_ses_term_value",
            element.ses_termid,
            studentType
          );
          // console.log("result", result);
          selectClassResponse.push(...result.response);
        })
      );
    }
    if (selectClassResponse.length > 0) {
      await Promise.all(
        selectClassResponse.map(async (element, index) => {
          finalResponse.push(
            await prepareCustomResponseForSelectClassPage(
              token,
              element._ses_schoolid_value,
              element._ses_term_value,
              element._ses_courseid_value,
              element._ses_departmentid_value,
              element._ses_campusid_value,
              element._eslsca_attendanceoption_value,
              element.ses_deliverymethod,
              element.ses_startdate,
              element.ses_creditsavailable,
              element.ses_classstatus,
              element.ses_enddate,
              index,
              element.ses_classcapacity,
              element.ses_grade,
              element.ses_classid,
              element.ses_class,
              element._ses_product_value,
              element._eslsca_europroduct_value
            )
          );
        })
      );
    }
    // console.log("finalResponse", finalResponse);
    return { response: finalResponse };
  } catch (ex) {
    console.log("exception", ex);
    return { error: "Error No class Data Found" };
  }

  // try {
  //   const getAllClassDetails = await getDataFromTableBasedOnDate(
  //     token,
  //     "ses_classes",
  //     config.get("selectClassFields"),
  //     "ses_classstatus",
  //     284210000
  //   );
  //   console.log("class details", getAllClassDetails);
  //   if (getAllClassDetails.error) return { error: config.get("error") };
  //   // console.log(getAllClassDetails.response);
  //   if (getAllClassDetails.response.length > 0) {
  //     try {
  //       await Promise.all(
  //         getAllClassDetails.response.map(async (element, index) => {
  //           selectClassResponse.push(
  //             await prepareCustomResponseForSelectClassPage(
  //               token,
  //               element._ses_schoolid_value,
  //               element._ses_term_value,
  //               element._ses_courseid_value,
  //               element._ses_departmentid_value,
  //               element._ses_campusid_value,
  //               element._eslsca_attendanceoption_value,
  //               element.ses_deliverymethod,
  //               element.ses_startdate,
  //               element.ses_creditsavailable,
  //               element.ses_classstatus,
  //               element.ses_enddate,
  //               index,
  //               element.ses_classcapacity,
  //               element.ses_grade,
  //               element.ses_classid,
  //               element.ses_class
  //             )
  //           );
  //         })
  //       );
  //       // console.log("selectClassResponse", selectClassResponse);
  //       return { response: selectClassResponse };
  //     } catch (ex) {
  //       console.log("error is ", ex);
  //       return { error: config.get("error") };
  //     }
  //   }
  // } catch (ex) {
  //   console.log("ex", ex);
  //   return { error: config.get("error") };
  // }
};

const prepareCustomResponseForSelectClassPage = async (
  token,
  schoolId,
  termValue,
  CourseId,
  departmentId,
  campusId,
  attendanceOptionId,
  deliveryMethod,
  startDate,
  ses_creditsavailable,
  ses_classstatus,
  ses_enddate,
  index,
  ses_classcapacity,
  ses_grade,
  ses_classid,
  ses_class,
  egyptianPounds,
  euros
) => {
  // console.log("campusId", campusId);
  var customeResponse = {};
  customeResponse.currency = "";
  customeResponse.id = index;
  customeResponse.numberEnrolled = 0;
  customeResponse.ses_campusname = "";
  customeResponse.ses_schoolname = "";
  customeResponse.ses_termname = "";
  customeResponse.ses_class = ses_class;
  customeResponse.ses_classcapacity = ses_classcapacity;
  customeResponse.ses_grade = ses_grade;
  customeResponse.ses_classid = ses_classid;
  customeResponse.ses_startdate = moment(startDate).format("DD/MM/YYYY");
  customeResponse.ses_enddate = moment(ses_enddate).format("DD/MM/YYYY");
  customeResponse.ses_deliverymethod = deliveryMethod;
  customeResponse.ses_creditsavailable = ses_creditsavailable;
  customeResponse.ses_classstatus = maskClassStatusData(ses_classstatus);
  customeResponse.egyptianPounds = 0;
  customeResponse.euros = 0;
  customeResponse.facultyName = [];
  customeResponse.classDate = [];

  return Promise.all([
    schoolId !== null &&
      getDataFromTable(
        token,
        "ses_schools",
        "ses_schoolname,ses_schoolid",
        "ses_schoolid",
        schoolId,
        "context",
        "extra"
      ),
    termValue !== null &&
      getDataFromTable(
        token,
        "ses_terms",
        "ses_termname,ses_termid",
        "ses_termid",
        termValue,
        "context",
        "extra"
      ),
    CourseId !== null &&
      getDataFromTable(
        token,
        "ses_courses",
        "ses_coursename,ses_courseid,ses_course,_ses_productid_value",
        "ses_courseid",
        CourseId,
        "context",
        "extra"
      ),
    departmentId !== null &&
      getDataFromTable(
        token,
        "ses_departments",
        "ses_departmentname,ses_departmentid",
        "ses_departmentid",
        departmentId,
        "context",
        "extra"
      ),
    campusId !== null &&
      getDataFromTable(
        token,
        "ses_campuses",
        "ses_campusname,ses_campusid",
        "ses_campusid",
        campusId,
        "context",
        "extra"
      ),
    attendanceOptionId !== null &&
      getDataFromTable(
        token,
        "eslsca_attendanceoptions",
        "eslsca_attendanceoption,eslsca_attendanceoptionid",
        "eslsca_attendanceoptionid",
        attendanceOptionId,
        "context",
        "extra"
      ),
    ses_classid !== null &&
      getDataFromTableBasedDateFilter(
        token,
        "ses_sessions",
        "_ses_classid_value,ses_studentstatus",
        "_ses_classid_value",
        ses_classid
      ),
    egyptianPounds !== null &&
      getDataFromTable(
        token,
        "products",
        "price,_transactioncurrencyid_value",
        "productid",
        egyptianPounds,
        "context",
        "extra"
      ),
    euros !== null &&
      getDataFromTable(
        token,
        "products",
        "price,_transactioncurrencyid_value",
        "productid",
        euros,
        "context",
        "extra"
      ),
    ses_classid !== null &&
      getDataFromTable(
        token,
        "ses_facultylines",
        "ses_facultyname",
        "_ses_classid_value",
        ses_classid,
        "context",
        "extra"
      ),
    ses_classid !== null &&
      getDataFromTable(
        token,
        "ses_classdates",
        "ses_start",
        "_ses_classid_value",
        ses_classid,
        "context",
        "extra"
      ),
  ])
    .then(async (result) => {
      if (schoolId !== null && result[0].response.length > 0) {
        customeResponse.ses_schoolname = result[0].response[0].ses_schoolname;
        customeResponse.ses_schoolid = result[0].response[0].ses_schoolid;
      }

      if (termValue !== null && result[1].response.length > 0) {
        customeResponse.ses_termname = result[1].response[0].ses_termname;
        customeResponse.ses_termid = result[1].response[0].ses_termid;
      }

      if (CourseId !== null && result[2].response.length > 0) {
        customeResponse.ses_coursename = result[2].response[0].ses_coursename;
        customeResponse.ses_courseid = result[2].response[0].ses_courseid;
        customeResponse.ses_course = result[2].response[0].ses_course;
        // if (result[2].response[0]._ses_productid_value) {
        //   // console.log("result[2].response[0]", result[2].response[0]);
        //   const priceData = await getDataFromTable(
        //     token,
        //     "products",
        //     "price,_transactioncurrencyid_value",
        //     "productid",
        //     result[2].response[0]._ses_productid_value
        //   );

        //   // customeResponse.price = priceData.response[0].price;
        //   const currency = await getDataFromTable(
        //     token,
        //     "transactioncurrencies",
        //     "currencysymbol",
        //     "transactioncurrencyid",
        //     priceData.response[0]._transactioncurrencyid_value
        //   );
        //   customeResponse.currency = currency.response[0].currencysymbol;
        // }
      }
      if (departmentId !== null && result[3].response.length > 0) {
        customeResponse.ses_departmentname =
          result[3].response[0].ses_departmentname;
        customeResponse.ses_departmentid =
          result[3].response[0].ses_departmentid;
      }
      if (campusId !== null && result[4].response.length > 0) {
        customeResponse.ses_campusname = result[4].response[0].ses_campusname;
        customeResponse.ses_campusid = result[4].response[0].ses_campusid;
      }
      if (attendanceOptionId !== null && result[5].response.length > 0) {
        customeResponse.eslsca_attendanceoption =
          result[5].response[0].eslsca_attendanceoption;
        customeResponse.eslsca_attendanceoptionid =
          result[5].response[0].eslsca_attendanceoptionid;
      }
      if (ses_classid !== null && result[6].response.length > 0) {
        customeResponse.numberEnrolled = result[6].response.length;
      }
      if (egyptianPounds !== null && result[7].response.length > 0) {
        customeResponse.egyptianPounds = result[7].response[0].price;
        const currency = await getDataFromTable(
          token,
          "transactioncurrencies",
          "currencysymbol",
          "transactioncurrencyid",
          result[7].response[0]._transactioncurrencyid_value
        );
        customeResponse.currencyEgyptian = currency.response[0].currencysymbol;
      }
      if (euros !== null && result[8].response.length > 0) {
        customeResponse.euros = result[8].response[0].price;
        const currency = await getDataFromTable(
          token,
          "transactioncurrencies",
          "currencysymbol",
          "transactioncurrencyid",
          result[7].response[0]._transactioncurrencyid_value
        );
        customeResponse.currencyEuro = currency.response[0].currencysymbol;
      }
      if (ses_classid !== null && result[9].response.length > 0) {
        customeResponse.facultyName = result[9].response;
      }
      if (ses_classid !== null && result[10].response.length > 0) {
        // console.log("result[10].response", result[10].response);
        customeResponse.classDate = result[10].response;
      }

      return customeResponse;
    })
    .catch((error) => {
      //  console.log("error in promise ", error);
      return {};
    });
};

const getApplicationDetailsByContactId = async (token, contactId) => {
  try {
    return Promise.all([
      getDataFromTable(
        token,
        "ses_applicants",
        "ses_applicantid,eslsca_eattype,eslsca_eatscheduleddateandtime",
        "_ses_contactid_value",
        contactId
      ),
      getDataFromTableBasedOnDateForTest(
        token,
        "eslsca_eatdateandtimes",
        "eslsca_eatdateandtimeid,eslsca_eatdateandtime,eslsca_proctordateandtime"
      ),
    ])
      .then((result) => {
        const applicantDetails = {
          ...result[0],
          slots: result[1].response,
        };
        // console.log(applicantDetails);
        return { response: applicantDetails };
      })
      .catch((error) => {
        return { error: err };
      });
  } catch (err) {
    return { error: err };
  }
};

const saveApplicationDetailsByContactId = (token, payload) => {
  // console.log("payloaderrr", payload);
  const dateAndTime = moment
    .utc(payload.eslsca_eatscheduleddateandtime)
    .format("MMMM Do YYYY, h:mm:ss a");
  const {
    ses_applicantid,
    eslsca_eattype,
    eslsca_eatscheduleddateandtime,
  } = payload;
  return dynamicsWebApi
    .update(ses_applicantid, "ses_applicants", {
      eslsca_eattype: 991490000,
      eslsca_eatscheduleddateandtime: eslsca_eatscheduleddateandtime,
    })
    .then((result) => {
      return {
        response: `You are scheduled to take the EAT on ${dateAndTime}`,
      };
    })
    .catch((error) => {
      //  console.log(error);
      return { error };
    });
};

const saveApplicationOnlineDetails = (token, payload) => {
  // console.log("body", payload);
  // console.log("payload", payload, token);
  // console.log(payload.eslsca_numberofslotstaken_date);
  const dateAndTime = moment
    .utc(payload.eslsca_numberofslotstaken_date)
    .format("MMMM Do YYYY, h:mm a");

  const { ses_applicantid, eslsca_eatdateandtimeid } = payload;
  return dynamicsWebApi
    .update(ses_applicantid, "ses_applicants", {
      "eslsca_proctoredeatdateandtime@odata.bind": `/eslsca_eatdateandtimes(${eslsca_eatdateandtimeid})`,
      eslsca_eattype: 991490001,
    })
    .then((result) => {
      return {
        response: `You are scheduled to take the EAT on ${dateAndTime}`,
      };
    })
    .catch((error) => {
      // console.log(error);
      return { error: config.get("error") };
    });
};

const getInterviewSlots = (token) => {
  return getDataFromTableBasedOnDateForInterviewSlot(
    token,
    "eslsca_interviewdateandtimes",
    "eslsca_interviewdateandtimeid,eslsca_interviewdateandtime,eslsca_start,eslsca_end"
  )
    .then((result) => {
      return { response: result.response };
    })
    .catch((error) => {
      return { error: config.get("error") };
    });
};

const saveInterviewSlots = async (token, payload) => {
  // console.log("payload", payload);
  const { response, error } = await getDataFromTable(
    token,
    "ses_applicants",
    "ses_applicantid",
    "_ses_contactid_value",
    payload.contactid
  );
  if (error) return { error: config.get("error") };
  const ses_applicantid = response[0].ses_applicantid;

  // console.log("payload", payload);

  return dynamicsWebApi
    .update(ses_applicantid, "ses_applicants", {
      "eslsca_interviewperiod@odata.bind": `/eslsca_interviewdateandtimes(${payload.interviewSlot.eslsca_interviewdateandtimeid})`,
      eslsca_interviewstart: moment
        .utc(payload.interviewSlot.eslsca_start)
        .format("YYYY-MM-DDTHH:mm:ss"),
      eslsca_interviewend: moment
        .utc(payload.interviewSlot.eslsca_end)
        .format("YYYY-MM-DDTHH:mm:ss"),
    })
    .then((result) => {
      console.log("data updated", result);
      return {
        response: `Interview Slot Saved`,
      };
    })
    .catch((error) => {
      console.log(error);
      return { error: config.get("error") };
    });
};

const updateApplicantPaymentFields = (applicant_id) => {
  return dynamicsWebApi
    .update(applicant_id, "ses_applicants", {
      ses_applicationfeepaiddate: `${moment().utc().format()}`,
      ses_admissionfeepaid: true,
    })
    .then((result) => {
      return {
        response: `Fee Paid`,
      };
    })
    .catch((error) => {
      // console.log(error);
      return { error: config.get("error") };
    });
};

const getApplicantFee = async (token, payload) => {
  const { response, error } = await getDataFromTable(
    token,
    "ses_applicants",
    "eslsca_applicationfee",
    "ses_applicantid",
    payload.ses_applicantid
  );

  // console.log("response", response, error);

  if (response) {
    return {
      response: response[0],
    };
  }

  return { error: config.get("error") };
};

const getApplicantStatus = async (token, contactId) => {
  console.log("conatctId", contactId);
  return Promise.all([
    await getDataFromTable(
      token,
      "ses_applicants",
      "ses_applicantid,ses_applicantstatus",
      "_ses_contactid_value",
      contactId,
      "demo",
      "demo"
    ),
    await getDataFromTable(
      token,
      "ses_students",
      "ses_student,statuscode,eslsca_studenttype",
      "_ses_contactid_value",
      contactId,
      "demo",
      "demo"
    ),
  ])
    .then((result) => {
      let response = { ...result[0].response[0], ...result[1].response[0] };
      return { response: response };
    })
    .catch((error) => {
      console.log("error", error);
      return { error: config.get("error") };
    });
  // const { response, error } = await getDataFromTable(
  //   token,
  //   "ses_applicants",
  //   "ses_applicantid,ses_applicantstatus",
  //   "_ses_contactid_value",
  //   contactId
  // );

  // const { response, error } = await getDataFromTable(
  //   token,
  //   "ses_students",
  //   "ses_studentid",
  //   "_ses_contactid_value",
  //   contactId
  // );
};

module.exports = {
  signInRequest,
  signUpRequest,
  getprofileData,
  updateContactData,
  getApplicationResult,
  updateApplicationResult,
  fetchClassDetails,
  queryClassTermDetails,
  updateClassData,
  fetchSelectClassData,
  getApplicationDetailsByContactId,
  saveApplicationDetailsByContactId,
  saveApplicationOnlineDetails,
  getInterviewSlots,
  saveInterviewSlots,
  updateApplicantPaymentFields,
  getApplicantFee,
  getApplicantStatus,
};
