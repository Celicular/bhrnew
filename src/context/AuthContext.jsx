import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/utils/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'user', 'host', 'admin'
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount (would connect to backend later)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Implement actual auth check with backend
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
          const auth = JSON.parse(storedAuth);
          setIsLoggedIn(true);
          setUserRole(auth.role);
          setUser(auth.user);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (role, userData) => {
    setIsLoggedIn(true);
    setUserRole(role);
    // Ensure user_id is included in userData
    const userWithId = {
      ...userData,
      id: userData.user_id || userData.id,
    };
    setUser(userWithId);
    localStorage.setItem(
      "auth",
      JSON.stringify({ role, user: userWithId, timestamp: Date.now() }),
    );
  };

  const logout = async () => {
    try {
      // Call logout API with user_id
      if (user?.id || user?.user_id) {
        await api.logout({ user_id: user.id || user.user_id });
      } else {
        await api.logout();
      }
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API call fails
    }

    // Clear local state
    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
    localStorage.removeItem("auth");
  };

  const register = (role, userData) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUser(userData);
    localStorage.setItem(
      "auth",
      JSON.stringify({ role, user: userData, timestamp: Date.now() }),
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
