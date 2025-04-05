import * as SQLite from 'expo-sqlite';

export const getDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('little_lemon');
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

export async function createTable() {
  try {
    const db = await getDatabase();

    const result = await db.execAsync(`
        CREATE TABLE IF NOT EXISTS menu (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            name TEXT,
                                            description TEXT,
                                            price TEXT,
                                            image TEXT,
                                            category TEXT
        );
    `);

    console.log('Table creation result:', result);
    return result;
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

export async function getMenuItems() {
  try {
    const db = await getDatabase();
    const result = await db.getAllAsync('SELECT * FROM menu');
    console.log("Menu items retrieved:", result);
    return result || [];
  } catch (error) {
    console.error('Error getting menu items:', error);
    return [];
  }
}

export async function getMenuItemsByCategories(categories, searchText = '') {
  try {
    const db = await getDatabase();
    let query = '';
    let params = [];

    const hasSearchText = searchText && searchText.trim().length > 0;

    const hasCategories = categories && categories.length > 0;

    if (!hasCategories && !hasSearchText) {
      return getMenuItems();
    }

    if (hasCategories && !hasSearchText) {
      const placeholders = categories.map(() => '?').join(', ');
      query = `SELECT * FROM menu WHERE category IN (${placeholders})`;
      params = categories.map(cat => cat.toLowerCase());
    } else if (!hasCategories && hasSearchText) {
      query = `SELECT * FROM menu WHERE name LIKE ?`;
      params = [`%${searchText.toLowerCase()}%`];
    } else {
      const placeholders = categories.map(() => '?').join(', ');
      query = `SELECT * FROM menu WHERE category IN (${placeholders}) AND name LIKE ?`;
      params = [...categories.map(cat => cat.toLowerCase()), `%${searchText.toLowerCase()}%`];
    }

    const result = await db.getAllAsync(query, params);
    console.log(`Menu items retrieved${hasCategories ? ` for categories [${categories.join(', ')}]` : ''}${hasSearchText ? ` with search "${searchText}"` : ''}:`, result.length);

    return result || [];
  } catch (error) {
    console.error('Error getting menu items by filters:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    const db = await getDatabase();
    const result = await db.getAllAsync('SELECT DISTINCT category FROM menu');

    const categories = result
      .map(item => item.category)
      .filter(category => category);

    console.log("Categories retrieved:", categories);
    return categories || [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export async function insertMenuItem(item) {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
      [item.name, item.description, item.price, item.image, item.category]
    );
    console.log('Inserted menu item:', item.name);
    return true;
  } catch (error) {
    console.error('Error inserting menu item:', error);
    throw error;
  }
}

export async function insertMenuItems(items) {
  try {
    const db = await getDatabase();
    await db.withTransactionAsync(async () => {
      for (const item of items) {
        await db.runAsync(
          'INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
          [item.name, item.description, item.price, item.image, item.category]
        );
      }
    });
    console.log('All menu items inserted successfully');
    return true;
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}