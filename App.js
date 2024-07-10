import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserContext, UserProvider } from "./app/contexts/UserContext";
import OnboardingScreen from "./app/screens/onboarding/OnboardingScreen";
import LoginScreen from "./app/screens/auth/LoginScreen";
import RegistrationScreen from "./app/screens/auth/RegistrationScreen";
import NavBar from "./app/navigation/NavBar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from "react-native";

const Stack = createStackNavigator();

const AppContent = () => {
  const { user } = useContext(UserContext);
  const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
    </Stack.Navigator>
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer>{user ? <NavBar /> : <AuthStack />}</NavigationContainer>
    </SafeAreaProvider>
  );
};

export default function App() {
  LogBox.ignoreLogs([""]);
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
