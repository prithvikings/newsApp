import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchTopHeadlines } from "../services/newsApi";
import { NewsArticle } from "../types/news";
import { Header } from "./header";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const loadNews = useCallback(
    async (pageNum: number = 1, reset: boolean = false) => {
      try {
        setLoadingMore(pageNum > 1);
        if (reset) {
          setLoading(true);
        }

        let response = await fetchTopHeadlines({
          page: pageNum,
          pageSize: 20,
          category: category === "all" ? undefined : category,
          country,
          query: searchQuery || undefined,
        });

        if (!response) {
          setError(
            "API key is missing. Please configure EXPO_PUBLIC_NEWS_API_KEY in your .env file.",
          );
          setArticles([]);
          return;
        }

        if (!response.articles || response.articles.length === 0) {
          if (reset) {
            setArticles([]);
          }
          setHasMore(false);
          setPage(pageNum);
          return;
        }

        if (reset) {
          setArticles(response.articles);
        } else {
          setArticles((prev) => [...prev, ...response.articles]);
        }

        setHasMore(
          response.articles.length > 0 && pageNum * 20 < response.totalResults,
        );

        setPage(pageNum);
        setError(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "failed to load news";
        setError(errorMessage);
        if (reset) {
          setArticles([]);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [category, country, searchQuery],
  );

  useEffect(() => {
    loadNews(1, true);
  }, [loadNews]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    setError(null);
    loadNews(1, true);
  }, [loadNews]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      loadNews(page + 1, false);
    }
  }, [loadingMore, hasMore, loading, page, loadNews]);

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

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    setIsSearchMode(query.length > 0);
  }, []);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#6366F1" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {error || "No articles found. Pull down to refresh."}
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

  if (loading && articles.length === 0) {
    return (
      <View style={styles.container}>
        <Header
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onCountryChange={handleCountryChange}
          selectedCategory={category}
          selectedCountry={country}
          searchQuery={searchQuery}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading news...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onCountryChange={handleCountryChange}
        selectedCategory={category}
        selectedCountry={country}
        searchQuery={searchQuery}
      />
      <FlatList
        data={articles}
        keyExtractor={(item, index) =>
          item.url + index.toString() || index.toString()
        }
        renderItem={({ item }) => <NewsCard article={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6366F1"
            colors={["#6366F1"]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
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
    backgroundColor: "#F9FAFB",
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 32,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  helpText: {
    fontSize: 14,
    color: "#6366F1",
    textAlign: "center",
    marginTop: 8,
    textDecorationLine: "underline",
  },
});
