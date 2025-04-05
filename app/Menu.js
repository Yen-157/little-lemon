import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { createTable, getMenuItems, insertMenuItems } from './databaseMenu';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Initializing database...');
        await createTable();
        await checkAndLoadMenu();
      } catch (error) {
        console.error('Error initializing database:', error);
        setError(`Database initialization failed: ${error.message}`);
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const checkAndLoadMenu = async () => {
    try {
      const items = await getMenuItems();
      console.log('Retrieved menu items:', items.length);

      if (items.length === 0) {
        await fetchMenuItems();
      } else {
        setMenuItems(items);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking menu:', error);
      setError(`Failed to load menu: ${error.message}`);
      setLoading(false);
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError(`Failed to fetch menu: ${error.message}`);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
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

  return (
    <FlatList
      data={menuItems}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.name}-${index}`}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No menu items available</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
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
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#495E57',
    marginTop: 4,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 16,
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