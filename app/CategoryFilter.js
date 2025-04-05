import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';

export default function CategoryFilter({ categories, onCategoryChange, initialCategory = null }) {
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const initial = new Set();
    if (initialCategory) {
      initial.add(initialCategory);
    }
    return initial;
  });

  const handleCategoryPress = (category) => {
    const updatedCategories = new Set(selectedCategories);

    if (category.toLowerCase() === 'all') {
      // If "All" is selected, clear all other selections
      updatedCategories.clear();
      updatedCategories.add(category);
    } else {
      // If another category is selected, remove "All" if it exists
      updatedCategories.delete('all');
      updatedCategories.delete('All');

      if (updatedCategories.has(category)) {
        updatedCategories.delete(category);
      } else {
        updatedCategories.add(category);
      }
    }

    setSelectedCategories(updatedCategories);
    onCategoryChange && onCategoryChange(Array.from(updatedCategories));
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategories.has(category) ? styles.selectedCategory : null
            ]}
            onPress={() => handleCategoryPress(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategories.has(category) ? styles.selectedCategoryText : null,

              ]}
            >
              {capitalizeFirstLetter(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#EDEFEE',
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#495E57',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
});