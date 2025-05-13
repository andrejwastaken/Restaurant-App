import { useState, useEffect } from "react";
import Profile from "../assets/profile.svg";
import api from "../api/api";
import PasswordInput from "../components/PasswordInput";

const ProfilePage = () => {
  const [selectedPanel, setSelectedPanel] = useState("userInfo");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/user/update/");
        if (response.status === 200) {
          const { username } = response.data;
          setUsername(username);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleUserUpdate = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const data = {
        username,
        password,
      };

      const response = await api.put("/api/user/update/", data);
      if (response.status === 200) {
        setMessage("Profile updated successfully.");
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Password is too weak. Use at least 8 characters, including uppercase, lowercase, numbers, and special characters."
      );
    }
  };

  const renderPanelContent = () => {
    switch (selectedPanel) {
      case "userInfo":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Update Your Information</h2>
            <h2 className="text-lg font-semibold text-center">Username</h2>
            <input
              type="text"
              placeholder="New Username"
              className="w-full box-border rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <h2 className="text-lg font-semibold text-center">Password</h2>
            <PasswordInput
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <h2 className="text-lg font-semibold text-center">
              Confirm Password
            </h2>
            <PasswordInput
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleUserUpdate}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
            >
              Update
            </button>
            {message && (
              <p className="text-lg text-center font-bold text-black-300 dark:text-black-300">
                {message}
              </p>
            )}
          </div>
        );
      case "theme":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Change Theme</h2>
            <button
              onClick={() =>
                setTheme((prev) => (prev === "light" ? "dark" : "light"))
              }
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </button>
          </div>
        );
      case "reservations":
        return <h2 className="text-xl font-semibold">Pending Reservations:</h2>;
      default:
        return <p>Select a panel</p>;
    }
  };

  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <aside className="w-64 p-4 dark:bg-amber-400 bg-amber-400 border-r border-gray-300 dark:border-gray-700 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center mb-6">
            <a
              href="/"
              className="hover:opacity-75 hover:scale-110 transition-transform"
            >
              <svg
                className="h-12 w-12 mr-1.5 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </a>
            <h1 className="text-lg font-bold">Profile Page</h1>
          </div>
          <ul className="space-y-2">
            <li
              className="cursor-pointer hover:font-semibold"
              onClick={() => setSelectedPanel("userInfo")}
            >
              User Information
            </li>
            <li
              className="cursor-pointer hover:font-semibold"
              onClick={() => setSelectedPanel("reservations")}
            >
              Pending Reservations
            </li>
            <li
              className="cursor-pointer hover:font-semibold"
              onClick={() => setSelectedPanel("theme")}
            >
              Theme
            </li>
          </ul>
          <div className="flex flex-col items-center mt-12">
            <img
              src={Profile}
              alt="Profile"
              className="w-20 h-20 rounded-full mb-2 hover:scale-110 transition-transform"
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <a
            href="/manage-restaurants"
            className="text-center text-sm text-black-500 hover:text-gray-700 w-full"
          >
            <button className=" bg-white font-bold text-black py-2 rounded-lg hover:bg-amber-200 w-full text-center">
              Manage your restaurants!
            </button>
          </a>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{renderPanelContent()}</main>
    </div>
  );
};

export default ProfilePage;
