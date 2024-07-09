import { StyleSheet } from "react-native";
import Colors from "../../../Util/Colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {},
  logo: {
    flex: 1,
    height: 300,
    width: 300,
    alignSelf: "center",
    margin: 30,
  },
  input: {
    height: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 7,
    marginBottom: 7,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonFinal: {
    backgroundColor: Colors.primary,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    marginBottom: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonChoice: {
    backgroundColor: Colors.primary,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 15,
    height: 48,
    width: 120,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16,
  },
  selectedButton: {
    backgroundColor: "gray",
  },
});
