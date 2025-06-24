import {
	useState,
	useEffect,
	useCallback,
	createContext,
	useContext,
} from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants/tokenConstants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [isAuthorized, setIsAuthorized] = useState(null);

	const refreshToken = useCallback(async () => {
		const refreshToken = localStorage.getItem(REFRESH_TOKEN);

		try {
			const res = await api.post("/auth/refresh/", {
				refresh: refreshToken,
			});

			if (res.status === 200) {
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				setIsAuthorized(true);
			} else {
				setIsAuthorized(false);
			}
		} catch (error) {
			setIsAuthorized(false);
		}
	}, []);

	const auth = useCallback(async () => {
		const token = localStorage.getItem(ACCESS_TOKEN);

		if (!token) {
			setIsAuthorized(false);
			return;
		}

		const decoded = jwtDecode(token);
		const tokenExpiration = decoded.exp;
		const now = Date.now() / 1000;

		if (tokenExpiration < now) {
			await refreshToken();
		} else {
			setIsAuthorized(true);
		}
	}, [refreshToken]);

	useEffect(() => {
		auth().catch(() => setIsAuthorized(false));
	}, [auth]);

    const value = {
        isAuthorized,
        refreshToken,
        auth,
    };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to easily access the context
export const useAuth = () => {
	return useContext(AuthContext);
};
