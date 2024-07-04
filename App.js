import { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./app/screens/auth/LoginScreen";
import RegistrationScreen from "./app/screens/auth/RegistrationScreen";
import OnboardingScreen from "./app/screens/onboarding/OnboardingScreen";
import Home from "./app/screens/Home";
import Jobs from "./app/screens/Jobs";
import { createStackNavigator } from "@react-navigation/stack";
import { UserContext, UserProvider } from "./app/contexts/UserContext";

import JobsMap from "./app/components/JobsMap";

import Profile from "./app/screens/Profile";
import ProviderCard from "./app/screens/cards/ProviderCard";


const AppContent = () => {
  const Stack = createStackNavigator();

  const { user } = useContext(UserContext);

  return (
    
    <NavigationContainer>
      {user ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="ProviderCard" component={ProviderCard} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Jobs" component={Jobs} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    // <JobsMap />
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
