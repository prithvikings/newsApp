import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NewsFeed from "../../components/news-feed";

export default function Index() {
  return (
    <SafeAreaView>
      <NewsFeed />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
