import { createContext, useContext, useState, useEffect } from "react";

const initialSettings = {
  userType: null, // 'buyer' or 'seller'
  updateUserType: () => {},
};
const UserContext = createContext(initialSettings);

export function UserProvider({ children }) {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Simulate fetching user type from localStorage or API
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const updateUserType = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type);
  };

  return (
    <UserContext.Provider value={{ userType, updateUserType }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
