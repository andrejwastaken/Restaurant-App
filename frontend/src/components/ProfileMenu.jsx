import { useState } from "react";

import ProfileMenuContent from "./ProfileMenuContent";
import ProfileMenuSideBar from "./ProfileMenuSideBar";

function ProfileMenu() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 mb-5">
      <div className="flex flex-col md:flex-row gap-y-4 md:gap-y-0 md:gap-x-6">
        <div className="w-1/4">
          <ProfileMenuSideBar />
        </div>

        <div className="w-full md:flex-1">
          <ProfileMenuContent />
        </div>
      </div>
    </div>
  );
}

export default ProfileMenu;
