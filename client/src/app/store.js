import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "reduxSlices/loginSlice";
import registerReducer from "reduxSlices/registerSlice";
import classReducer from "reduxSlices/classesSlice";
import profileReducer from "reduxSlices/profileSlice";
import applicationReducer from "reduxSlices/applicationSlice";
import selectClassReducer from "reduxSlices/selectClassSlice";

export default configureStore({
  reducer: {
    loginRequest: loginReducer,
    resgisterRequest: registerReducer,
    classData: classReducer,
    profileData: profileReducer,
    applicationData: applicationReducer,
    selectClassData: selectClassReducer,
  },
});
