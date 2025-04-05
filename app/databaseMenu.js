import * as SQLite from 'expo-sqlite';

// This function will open the database and return it
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