import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");


  // Fetch user from backend using JWT token
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Unauthorized");

      const data = await response.json();
      setUser(data.User);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  //logout fuction
  const logout = () => {
  localStorage.removeItem("token");
  setUser(null);
  navigate("/login");
};

  // React to token add/remove across tabs or manually
 
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token") {
        const token = localStorage.getItem("token");

        // If token is deleted → logout and redirect
        if (!token) {
          setUser(null);
          navigate("/login");
        } else {
          // If new token added → refetch user
          fetchUser();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  // React to manual token removal (same tab)
  useEffect(() => {
    const handleTokenRemoved = () => {
      const token = localStorage.getItem("token");
      if (!token && user) {
        setUser(null);
        navigate("/login");
      }
    };

    // Detect local changes in the same tab
    window.addEventListener("focus", handleTokenRemoved);
    return () => window.removeEventListener("focus", handleTokenRemoved);
  }, [user, navigate]);


  // Apply theme from localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);


  // Run once on app load
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    fetchUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
