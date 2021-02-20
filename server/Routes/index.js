const { Router } = require("express");
const express = require("express");
const route = express.Router();
const appController = require("../controllers");
const appValidation = require("../middlewares");

const fileHandlingMiddleWare = require("../middlewares/fileHandling");

route.post(
  "/application/fileUpload/",
  fileHandlingMiddleWare.fileUpload.array("files", 9),
  appController.fileUploadToSharePoint
);

route.post("/login", appValidation.validateLogin, appController.login);
route.post("/register", appValidation.validateReg, appController.register);
route.get(
  "/profile/getContacts/:contactId",
  appValidation.validateContact,
  appController.getContactById
);
route.post(
  "/profile/setContacts",
  appValidation.validateContactSave,
  appController.setContacts
);

route.get(
  "/application/getContacts/:contactId",
  appValidation.validateContact,
  appController.getApplicationData
);
route.post(
  "/application/setContacts",
  appValidation.validateContactSave,
  appController.updateAplicationData
);
route.post(
  "/class/update",
  appValidation.validateToken,
  appController.updateClassParams
);
route.get(
  "/class/classes/getTerms",
  appValidation.validateToken,
  appController.getClassTerms
);

route.get(
  "/class/classes/:contactId",
  appValidation.validateClassDetails,
  appController.getClassDetails
);
route.get(
  "/students/select-class",
  appValidation.validateToken,
  appController.getSelectClassDetails
);
route.post(
  "/students/select-class/payment-request",
  // appValidation.validateToken,
  appController.paymentRequest
);
route.post(
  "/payment/response",
  // appValidation.validateToken,
  appController.paymentResponse
);
route.post(
  "/payment/purchase/response",
  // appValidation.validateToken,
  appController.paymentPurchase
);
route.get(
  "/payment/",
  // appValidation.validateToken,
  appController.handelPaymentRequest
);
route.get(
  "/payment/applicantUpdate/:applicant_id",
  appController.ApplicantPaymentUpdateToDatebase
);
route.get(
  "/application/applicationTest/:contactId",
  appValidation.validateContact,
  appController.getApplicationTestDetails
);
route.post(
  "/application/applicationTest/",
  // appValidation.validateContactSave,
  appController.saveApplicationTestDetails
);

route.post(
  "/application/applicationTestOnline/",
  appController.saveApplicationTestOnline
);

route.get("/application/getUploadedFIle/", appController.getFiles);

route.get(
  "/application/interviewSlotAvailable/",
  appValidation.validateToken,
  appController.getInterviewSlotsAvailable
);
route.post(
  "/application/interviewSlotAvailable/",
  appValidation.validateToken,
  appController.saveInterviewSlotsAvailable
);

route.post(
  "/application/getApplicationFeeDetails/",
  appValidation.validateToken,
  appController.getpplicationFeeOfApplicant
);
route.get(
  "/application/getApplicantStatus/:contactId",
  appValidation.validateToken,
  appController.applicantStatus
);

route.post(
  "/application/payment-request/vapulus",
  //appValidation.validateToken,
  appController.handleVapulusPaymentRequest
);
route.get(
  "/application/payment-request/vapulus/:txnId",
  appValidation.validateToken,
  appController.getTxnDetails
);

route.get("/test", appController.testSignature);

module.exports = route;
