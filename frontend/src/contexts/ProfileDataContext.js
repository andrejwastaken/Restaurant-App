import { createContext, useContext } from "react";

const ProfileDataContext = createContext(null);

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);

  if (context === undefined) {
    throw new Error("Context fail");
  }
  return context;
};

export default ProfileDataContext;
