import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import NavBar from "./app/Navigations/NavBar";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text>HOME MAINTENANCE</Text>
        <NavigationContainer>
        <NavBar/>
        </NavigationContainer>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
