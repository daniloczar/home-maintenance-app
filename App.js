import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import NavBar from "./app/Navigations/NavBar";
import Header from './app/screens/Header'


export default function App() {
  // const [loading, setLoading] = useState(true);
  // const [user, setUser] = useState(null);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Header/>
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
