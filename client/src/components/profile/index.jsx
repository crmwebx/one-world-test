import React from "react";
import TopItems from "components/profile/profileTopItems";
import ProfileForms from "components/profile/profileForms";
import Aux from "hoc/Auxilliary";

const ProfilePage = (props) => {
  return (
    <Aux>
      <TopItems {...props} />
      <ProfileForms />
    </Aux>
  );
};

export default ProfilePage;
