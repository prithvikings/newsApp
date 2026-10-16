import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onCountryChange: (country: string) => void;
  selectedCategory: string;
  selectedCountry: string;
  searchQuery: string;
}

const categories = [
  { id: "general", name: "General", icon: "newspaper-outline" },
  { id: "business", name: "Business", icon: "briefcase-outline" },
  { id: "entertainment", name: "Entertainment", icon: "film-outline" },
  { id: "health", name: "Health", icon: "medical-outline" },
  { id: "science", name: "Science", icon: "flask-outline" },
  { id: "sports", name: "Sports", icon: "football-outline" },
  { id: "technology", name: "Technology", icon: "hardware-chip-outline" },
];

const countries = [
  { code: "us", name: "United States", flag: "🇺🇸" },
  { code: "gb", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ca", name: "Canada", flag: "🇨🇦" },
  { code: "au", name: "Australia", flag: "🇦🇺" },
  { code: "de", name: "Germany", flag: "🇩🇪" },
  { code: "fr", name: "France", flag: "🇫🇷" },
  { code: "jp", name: "Japan", flag: "🇯🇵" },
  { code: "in", name: "India", flag: "🇮🇳" },
  { code: "br", name: "Brazil", flag: "🇧🇷" },
  { code: "mx", name: "Mexico", flag: "🇲🇽" },
];

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onCategoryChange,
  onCountryChange,
  selectedCategory,
  selectedCountry,
  searchQuery,
}) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const insets = useSafeAreaInsets();

  const handleSearchSubmit = () => {
    onSearch(localSearchQuery);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    onSearch("");
  };

  const selectedCountryData = countries.find((c) => c.code === selectedCountry);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.mainHeader}>
        <View style={styles.titleContainer}>
          <Ionicons name="newspaper" size={28} color="#6366F1" />
          <Text style={styles.title}>News Feed</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={styles.flagEmoji}>
              {selectedCountryData?.flag || "🌍"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search news..."
          placeholderTextColor="#9CA3AF"
          value={localSearchQuery}
          onChangeText={setLocalSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />

        {localSearchQuery.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategory === "all" && styles.categoryChipActive,
          ]}
          onPress={() => {
            onCategoryChange("all");
            setShowCategoryModal(false);
          }}
        >
          <Ionicons
            name="apps-outline"
            size={16}
            color={selectedCategory === "all" ? "#FFFFFF" : "#6B7280"}
          />
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === "all" && styles.categoryChipTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => {
              onCategoryChange(category.id);
              setShowCategoryModal(false);
            }}
          >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.id ? "#FFFFFF" : "#6B7280"}
            />
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.id &&
                  styles.categoryChipTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Ionicons name="options-outline" size={18} color="#6B7280" />
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedCategory === "all" && styles.modalItemActive,
                ]}
                onPress={() => {
                  onCategoryChange("all");
                  setShowCategoryModal(false);
                }}
              >
                <Ionicons
                  name="apps-outline"
                  size={20}
                  color={selectedCategory === "all" ? "#6366F1" : "#6B7280"}
                />
                <Text
                  style={[
                    styles.modalItemText,
                    selectedCategory === "all" && styles.modalItemTextActive,
                  ]}
                >
                  All Categories
                </Text>
                {selectedCategory === "all" && (
                  <Ionicons name="checkmark" size={20} color="#6366F1" />
                )}
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.modalItem,
                    selectedCategory === category.id && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    onCategoryChange(category.id);
                    setShowCategoryModal(false);
                  }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={20}
                    color={
                      selectedCategory === category.id ? "#6366F1" : "#6B7280"
                    }
                  />
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedCategory === category.id &&
                        styles.modalItemTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                  {selectedCategory === category.id && (
                    <Ionicons name="checkmark" size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showCountryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCountryModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={[
                    styles.modalItem,
                    selectedCountry === country.code && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    onCountryChange(country.code);
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={styles.flagEmojiLarge}>{country.flag}</Text>
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedCountry === country.code &&
                        styles.modalItemTextActive,
                    ]}
                  >
                    {country.name}
                  </Text>
                  {selectedCountry === country.code && (
                    <Ionicons name="checkmark" size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  flagEmoji: {
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    padding: 0,
  },
  clearButton: {
    marginLeft: 8,
  },
  categoryScroll: {
    maxHeight: 60,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#6366F1",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  moreButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  modalScroll: {
    padding: 16,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  modalItemActive: {
    backgroundColor: "#EEF2FF",
  },
  modalItemText: {
    flex: 1,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  modalItemTextActive: {
    color: "#6366F1",
    fontWeight: "600",
  },
  flagEmojiLarge: {
    fontSize: 24,
  },
});
