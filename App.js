import { StyleSheet } from "react-native";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./app/screens/auth/LoginScreen";
import RegistrationScreen from "./app/screens/auth/RegistrationScreen";
import OnboardingScreen from "./app/screens/onboarding/OnboardingScreen";
import Home from "./app/screens/Home";
import { createStackNavigator } from "@react-navigation/stack";

export default function App() {
  // const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const Stack = createStackNavigator();

  if (user) {
    return <Home />;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" extraData={setUser} component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
