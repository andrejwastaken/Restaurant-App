import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import api from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProfileMenu from "../../components/ProfileMenu";
import ProfileDataContext from "../../contexts/ProfileDataContext";
import Loading from "../../components/Loading";
import ModalShell from "../../components/ModalShell";
import ProfileEditUsername from "../../components/ProfileEditUsername";
import ProfileEditEmail from "../../components/ProfileEditEmail";
import ProfileEditPhoneNumber from "../../components/ProfileEditPhoneNumber";
import ProfileEditPassword from "../../components/ProfileEditPassword";

const MODAL_CONFIG = {
  EDIT_USERNAME: {
    Component: ProfileEditUsername,
    title: "Change Username",
  },
  EDIT_EMAIL: {
    Component: ProfileEditEmail,
    title: "Change Email Address",
  },
  EDIT_PHONE_NUMBER: {
    Component: ProfileEditPhoneNumber,
    title: "Change Phone Number",
  },
  EDIT_PASSWORD: {
    Component: ProfileEditPassword,
    title: "Change Password",
  },
};

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [initialDataForModal, setInitialDataForModal] = useState(null);
  const [isLoadingDuringSubmit, setIsLoadingDuringSubmit] = useState(false);
  const [addRestaurantData, setAddRestaurantData] = useState({
    basicInformation: {
      name: "",
      description: "",
    },
    tableInformation: [],
    timeslotInformation: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  });

  useEffect(() => {
    setIsLoading(true);

    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/user/update/");
        if (response.status === 200) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // MODAL SAVING LOGIC
  const openModal = (modalType, data) => {
    if (MODAL_CONFIG[modalType]) {
      setActiveModal(modalType);
      setInitialDataForModal(data);
    } else {
      console.log("Error");
    }
  };

  const handleSave = async (updatedData) => {
    // Samo Password
    if (activeModal === "EDIT_PASSWORD") {
      setIsLoadingDuringSubmit(true);
      closeModal();
      try {
        const response = await api.put("/api/user/update/", updatedData);

        if (response.status === 200) {
          toast.success("Password updated successfully!");
        } else {
          throw new Error("Failed to update password.");
        }
      } catch (error) {
        console.error("Password update failed:", error);
        toast.error("There was a problem changing your password.");
      } finally {
        setIsLoadingDuringSubmit(false);
      }
      return;
    }

    const finalUserData = { ...userData, ...updatedData };

    setIsLoadingDuringSubmit(true);
    closeModal();

    const fieldKey = Object.keys(updatedData)[0];

    if (userData[fieldKey] === updatedData[fieldKey]) {
      toast.error("No changes to your information has been made.");
      setIsLoadingDuringSubmit(false);
      return;
    }

    if (updatedData[fieldKey].trim().length === 0) {
      toast.error("Personal information must be included.");
      setIsLoadingDuringSubmit(false);
      return;
    }

    try {
      const response = await api.put("/api/user/update/", finalUserData);

      if (response.status === 200) {
        setUserData(finalUserData);
        toast.success("Successfully updated your information.");
      } else {
        throw new Error("Failed to update user profile on the server.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("There was a problem saving your changes.");
    } finally {
      setIsLoadingDuringSubmit(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setInitialDataForModal(null);
  };

  //ADD RESTAURANT SAVING LOGIC
  function handleSaveAddRestaurantItem(updatedData) {
    const finalAddRestaurantData = { ...addRestaurantData, ...updatedData };
    setAddRestaurantData(finalAddRestaurantData);
  }

  const profileContextValue = {
    user: userData,
    openModal: openModal,
    isLoadingDuringSubmit: isLoadingDuringSubmit,
    addRestaurantData: addRestaurantData,
    handleSaveAddRestaurantItem: handleSaveAddRestaurantItem,
  };

  const CurrentModal = activeModal ? MODAL_CONFIG[activeModal] : null;

  return (
    // Koristi context, site children vo ova (glavno profileMenu) ke imaat pristap. Namesto prop drill poradi Outlet
    <ProfileDataContext.Provider value={profileContextValue}>
      <div className="bg-gray-100 flex flex-col min-h-screen">
        <Navbar />
        {isLoading ? (
          <Loading>Loading your profile...</Loading>
        ) : (
          <div className="flex-grow">
            <ProfileMenu />
          </div>
        )}
        <Footer />

        {CurrentModal && (
          <ModalShell title={CurrentModal.title} onClose={closeModal}>
            <CurrentModal.Component
              initialData={initialDataForModal}
              onSubmit={handleSave}
            />
          </ModalShell>
        )}
      </div>
    </ProfileDataContext.Provider>
  );
};

export default ProfilePage;
