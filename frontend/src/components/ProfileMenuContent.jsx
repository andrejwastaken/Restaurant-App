import { Outlet } from "react-router-dom";
import { useProfileData } from "../contexts/ProfileDataContext";
import Loading from "./Loading";

function ProfileMenuContent() {
  const { isLoadingDuringSubmit } = useProfileData();

  return (
    <div className="bg-white w-full h-full shadow-md">
      {isLoadingDuringSubmit ? (
        <div className="flex items-center justify-center h-full">
          <Loading>Updating...</Loading>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default ProfileMenuContent;
