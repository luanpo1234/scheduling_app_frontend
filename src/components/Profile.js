import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  //console.log(user.sub);
  return (
    isAuthenticated && (
      <div className="profile-container">
        <p>Logado como: <strong>{user.name}</strong></p>
      </div>
    )
  );
};

export default Profile;