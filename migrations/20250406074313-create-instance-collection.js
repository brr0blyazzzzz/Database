module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection("instance", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["color","orientation", "instrument_id"],
          properties: {
            color: {
              bsonType: "string",
              minLength: 3, 
              pattern: "^[A-Za-zА-Яа-яЁё\\s\\-().,:;]+$", 
              description: "Цвет экземпляра"
            },
            orientation: {
              bsonType: "string",
              pattern: "^[A-Za-zА-Яа-яЁё\\s\\-().,:;]+$",
              minLength: 5,
              description: "Ориентация экземпляра"
            },
            instrument_id: {
              bsonType: "int",
              minimum: 1,
              description: "Связь с инструментом"
            }
          }
        }
      }
    });

    await db.collection("instance").insertMany([
      {color: "Черный", orientation: "Правый", instrument_id:10},
      {color: "Красный", orientation: "Правый", instrument_id:1},
      {color: "Черный", orientation: "Любой", instrument_id:3},
      {color: "Черный", orientation: "Любой", instrument_id:4},
      {color: "Желтый", orientation: "Правый", instrument_id:1},
      {color: "Желтый", orientation: "Любой", instrument_id:7},
      {color: "Голубой", orientation: "Любой", instrument_id:6},
      {color: "Белый", orientation: "Любой", instrument_id:5},
      {color: "Красный",orientation: "Левый", instrument_id:10},
      {color: "Оранжевый", orientation: "Левый", instrument_id:8}
    ]);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("instance").drop(); 
  }
};