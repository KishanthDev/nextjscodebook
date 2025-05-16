"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserStatusContextType {
  acceptChats: boolean;
  toggleAcceptChats: () => void;
}

const UserStatusContext = createContext<UserStatusContextType | undefined>(undefined);

export const UserStatusProvider = ({ children }: { children: ReactNode }) => {
  const [acceptChats, setAcceptChats] = useState(true); 

  useEffect(() => {
    const stored = localStorage.getItem("acceptChats");
    if (stored !== null) {
      setAcceptChats(stored === "true");
    } else {
      setAcceptChats(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("acceptChats", acceptChats.toString());
  }, [acceptChats]);

  const toggleAcceptChats = () => {
    setAcceptChats((prev) => !prev);
  };

  return (
    <UserStatusContext.Provider value={{ acceptChats, toggleAcceptChats }}>
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatus = () => {
  const context = useContext(UserStatusContext);
  if (!context) {
    throw new Error("useUserStatus must be used within a UserStatusProvider");
  }
  return context;
};
