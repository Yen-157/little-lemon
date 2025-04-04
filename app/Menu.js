import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet } from 'react-native';
import { createTable, insertMenuItem, getMenuItems } from './databaseMenu';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    createTable(db);
    checkAndLoadMenu();
  }, []);

  const checkAndLoadMenu = () => {
    getMenuItems((items) => {
      if (items.length === 0) {
        fetchMenuItems();
      } else {
        setMenuItems(items);
      }
    });
  };

  const fetchMenuItems = async () => {
    try {
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
        image: foodpictures[item.image]
      }));

      setMenuItems(updatedMenuItems);
      updatedMenuItems.forEach(insertMenuItem);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
      />
    </View>
  );

  return (
    <FlatList
      data={menuItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
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
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 16,
  },
});