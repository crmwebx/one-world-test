const fields = {
  personalInformation: {
    firstname: "First Name",
    lastname: "Last Name",
    eslsca_arabicname: "Arabic Name",
    gendercode: "Gender",
    birthdate: "Date of Birth",
    ses_nationality: "Nationality",
    _ses_certificationprogram_value: "Program",
    ses_birthcountry: "Country of Birth",
    // ses_birthcity: "City of Birth",
  },
  contact: {
    emailaddress1: "Email Address",
    mobilephone: "Mobile Phone",
    address1_line1: "Street Address",
    address1_city: "City",
    address1_country: "Country",
  },
  guardian: {
    gurd_firstname: "First Name",
    gurd_lastname: "Last Name",
    gurd_birthdate: "Date of Birth",
    gurd_ses_nationality: "Nationality",
    gurd_address1_line1: "Street",
    gurd_address1_city: "City",
    gurd_address1_country: "Country",
    gurd_emailaddress1: "Email",
    ses_relationship: "Relationship with Legal Guardian",
    gurd_mobilephone: "Mobile Phone Number",
  },
  underGraduate: {
    ses_previousschool: "Secondary School",
    // ses_city: "City",
    ses_country: "Country",
    ses_graduationyear: "Graduation Year",
    ses_schoolcontact: "Faculty",
    eslsca_primaryteachinglanguage: "Primary Language",
    _ses_track_value: "Preferred Major",
    _eslsca_startingacademicyearundergraduate_value: "Academic Year",
    eslsca_startingsemesterundergraduate: "Academic Semester",
    eslsca_schoolcertificate: "Secondary School Certificate",
  },
  Graduate: {
    ses_previousschool: "University",
    // ses_city: "City",
    ses_country: "Country",
    ses_graduationyear: "Graduation Year",
    ses_schoolcontact: "Faculty",
    // eslsca_primaryteachinglanguage: "Primary Language",
    _eslsca_startingacademicyeargraduate_value: "Academic Year",
    eslsca_startingsemestergraduate: "Academic Semester",
    // eslsca_schoolcertificate: "Secondary School Certificate",
    _eslsca_firstattendancescheduleoption_value:
      "First Attendance Schedule Choice",
    _eslsca_seconattendancescheduleoption_value:
      "Second Attendance Schedule Choice",
    _eslsca_campus_value: "Campus",
    // ses_major: "Major",
    eslsca_businessdegree: "Business Degree",
    eslsca_gpa: "GPA",
    // _ses_track_value: "Faculty",
    ses_employer: "Company Name",
    ses_startdate: "Hiring Date",
    eslsca_yearsofrelevantexperience: "Total Years of Relevant Experience",
  },
  fileUploadGraduate: {},
  fileUploadUnderGraduate: {},
  agreeSign: {
    eslsca_accepttermsanddonditions: "Select Application Terms and Conditions",
  },
  financialAid: {
    // eslsca_applyforfinancialaid: "Apply for Financial Aid",
  },
};

export default fields;
