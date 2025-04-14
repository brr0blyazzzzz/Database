module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection("accessorie_instance", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["color", "accesstorie_id"],
          properties: {
            color: {
              bsonType: "string",
              minLength: 3, 
              pattern: "^[A-Za-zА-Яа-яЁё\\s\\-().,:;]+$", 
              description: "Цвет экземпляра"
            },
            accesstorie_id: {
              bsonType: "int",
              minimum: 1,
              description: "Связь с аксессуаром"
            }
          }
        }
      }
    });

    await db.collection("accessorie_instance").insertMany([
      {color: "Черный", accesstorie_id:10},
      {color: "Красный", accesstorie_id:1},
      {color: "Черный", accesstorie_id:3},
      {color: "Черный", accesstorie_id:4},
      {color: "Желтый",  accesstorie_id:1},
      {color: "Желтый", accesstorie_id:7},
      {color: "Голубой", accesstorie_id:6},
      {color: "Белый", accesstorie_id:5},
      {color: "Красный", accesstorie_id:10},
      {color: "Оранжевый", accesstorie_id:8}
    ]);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("accessorie_instance").drop(); 
  }
};