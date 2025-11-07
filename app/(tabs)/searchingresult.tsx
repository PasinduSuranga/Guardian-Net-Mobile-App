import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// GuardianNet color palette
const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  lightTeal: "#A8D1D1",
  warmGold: "#D4B25E",
  darkText: "#3A5A5A",
  lightGray: "#CBCAC8",
  white: "#FFFFFF",
  successGreen: "#81C784",
  errorRed: "#E57373",
};

interface Pharmacy {
  id: string;
  name: string;
  distance: string;
  available: boolean;
  price?: string;
  deliveryTime?: string;
  rating?: number;
}

const SearchingResultsScreen = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [results, setResults] = useState<Pharmacy[]>([]);

  // Get search parameters from navigation if available
  const searchParams = route?.params || {};

  const fetchResults = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setResults([
        {
          id: "1",
          name: "Guardian Pharmacy - Colombo 03",
          distance: "1.5 km",
          available: true,
          price: "Rs. 450",
          deliveryTime: "30 mins",
          rating: 4.8,
        },
        {
          id: "2",
          name: "HealthCare Plus Pharmacy - Dehiwala",
          distance: "3.2 km",
          available: true,
          price: "Rs. 480",
          deliveryTime: "45 mins",
          rating: 4.5,
        },
        {
          id: "3",
          name: "MediServe - Borella",
          distance: "4.8 km",
          available: false,
          price: "Rs. 420",
          deliveryTime: "N/A",
          rating: 4.2,
        },
        {
          id: "4",
          name: "Pharmacy One - Mount Lavinia",
          distance: "5.1 km",
          available: true,
          price: "Rs. 500",
          deliveryTime: "60 mins",
          rating: 4.6,
        },
      ]);
    }, 2000);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchResults();
      setRefreshing(false);
    }, 1500);
  };

  const handleRequestMedicine = (pharmacy: Pharmacy) => {
    navigation.navigate("confirmedbooking", {
      pharmacy,
      searchParams,
    });
  };

  const renderItem = ({ item }: { item: Pharmacy }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{item.name}</Text>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {item.rating}</Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.available ? colors.successGreen : colors.errorRed },
          ]}
        >
          <Text style={styles.statusText}>
            {item.available ? "Available" : "Out of Stock"}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detail}>{item.distance} away</Text>
        </View>

        {item.price && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>💰</Text>
            <Text style={styles.detail}>{item.price}</Text>
          </View>
        )}

        {item.deliveryTime && item.available && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🚚</Text>
            <Text style={styles.detail}>Delivery in {item.deliveryTime}</Text>
          </View>
        )}
      </View>

      {item.available ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleRequestMedicine(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Request Medicine</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.disabledButton}>
          <Text style={styles.disabledButtonText}>Currently Unavailable</Text>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>No Results Found</Text>
      <Text style={styles.emptyText}>
        We couldn't find any pharmacies with your requested medicine nearby.
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={fetchResults}
        activeOpacity={0.8}
      >
        <Text style={styles.retryButtonText}>Search Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Search Results</Text>
        <Text style={styles.subtitle}>
          {loading
            ? "Searching nearby pharmacies..."
            : `Found ${results.length} pharmacies`}
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryTeal} />
            <Text style={styles.loadingText}>Finding nearby pharmacies...</Text>
            <Text style={styles.loadingSubtext}>
              This may take a few moments
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContainer,
              results.length === 0 && styles.emptyListContainer,
            ]}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primaryTeal]}
                tintColor={colors.primaryTeal}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchingResultsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightTeal + "20",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primaryTeal,
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.darkText,
    textAlign: "center",
    marginBottom: 15,
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkText,
  },
  loadingSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: colors.darkText,
    opacity: 0.7,
  },
  listContainer: {
    paddingVertical: 10,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: colors.darkTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.darkText,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    color: colors.warmGold,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  detail: {
    fontSize: 14,
    color: colors.darkText,
  },
  button: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: colors.darkTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButtonText: {
    color: colors.darkText,
    fontWeight: "600",
    fontSize: 15,
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.darkText,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: colors.darkText,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.primaryTeal,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
});