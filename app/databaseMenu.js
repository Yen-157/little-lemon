import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('little_lemon');
export async function createTable(db){
  return db.withTransactionAsync(async () => {
  const result = await db.runAsync(
      `CREATE TABLE IF NOT EXISTS menu (
        id integer primary key not null,
        name TEXT,
        description TEXT,
        price TEXT,
        image TEXT,
        category TEXT
      );`
    );
    console.log('Table creation result:', result);
  });
}
export async function getMenuItems(db) {
  const result = await db.getAllAsync('SELECT * FROM menu');
  console.log("menu: ", result)
  return result ?? [];
}

export async function insertMenuItem (item,db){
  return await db.withTransactionAsync(async () => {
    menuItemsServer.forEach((item) => {
      db.runAsync(
      'INSERT INTO menu (name, description, price, image,category) VALUES (?, ?, ?, ?,?)',
      [item.name, item.description, item.price, item.image, item.category]
    );
  });
})};
/*
export const getMenuItems = (callback) => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM menu', [], (_, { rows }) => {
      callback(rows._array);
    });
  });
};
*/
