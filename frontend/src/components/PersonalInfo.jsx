import { useProfileData } from "../contexts/ProfileDataContext";

import PersonalInfoLabel from "./PersonalInfoLabel";
import ProfileMenuContentTitle from "./ProfileMenuContentTitle";

function PersonalInfo() {
  const { user, openModal } = useProfileData();

  return (
    <div className="w-full h-full p-6">
      <div className="w-full h-full flex flex-col justify-between">
        <div>
          <ProfileMenuContentTitle label="Personal Information" />

          <div className="mt-10">
            <PersonalInfoLabel
              label="Username"
              content={user.username}
              handleClick={() =>
                openModal("EDIT_USERNAME", { username: user.username })
              }
            />
            <PersonalInfoLabel
              label="Email"
              content={user.email}
              handleClick={() => openModal("EDIT_EMAIL", { email: user.email })}
            />
            <PersonalInfoLabel
              label="Phone number"
              content={user.phone_number}
              handleClick={() =>
                openModal("EDIT_PHONE_NUMBER", {
                  phone_number: user.phone_number,
                })
              }
            />
          </div>
        </div>

        <button
          onClick={() => openModal("EDIT_PASSWORD", { password: "" })}
          form="modal-form"
          className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

export default PersonalInfo;
