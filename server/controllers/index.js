const config = require("config");
const bcrypt = require("bcrypt");
var axios = require("axios");
const querystring = require("querystring");
var spsave = require("spsave").spsave;
const sha256 = require("js-sha256").sha256;
const fs = require("fs");
var path = require("path");
var vapulusHash = require("vapulus-hashing-pkg");
let applicant_id = "";
const SHAREPOINTSITEURL = process.env.SHAREPOINTSITEURL;
const SHAREPOINTUSERNAME = process.env.SHAREPOINTUSERNAME;
const SHAREPOINTPASSWORD = process.env.SHAREPOINTPASSWORD;
const SHAREQUESTPHRASE = process.env.SHAREQUESTPHRASE;
const SHARESPONSEPHRASE = process.env.SHARESPONSEPHRASE;
const ACCESSCODE = process.env.ACCESSCODE;
const MERCHANTIDENTIFIER = process.env.MERCHANTIDENTIFIER;
const TOKENIZATIONHOSTURL = process.env.TOKENIZATIONHOSTURL;
const PURCHASEHOSTURL = process.env.PURCHASEHOSTURL;
const { SPPull } = require("sppull");
const {
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
} = require("./appService");

const { isEmpty, setEmptyValue } = require("../utils/general");

const login = async (req, res) => {
  const { email, password } = req.body;
  const { response, token, error } = await signInRequest(email, password);

  if (response) {
    const {
      emailaddress1,
      contactid,
      fullname,
      ses_password,
      mobilephone,
    } = response;
    bcrypt.compare(password, ses_password, function (err, result) {
      console.log("password error ", err, result);
      if (result) {
        return res.status(200).json({
          emailaddress1,
          contactid,
          fullname,
          token,
          mobilephone,
        });
      }
      res.status(401).json({
        error: config.get("InvalidPassword"),
      });
    });
  } else if (error) {
    res.status(401).json({
      error: error,
    });
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const register = async (req, res) => {
  console.log("body", req.body);
  const { email, password, firstName, lastName } = req.body;
  var userName = firstName + " " + lastName;
  let hashPassword = await bcrypt.hash(password, 10);
  const payload = {
    fullname: userName,
    ses_password: hashPassword,
    emailaddress1: email,
    ses_createapplicant: true,
    yomifullname: userName,
    firstname: firstName,
    lastname: lastName,
  };
  const { response, token, error } = await signUpRequest(payload);
  if (response) {
    res.status(201).json({
      response,
      token,
    });
  } else if (error) {
    res.status(409).json({
      error: error,
    });
  } else {
    console.log("no error");
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const getContactById = async (req, res) => {
  const { response, error } = await getprofileData(
    req.headers["authorization"].split(" ")[1],
    req.params.contactId
  );
  if (response) {
    let conatcts = response[0];
    res.status(200).json(conatcts);
  } else if (error) {
    res.status(404).json({
      error: error,
    });
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const getApplicationData = async (req, res) => {
  const resultFromAPI = await getApplicationResult(
    req.headers["authorization"].split(" ")[1],
    req.params.contactId
  );

  const { error } = resultFromAPI;
  if (error) {
    return res.status(500).json({
      error: config.get("error"),
    });
  }
  let responseFromAPI = {};
  // console.log(
  //   "resultFromAPI[7].response",
  //   resultFromAPI[7],
  //   isEmpty(resultFromAPI[7])
  // );

  const firstName = resultFromAPI[0].response[0]["firstname"];
  const lastName = resultFromAPI[0].response[0]["lastname"];
  const applicant = resultFromAPI[1].response[0]["ses_applicant"];
  const applicantId = resultFromAPI[1].response[0]["ses_applicantid"];

  const FolderName = `${firstName} ${lastName}_${req.params.contactId.replace(
    /-/g,
    ""
  )}/ses_applicant/${applicant}_${applicantId.replace(/-/g, "")}`;

  console.log("folder name", FolderName);

  const contactsFields = [
    "firstname",
    "middlename",
    "lastname",
    "eslsca_arabicname",
    "gendercode",
    "governmentid",
    "birthdate",
    "ses_nationality",
    "eslsca_dualnationality",
    "emailaddress1",
    "emailaddress2",
    "mobilephone",
    "address1_line1",
    "address1_city",
    "eslsca_cairodistrictbusiness",
    "eslsca_cairodistrictresidential",
    "address1_country",
    "address1_postalcode",
    "address2_line1",
    "address2_city",
    "address2_country",
    "address2_postalcode",
  ];

  const applicantFields = [
    "ses_applicantid",
    "ses_applicant",
    "eslsca_applicationfee",
    "ses_admissionfeepaid",
    "ses_applicationfeepaiddate",
    "ses_birthcity",
    "ses_birthcountry",
    "_ses_certificationprogram_value",
    "eslsca_applicantsourceother",
    "eslsca_applicantsource",
    "_ses_track_value",
    "eslsca_transfer",
    "_eslsca_startingacademicyeargraduate_value",
    "_eslsca_startingacademicyearundergraduate_value",
    "eslsca_transferfacultyorprogram",
    "eslsca_startingsemesterundergraduate",
    "eslsca_startingsemestergraduate",
    "eslsca_semesternumberfortransfer",
    // "eslsca_firstattendanceschedulechoice",
    // "eslsca_secondattendanceschedulechoice",
    "_eslsca_firstattendancescheduleoption_value",
    "_eslsca_seconattendancescheduleoption_value",
    "eslsca_yearsofrelevantexperience",
    "_eslsca_campus_value",
    "eslsca_applyforfinancialaid",
    "eslsca_accepttermsanddonditions",
    "eslsca_esignature",
  ];
  const prevSchoolFields = [
    "ses_previousschool",
    "ses_city",
    "ses_schoolcontact",
    "ses_country",
    "ses_graduationyear",
    "eslsca_primaryteachinglanguage",
    "eslsca_schoolcertificate",
    "ses_certificateearned",
    "ses_major",
    "eslsca_businessdegree",
    "eslsca_gpa",
    "_ses_contactid_value",
  ];
  const prevEmpFields = [
    "ses_employer",
    "ses_previousemployment",
    "ses_startdate",
  ];

  const gurdFieldsKey = [
    "gurd_firstname",
    "gurd_middlename",
    "gurd_lastname",
    "gurd_birthdate",
    "gurd_ses_nationality",
    "gurd_address1_line1",
    "gurd_address1_city",
    "gurd_address1_country",
    "gurd_address1_postalcode",
    "gurd_emailaddress1",
    "gurd_mobilephone",
    "ses_relationship",
  ];

  const gurdFieldValue = [
    "firstname",
    "middlename",
    "lastname",
    "birthdate",
    "ses_nationality",
    "address1_line1",
    "address1_city",
    "address1_country",
    "address1_postalcode",
    "emailaddress1",
    "mobilephone",
    "ses_relationship",
  ];
  const financialAidFields = [
    "eslsca_scholarshiptype",
    "eslsca_otherscholarship",
    "eslsca_siblingateslsca",
    "eslsca_siblingname",
    "eslsca_siblinguniversityid",
  ];

  // console.log("resukt", resultFromAPI);
  if (
    (resultFromAPI[0].hasOwnProperty("response") &&
      resultFromAPI[0].response[0]) ||
    (resultFromAPI[1].hasOwnProperty("response") &&
      resultFromAPI[1].response[0]) ||
    (resultFromAPI[2].hasOwnProperty("response") &&
      resultFromAPI[2].response[0]) ||
    (resultFromAPI[3].hasOwnProperty("response") &&
      resultFromAPI[3].response[0])
  ) {
    contactsFields.forEach((field) => {
      responseFromAPI[field] = setEmptyValue(
        resultFromAPI[0].response[0][field]
      );
    });

    if (
      resultFromAPI[1] !== undefined &&
      !isEmpty(resultFromAPI[1]) &&
      resultFromAPI[1].response.length > 0
    ) {
      applicantFields.forEach((field) => {
        responseFromAPI[field] = setEmptyValue(
          resultFromAPI[1].response[0][field]
        );
      });
    }

    if (
      resultFromAPI[2] !== undefined &&
      !isEmpty(resultFromAPI[2]) &&
      resultFromAPI[2].response.length > 0
    ) {
      prevSchoolFields.forEach((field) => {
        responseFromAPI[field] = setEmptyValue(
          resultFromAPI[2].response[0][field]
        );
      });
    }

    if (
      resultFromAPI[3] !== undefined &&
      !isEmpty(resultFromAPI[3]) &&
      resultFromAPI[3].response.length > 0
    ) {
      prevEmpFields.forEach((field) => {
        responseFromAPI[field] = setEmptyValue(
          resultFromAPI[3].response[0][field]
        );
      });
    }
    if (
      resultFromAPI[4] !== undefined &&
      !isEmpty(resultFromAPI[4]) &&
      resultFromAPI[4].response.length > 0
    )
      responseFromAPI["programs"] = resultFromAPI[4].response;

    if (
      resultFromAPI[5] !== undefined &&
      !isEmpty(resultFromAPI[5]) &&
      resultFromAPI[5].response.length > 0
    )
      responseFromAPI["campuses"] = resultFromAPI[5].response;
    if (
      resultFromAPI[6] !== undefined &&
      !isEmpty(resultFromAPI[6]) &&
      resultFromAPI[6].response.length > 0
    )
      responseFromAPI["tracks"] = resultFromAPI[6].response;

    if (
      resultFromAPI[7] !== undefined &&
      !isEmpty(resultFromAPI[7]) &&
      !isEmpty(resultFromAPI[7])
    ) {
      gurdFieldsKey.forEach((field, index) => {
        responseFromAPI[field] = setEmptyValue(
          resultFromAPI[7][gurdFieldValue[index]]
        );
      });
    }
    if (
      resultFromAPI[8] !== undefined &&
      !isEmpty(resultFromAPI[8]) &&
      resultFromAPI[8].response.length > 0
    )
      responseFromAPI["academicyear"] = resultFromAPI[8].response;
    if (
      resultFromAPI[9] !== undefined &&
      !isEmpty(resultFromAPI[9]) &&
      resultFromAPI[9].response.length > 0
    )
      responseFromAPI["attendance"] = resultFromAPI[9].response;
    if (
      resultFromAPI[10] !== undefined &&
      !isEmpty(resultFromAPI[10]) &&
      resultFromAPI[10].response.length > 0
    )
      responseFromAPI["fileUploadsDetails"] = resultFromAPI[10].response;

    if (
      resultFromAPI[11] !== undefined &&
      !isEmpty(resultFromAPI[11]) &&
      resultFromAPI[11].response.length > 0
    ) {
      financialAidFields.forEach((field) => {
        responseFromAPI[field] = setEmptyValue(
          resultFromAPI[11].response[0][field]
        );
      });
    }

    try {
      const context = {
        siteUrl: SHAREPOINTSITEURL,
        creds: {
          username: SHAREPOINTUSERNAME,
          password: SHAREPOINTPASSWORD,
        },
      };

      const options = {
        spRootFolder: `contact/${FolderName}`,
        dlRootFolder: "./uploads",
      };
      SPPull.download(context, options)
        .then((downloadResults) => {
          responseFromAPI.files = downloadResults.map((element) => {
            return {
              name: element.Name,
              url: element.ServerRelativeUrl,
            };
          });
          res.status(200).json(responseFromAPI);
        })
        .catch((err) => {
          console.log("Core error has happened", err);
          res.status(200).json(responseFromAPI);
        });
    } catch (ex) {
      console.log("error in sharepoint ", ex);
    }
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const setContacts = async (req, res) => {
  const { response, error } = await updateContactData(
    req.headers["authorization"].split(" ")[1],
    req.body
  );

  if (response) {
    res.status(201).json({
      response,
      message: "Data Updated",
    });
  } else if (error) {
    res.status(400).json({
      error: error,
    });
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const updateAplicationData = async (req, res) => {
  const { response, error } = await updateApplicationResult(
    req.headers["authorization"].split(" ")[1],
    req.body
  );
  if (response) {
    res.status(200).json({
      message: config.get("ApplicationDataUpdate"),
      responseCode: response.code || 200,
    });
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const getClassDetails = async (req, res) => {
  const { response, error } = await fetchClassDetails(
    req.headers["authorization"].split(" ")[1],
    req.params.contactId
  );

  if (response) {
    res.status(200).json({ data: response });
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const getClassTerms = async (req, res) => {
  const { response, error } = await queryClassTermDetails(
    req.headers["authorization"].split(" ")[1]
  );

  if (response) {
    res.status(200).json({ data: response });
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};
const updateClassParams = async (req, res) => {
  const { response, error } = await updateClassData(
    req.headers["authorization"].split(" ")[1],
    req.body.sessionId
  );

  if (response) {
    res.status(200).json({ message: response });
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const getSelectClassDetails = async (req, res) => {
  const { response, error } = await fetchSelectClassData(
    req.headers["authorization"].split(" ")[1],
    req.query.studentType
  );
  if (response) {
    res.status(200).json({ data: response });
  } else {
    res.status(500).json({
      error: error,
    });
  }
};

const fileUploadToSharePoint = async (req, res) => {
  var coreOptions = {
    siteUrl: SHAREPOINTSITEURL,
    notification: true,
    checkin: true,
    checkinType: 1,
  };
  var creds = {
    username: SHAREPOINTUSERNAME,
    password: SHAREPOINTPASSWORD,
    // domain: "[domain (on premise)]",
  };

  var folderName = JSON.parse(req.body.folderName);
  console.log("folderName", folderName);
  Promise.all(
    req.files.map(async (element) => {
      var fileOptions = {
        folder: `contact/${folderName}`,
        fileName: element.originalname,
        fileContent: element.buffer,
      };

      await fileUploadHandler(coreOptions, creds, fileOptions);
    })
  )
    .then((result) => {
      return res.status(200).json({ message: "File Uploaded" });
    })
    .catch((error) => {
      return res.status(500).json({
        error: config.get("error"),
      });
    });
};

const fileUploadHandler = (coreOptions, creds, fileOptions) => {
  return spsave(coreOptions, creds, fileOptions)
    .then(function () {
      // console.log("saved");
      return { message: "File uploaded" };
    })
    .catch(function (err) {
      // console.log("Error in uploading", err);
      return { error: "something went wrong" };
    });
};

const generatehash256SignatureForTokenization = (
  access_code,
  merchant_identifier,
  merchant_reference,
  return_url
) => {
  const message = `${SHAREQUESTPHRASE}access_code=${access_code}language=enmerchant_identifier=${merchant_identifier}merchant_reference=${merchant_reference}return_url=${return_url}service_command=TOKENIZATION${SHAREQUESTPHRASE}`;
  return sha256(message);
};
const generatehash256SignatureForTokenizationResponse = (
  response_code,
  card_number,
  merchant_identifier,
  expiry_date,
  access_code,
  response_message,
  merchant_reference,
  token_name,
  return_url,
  card_bin,
  status
) => {
  const message = `${SHARESPONSEPHRASE}access_code=${access_code}card_bin=${card_bin}card_number=${card_number}expiry_date=${expiry_date}language=enmerchant_identifier=${merchant_identifier}merchant_reference=${merchant_reference}response_code=${response_code}response_message=${response_message}return_url=${return_url}service_command=TOKENIZATIONstatus=${status}token_name=${token_name}${SHARESPONSEPHRASE}`;
  return sha256(message);
};
const generatehash256SignatureForPurchase = (
  access_code,
  amount,
  command,
  currency,
  customer_email,
  customer_ip,
  merchant_identifier,
  merchant_reference,
  return_url,
  token_name
) => {
  const message = `${SHAREQUESTPHRASE}access_code=${access_code}amount=${amount}command=${command}currency=${currency}customer_email=${customer_email}customer_ip=${customer_ip}language=enmerchant_identifier=${merchant_identifier}merchant_reference=${merchant_reference}return_url=${return_url}token_name=${token_name}${SHAREQUESTPHRASE}`;
  return sha256(message);
};
const generatehash256SignatureForPurchaseResponse = (
  amount,
  response_code,
  card_number,
  card_holder_name,
  merchant_identifier,
  access_code,
  order_description,
  payment_option,
  expiry_date,
  customer_ip,
  eci,
  fort_id,
  command,
  merchant_extra,
  response_message,
  merchant_reference,
  authorization_code,
  customer_email,
  currency,
  status
) => {
  const message = `${SHARESPONSEPHRASE}access_code=${access_code}amount=${amount}authorization_code=${authorization_code}card_holder_name=${card_holder_name}card_number=${card_number}command=${command}currency=${currency}customer_email=${customer_email}customer_ip=${customer_ip}eci=${eci}expiry_date=${expiry_date}fort_id=${fort_id}language=enmerchant_extra=${merchant_extra}merchant_identifier=${merchant_identifier}merchant_reference=${merchant_reference}order_description=${order_description}payment_option=${payment_option}response_code=${response_code}response_message=${response_message}status=${status}${SHARESPONSEPHRASE}`;
  return sha256(message);
};
const generatehash256SignatureForPurchaseResponseWithToken = (
  amount,
  response_code,
  card_number,
  card_holder_name,
  merchant_identifier,
  access_code,
  order_description,
  payment_option,
  expiry_date,
  customer_ip,
  eci,
  fort_id,
  command,
  merchant_extra,
  response_message,
  merchant_reference,
  authorization_code,
  customer_email,
  currency,
  status,
  token_name
) => {
  const message = `${SHARESPONSEPHRASE}access_code=${access_code}amount=${amount}authorization_code=${authorization_code}card_holder_name=${card_holder_name}card_number=${card_number}command=${command}currency=${currency}customer_email=${customer_email}customer_ip=${customer_ip}eci=${eci}expiry_date=${expiry_date}fort_id=${fort_id}language=enmerchant_extra=${merchant_extra}merchant_identifier=${merchant_identifier}merchant_reference=${merchant_reference}order_description=${order_description}payment_option=${payment_option}response_code=${response_code}response_message=${response_message}status=${status}token_name=${token_name}${SHARESPONSEPHRASE}`;
  return sha256(message);
};

const paymentRequest = async (req, res) => {
  console.log("payment request came", req.body);
  applicant_id = req.body.ses_applicantid;
  const {
    cvc,
    expiry,
    name,
    number,
    merchantReference,
    amount,
    emailaddress1,
    ipAddress,
  } = req.body;
  const host = req.get("host");
  const hostUrl = `${req.protocol}://${host}/api/payment/response`;
  const tokenizationSignatureRequest = generatehash256SignatureForTokenization(
    ACCESSCODE,
    MERCHANTIDENTIFIER,
    req.body.merchantReference,
    hostUrl
  );

  try {
    const tokenizationResponse = await axios.post(
      TOKENIZATIONHOSTURL,
      querystring.stringify({
        merchant_identifier: MERCHANTIDENTIFIER,
        access_code: ACCESSCODE,
        expiry_date: expiry,
        card_number: number,
        card_security_code: cvc,
        language: "en",
        service_command: "TOKENIZATION",
        merchant_reference: merchantReference,
        signature: tokenizationSignatureRequest,
        return_url: hostUrl,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // console.log("token response", tokenizationResponse.data);

    let responseCode = tokenizationResponse.data.split("returnUrlParams")[1];
    responseCode = responseCode.split("</script>")[0];
    let tokenRes = JSON.parse(responseCode.split("=")[1].split(";")[0]);
    // console.log("tokenization response", tokenRes);
    let {
      response_code,
      card_number,
      merchant_identifier,
      expiry_date,
      access_code,
      language,
      signature,
      service_command,
      response_message,
      merchant_reference,
      token_name,
      return_url,
      card_bin,
      status,
    } = tokenRes;
    const tokenizationGenSignature = generatehash256SignatureForTokenizationResponse(
      response_code,
      card_number,
      merchant_identifier,
      expiry_date,
      access_code,
      response_message,
      merchant_reference,
      token_name,
      return_url,
      card_bin,
      status
    );
    if (tokenizationGenSignature === signature && response_code === "18000") {
      const responseToken = token_name;
      // console.log("token is -", responseToken);
      const purchaseSignature = generatehash256SignatureForPurchase(
        ACCESSCODE,
        amount,
        "PURCHASE",
        "EGP",
        emailaddress1,
        ipAddress,
        MERCHANTIDENTIFIER,
        merchantReference,
        `${req.protocol}://${host}/api/payment/purchase/response`,
        responseToken
      );
      const paymentParmas = {
        command: "PURCHASE",
        access_code: ACCESSCODE,
        merchant_identifier: MERCHANTIDENTIFIER,
        merchant_reference: merchantReference,
        amount: amount,
        currency: "EGP",
        language: "en",
        customer_email: emailaddress1,
        customer_ip: ipAddress,
        token_name: responseToken,
        signature: purchaseSignature,
        return_url: `${req.protocol}://${host}/api/payment/purchase/response`,
      };

      const paymentRequest = await axios.post(PURCHASEHOSTURL, paymentParmas);
      // console.log("payment response", paymentRequest.data);
      res.status(200).json(paymentRequest.data);
    } else {
      res.status(200).json({
        message: "Something Went Wrong",
        requestParams: {
          merchant_identifier: MERCHANTIDENTIFIER,
          access_code: ACCESSCODE,
          expiry_date: expiry,
          card_number: number,
          card_security_code: cvc,
          language: "en",
          service_command: "TOKENIZATION",
          merchant_reference: merchantReference,
          signature: signature,
          return_url: hostUrl,
        },
        response: tokenizationResponse.data,
      });
    }
  } catch (error) {
    console.log("error in tokenization", error);
    res.status(500).json({
      message: "Something Went Wrong",
    });
  }
};

const paymentResponse = (req, res) => {
  // console.log("response", req._parsedUrl._raw);
  res.send(req._parsedUrl._raw);
};

const paymentPurchase = async (req, res) => {
  console.log("res", req.body);
  let {
    amount,
    response_code,
    card_number,
    card_holder_name,
    signature,
    merchant_identifier,
    access_code,
    order_description,
    payment_option,
    expiry_date,
    customer_ip,
    eci,
    fort_id,
    command,
    merchant_extra,
    response_message,
    merchant_reference,
    authorization_code,
    customer_email,
    currency,
    status,
  } = req.body;
  let genSignature = "";

  if (req.body.hasOwnProperty("token_name")) {
    genSignature = generatehash256SignatureForPurchaseResponseWithToken(
      amount,
      response_code,
      card_number,
      card_holder_name,
      merchant_identifier,
      access_code,
      order_description,
      payment_option,
      expiry_date,
      customer_ip,
      eci,
      fort_id,
      command,
      merchant_extra,
      response_message,
      merchant_reference,
      authorization_code,
      customer_email,
      currency,
      status,
      req.body.token_name
    );
  } else {
    genSignature = generatehash256SignatureForPurchaseResponse(
      amount,
      response_code,
      card_number,
      card_holder_name,
      merchant_identifier,
      access_code,
      order_description,
      payment_option,
      expiry_date,
      customer_ip,
      eci,
      fort_id,
      command,
      merchant_extra,
      response_message,
      merchant_reference,
      authorization_code,
      customer_email,
      currency,
      status
    );
  }

  // console.log("merchant_extra", merchant_extra, signature, genSignature);
  if (genSignature === signature && response_code === "14000") {
    const { response, error } = await updateApplicantPaymentFields(
      merchant_extra
    );

    if (response) {
      res.render("index", {
        host: process.env.HOST,
      });
    } else {
      res.render("index", {
        host: process.env.HOST,
      });
    }
  } else {
    res.render("error", {
      host: process.env.HOST,
    });
  }
};

const ApplicantPaymentUpdateToDatebase = async (req, res) => {
  const { response, error } = await updateApplicantPaymentFields(
    req.params.applicant_id
  );

  if (response) {
    res.status(201).json({
      message: "Payment Completed",
      code: 701,
    });
  } else {
    res.status(200).json({
      message: "Payment Failed",
      code: 901,
    });
  }
};

const getApplicationTestDetails = async (req, res) => {
  const applicatantDetails = await getApplicationDetailsByContactId(
    req.headers["authorization"].split(" ")[1],
    req.params.contactId
  );

  const { error } = applicatantDetails;
  if (error) {
    return res.status(500).json({
      error: config.get("error"),
    });
  }
  let responseFromAPI = {};
  const ApplicationTestFields = [
    "ses_applicantid",
    "eslsca_eattype",
    "eslsca_eatscheduleddateandtime",
  ];

  // console.log(applicatantDetails.response.response[0]);
  if (
    applicatantDetails.response.response[0] !== undefined &&
    !isEmpty(applicatantDetails.response.response[0])
  ) {
    ApplicationTestFields.forEach((field, index) => {
      responseFromAPI[field] = setEmptyValue(
        applicatantDetails.response.response[0][ApplicationTestFields[index]]
      );
    });
  }
  // console.log(applicatantDetails);
  responseFromAPI.slots = applicatantDetails.response.slots;

  res.status(200).json(responseFromAPI);
};

const saveApplicationTestDetails = async (req, res) => {
  const result = await saveApplicationDetailsByContactId(
    req.headers["authorization"].split(" ")[1],
    req.body
  );

  try {
    const { response } = result;
    return res.status(201).json({ message: response });
  } catch (err) {
    return res.status(500).json({
      error: config.get("error"),
    });
  }
};

const saveApplicationTestOnline = async (req, res) => {
  const result = await saveApplicationOnlineDetails(
    req.headers["authorization"].split(" ")[1],
    req.body
  );

  const { error } = result;
  if (error) {
    return res.status(500).json({
      error: config.get("error"),
    });
  }

  try {
    const { response } = result;
    return res.status(201).json({ message: response });
  } catch (err) {
    return res.status(500).json({
      error: config.get("error"),
    });
  }
};

const getFiles = async (req, res) => {
  try {
    const context = {
      siteUrl: SHAREPOINTSITEURL,
      creds: {
        username: SHAREPOINTUSERNAME,
        password: SHAREPOINTPASSWORD,
      },
    };
    const folderName =
      "Mini Kaur_3005e97e7f24eb11a813000d3a654128/ses_applicant/APP-00001312_3805e97e7f24eb11a813000d3a654128";
    const options = {
      spRootFolder: `contact/${folderName}`,
      dlRootFolder: "./uploads",
      recursive: false,
    };
    SPPull.download(context, options)
      .then((downloadResults) => {
        // console.log("Files are downloaded");
        // console.log(
        //   "For more, please check the results",
        //   JSON.stringify(downloadResults)
        // );
        res.status(201).json({
          message: "got files",
          path: downloadResults,
        });
      })
      .catch((err) => {
        console.log("Core error has happened", err);
      });
  } catch (ex) {}
};

const getInterviewSlotsAvailable = async (req, res) => {
  const { response, error } = await getInterviewSlots(
    req.headers["authorization"].split(" ")[1]
  );
  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const saveInterviewSlotsAvailable = async (req, res) => {
  const { response } = await saveInterviewSlots(
    req.headers["authorization"].split(" ")[1],
    req.body
  );

  if (response) {
    res.status(200).json({ message: "Interview Slot Saved" });
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const getpplicationFeeOfApplicant = async (req, res) => {
  const { response } = await getApplicantFee(
    req.headers["authorization"].split(" ")[1],
    req.body
  );
  // console.log("response", response);
  if (response) {
    res
      .status(200)
      .json({ eslsca_applicationfee: response.eslsca_applicationfee });
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

const applicantStatus = async (req, res) => {
  const { response } = await getApplicantStatus(
    req.headers["authorization"].split(" ")[1],
    req.params.contactId
  );

  if (response) {
    // console.log("response", response);
    res.status(200).json({ ses_applicantstatus: response });
  } else {
    res.status(500).json({
      error: config.get("error"),
    });
  }
};

function generateHash(hashSecret, postData) {
  //sort input param
  var orderedData = {};
  Object.keys(postData)
    .sort()
    .forEach(function (key) {
      orderedData[key] = postData[key];
    });

  //format uri encoding of param Object
  var message = "";
  for (var i in orderedData) {
    message += "&" + i + "=" + orderedData[i];
  }
  message = message.substr(1);

  //generate the secure hash
  var cr = require("crypto");
  var Buffer = require("buffer").Buffer;
  var privateKey = new Buffer.from(hashSecret, "hex", "ascii");

  var hash = cr.createHmac("sha256", privateKey).update(message).digest("hex");

  return hash;
}

const handleVapulusPaymentRequest = async (req, response) => {
  console.log("req.body", req.body);
  let {
    username,
    cardNumber,
    month,
    year,
    cvv,
    mobile,
    email,
    amount,
  } = req.body;

  var postData = {
    cardNum: cardNumber,
    cardExp: `${year}${month}`,
    cardCVC: cvv,
    holderName: username,
    mobileNumber: mobile,
    email: email,
    amount: amount,
    onAccept: `https://frontendoneworld.azurewebsites.net/payment`,
    onFail: `https://frontendoneworld.azurewebsites.net/payment`,
  };
  //your hash secret from app you create on app.vapulus.com/business
  var hashKey = process.env.VAPULUSHASHKEY;
  postData.hashSecret = vapulusHash.generateHash(hashKey, postData);
  postData.appId = process.env.VAPULUSAPPID;
  postData.password = process.env.VAPULUSAPPPASSWORD;

  try {
    axios
      .post(process.env.VAPULUSTXNURL, postData)
      .then((res) => {
        console.log("response", res.data);
        if (
          res.data.hasOwnProperty("data") &&
          res.data.data.hasOwnProperty("htmlBodyContent")
        ) {
          const body = res.data.data.htmlBodyContent;
          response.writeHead(200, { "content-type": "text/html" });
          response.end(body);
        } else {
          if (
            res.data.statusCode === 200 &&
            res.data.data.status === "accepted"
          ) {
            response.render("txnProcessed", {
              host: process.env.HOST,
            });
          } else {
            response.send(res.data);
          }
        }
      })
      .catch((err) => {
        console.log("error", err);
        response.writeHead(500, { "content-type": "text/plain" });
        response.end("Internal Server Error");
      });
  } catch (ex) {
    res.send(ex);
  }
};

const testSignature = (req, res) => {
  res.send(
    generatehash256SignatureForTokenizationResponse(
      "18000",
      "400555******0001",
      "ouWmOQdP",
      "2105",
      "BVAqsy3vJF3OoTNMQMjU",
      "Success",
      "APP-00001479-59",
      "da70f172941545eebca6a75dab7fb19a",
      "http://localhost:3001/api/payment/response",
      "400555",
      "18"
    )
  );
};

const payCalled = (e) => {
  console.log("called123", e);
};

const handelPaymentRequest = (req, res) => {
  // const { amount, mobile, email, token } = req.body;
  const mobile = req.query.mobile;
  const email = req.query.email;
  const amount = req.query.amount;
  const host = req.get("host");
  const protocol = req.protocol;
  res.render("payment", {
    amount,
    mobile: mobile.split("-")[1],
    email,
    host,
    protocol,
  });
};

const getTxnDetails = (req, res) => {
  const txnId = req.params.txnId;
  var hashKey = process.env.VAPULUSHASHKEY;
  var postData = {
    transactionId: txnId,
  };
  postData.hashSecret = vapulusHash.generateHash(hashKey, postData);
  postData.appId = process.env.VAPULUSAPPID;
  postData.password = process.env.VAPULUSAPPPASSWORD;

  try {
    axios
      .post("https://api.vapulus.com:1338/app/transactionInfo", postData)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((err) => {
        res.status(500).json({
          error: config.get("error"),
        });
      });
  } catch (ex) {
    res.send(ex);
  }
};

module.exports = {
  login,
  register,
  getContactById,
  setContacts,
  getApplicationData,
  updateAplicationData,
  getClassDetails,
  getClassTerms,
  updateClassParams,
  getSelectClassDetails,
  fileUploadToSharePoint,
  paymentRequest,
  getApplicationTestDetails,
  saveApplicationTestDetails,
  saveApplicationTestOnline,
  getFiles,
  getInterviewSlotsAvailable,
  saveInterviewSlotsAvailable,
  paymentResponse,
  paymentPurchase,
  getpplicationFeeOfApplicant,
  applicantStatus,
  handleVapulusPaymentRequest,
  ApplicantPaymentUpdateToDatebase,
  testSignature,
  handelPaymentRequest,
  getTxnDetails,
};
