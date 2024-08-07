import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {},
  logo: {
    flex: 1,
    height: 320,
    width: 320,
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
    backgroundColor: "#6759FF",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerView: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems: "center",
    gap:5,
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
});
