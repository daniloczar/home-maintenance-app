import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

   useEffect(() => {
     const checkUser = async () => {
       const userData = await AsyncStorage.getItem("user");

       if (userData) {
         setUser(JSON.parse(userData));
       }
     };

     checkUser();
   }, []);


  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
