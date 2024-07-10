import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function JobCardSPMyStuff({ route }) {
  const { jobDetails } = route.params;
  const navigation = useNavigation();

if (!jobDetails) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>No job details available</Text>
      </SafeAreaView>
    )
  }
  return (
        <ScrollView style={{ height: '100%' }} >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Job Details</Text>
          </View>
          <View style={{position:'relative'}}>
            <TouchableOpacity
              style={styles.backBnt}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-undo-sharp" size={24} color="#474747" />
            </TouchableOpacity>
            <Image
              source={{ uri: jobDetails.jobImgURL }}
              style={{ width: "100%", height: 300 }}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.headerCard}>
              <View style={styles.textHeader}>
                    <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                      {jobDetails.jobTitle}
                    </Text>
                    <Text style={{ fontSize: 18 }}>{jobDetails.serviceCategoryName}</Text>
                    <Text style={{ fontSize: 18 }}>
                      Max Budget: £{jobDetails.jobBudget}
                    </Text>
              </View>
            </View>
            <View
              style={{
                borderWidth: 0.6,
                borderColor: "grey",
                marginBottom: 15,
              }}
            ></View>
            <View style={styles.descriptionBox}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Description
              </Text>
                <Text style={{ fontSize: 13 }}>{jobDetails.jobDescription}</Text>
            </View>
          </View>
          <view>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                HELLO UMER
              </Text>
          </view>
          <View style={{ borderWidth: 0.6, borderColor: "grey", marginBottom: 15, width:390, marginLeft:20 }}></View>
          <View style={styles.bidBox}>
            <Text style={styles.bidTitle}>My Bid Status</Text>
            <Text style={styles.bidText}>Bid Status:     {jobDetails.bidStatus}</Text>
            <Text style={styles.bidText}>Bid Amount:  £{jobDetails.bidAmount}</Text>
            <Text style={styles.bidText}>Bid Date:       {jobDetails.bidCreatedAt.toDate().toLocaleDateString()}</Text>
          </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    padding:20,
  },
  backBnt: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: "#f2f2f2",
    padding: 5,
    borderRadius: 50,
  },
  textHeader: {
    marginBottom: 10,
  },
  descriptionBox: {
    marginBottom: 10,
  },
  headerCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobDetails: {
    flex: 1,
    justifyContent: "center",
  },
  jobContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
  },
  jobStatus: {
    fontSize: 14,
    color: "#777",
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  bidBox: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  bidTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bidText: {
    fontSize: 14,
  },
});
