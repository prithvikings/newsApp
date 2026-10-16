import { Image as ExpoImage } from "expo-image";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NewsArticle } from "../types/news";

interface NewsCardProps {
  article: NewsArticle;
  onPress?: () => void;
}

export const NewsCard = ({ article, onPress }: NewsCardProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      Linking.openURL(article.url).catch((err) => console.error(err));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {article.urlToImage && (
        <ExpoImage
          source={{ uri: article.urlToImage }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.source} numberOfLines={1}>
            {article.source.name}
          </Text>
          <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        {article.description && (
          <Text style={styles.description} numberOfLines={3}>
            {article.description}
          </Text>
        )}
        {article.author && (
          <Text style={styles.author} numberOfLines={1}>
            By {article.author}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#F0F0F0",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  source: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  author: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
