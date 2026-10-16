import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchTopHeadlines } from "../services/newsApi";
import { NewsArticle } from "../types/news";
import { NewsCard } from "./news-card";

const NewsFeed = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("all");
  const [country, setCountry] = useState("us");

  const loadNews = useCallback(
    async (pageNumber: number = 1, reset: boolean = false) => {
      try {
        const response = await fetchTopHeadlines({
          page: pageNumber,
          pageSize: 20,
          category: category === "all" ? undefined : category,
          country,
        });

        if (reset) {
          setArticles(response.articles);
        } else {
          setArticles((prev) => [...prev, ...response.articles]);
        }

        setHasMore(
          response.articles.length > 0 &&
            pageNumber * 20 < response.totalResults,
        );

        setPage(pageNumber);
      } catch (error) {
        console.error("Error loading news:", error);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [category, country],
  );

  useEffect(() => {
    loadNews(1, true);
  }, [country, category]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadNews(1, true);
    setHasMore(true);
    setPage(1);
    loadNews(1, true);
  }, [loadNews]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      loadNews(page + 1, false);
    }
  }, [loadingMore, hasMore, page, loadNews]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
    setHasMore(true);
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    setPage(1);
    setHasMore(true);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {error || "No news articles found."}
        </Text>

        {error && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadNews(1, true)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* TODO: Header */}
      <FlatList
        data={articles}
        keyExtractor={(item, index) => item.url + index}
        renderItem={({ item }) => <NewsCard article={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[]}
      />
    </View>
  );
};

export default NewsFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  listContainer: {
    paddingVertical: 8,
    paddingBottom: 16,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  helpText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
    textDecorationLine: "underline",
  },
});
