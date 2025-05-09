import { useNavigate } from "react-router-dom";
import api from "../api/api";

function NavBar() {
  const navigate = useNavigate();

  async function handleLogout() {
    const refresh = localStorage.getItem("refresh");

    try {
      await api.post("/auth/logout/", { refresh });

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      alert("Failed to logout, but tokens are cleared locally.");
    }
  }

  return (
    <>
      <div className="flex justify-end w-full py-2">
        <button className="px-4 py-1" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <hr />
    </>
  );
}

export default NavBar;
