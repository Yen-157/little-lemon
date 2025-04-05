import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import {
  createTable,
  getMenuItems,
  insertMenuItems,
  getCategories,
  getMenuItemsByCategories
} from './databaseMenu';
import CategoryFilter from './CategoryFilter';
import HeroBanner from './HeroBanner';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Initializing database...');
        await createTable();
        await loadInitialData();
      } catch (error) {
        console.error('Error initializing database:', error);
        setError(`Database initialization failed: ${error.message}`);
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  useEffect(() => {
    const filterMenuItems = async () => {
      try {
        const filteredItems = await getMenuItemsByCategories(selectedCategories, searchText);
        setMenuItems(filteredItems);
      } catch (error) {
        console.error('Error filtering menu items:', error);
        setError(`Failed to filter menu: ${error.message}`);
      }
    };

    if (!loading) {
      filterMenuItems();
    }
  }, [selectedCategories, searchText, loading]);

  const loadInitialData = async () => {
    try {
      const items = await getMenuItems();

      if (items.length === 0) {
        await fetchMenuItems();
      } else {
        setMenuItems(items);

        await loadCategories();
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError(`Failed to load menu: ${error.message}`);
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const dbCategories = await getCategories();

      setCategories(['all', 'drinks', ...dbCategories]);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError(`Failed to load categories: ${error.message}`);
    }
  };

  const fetchMenuItems = async () => {
    try {
      console.log('Fetching menu items from remote source...');
      const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
      const data = await response.json();

      const foodpictures = {
        "greekSalad.jpg": "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/greekSalad.jpg?raw=true",
        "bruschetta.jpg": "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/bruschetta.jpg?raw=true",
        "pasta.jpg": "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/pasta.jpg?raw=true",
        "lemonDessert.jpg": "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/lemonDessert%202.jpg?raw=true",
      };

      const updatedMenuItems = data.menu.map(item => ({
        ...item,
        image: foodpictures[item.image] || item.image
      }));

      console.log('Inserting fetched menu items into database...');
      await insertMenuItems(updatedMenuItems);

      setMenuItems(updatedMenuItems);

      await loadCategories();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError(`Failed to fetch menu: ${error.message}`);
      setLoading(false);
    }
  };

  const handleCategoryChange = (categories) => {
    const lowercaseCategories = categories.map(cat => cat.toLowerCase());

    if (lowercaseCategories.includes('all')) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(lowercaseCategories);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const renderItem = ({ item, index }) => {
    // For header items
    if (item.type === 'header') {
      return (
        <View>
          <HeroBanner onSearch={handleSearch} />
          <View style={styles.orderBanner}>
            <Text style={styles.orderText}>ORDER FOR DELIVERY!</Text>
          </View>
          <CategoryFilter
            categories={categories}
            onCategoryChange={handleCategoryChange}
            initialCategory="all"
          />
        </View>
      );
    }

    // For menu items
    return (
      <View style={styles.itemContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4CE14" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const dataWithHeader = [
    { type: 'header', id: 'header' },
    ...menuItems
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dataWithHeader}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.type === 'header' ? 'header' : `${item.name}-${index}`
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menu items available for selected categories</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  orderBanner: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
  },
  orderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  itemImage: {
    width: 100,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemPrice: {
    fontSize: 16,
    color: '#495E57',
    marginTop: 4,
    fontWeight: '600',
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  }
});