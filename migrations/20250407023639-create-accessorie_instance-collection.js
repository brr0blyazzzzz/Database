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
          required: ["color", "accessorie_id"],
          properties: {
            color: {
              bsonType: "string",
              minLength: 3, 
              pattern: "^[A-Za-zА-Яа-яЁё\\s\\-().,:;]+$", 
              description: "Цвет экземпляра аксессуара"
            },
            accessorie_id: {
              bsonType: "int",
              minimum: 1,
              description: "Связь с аксессуаром"
            }
          }
        }
      }
    });

    await db.collection("accessorie_instance").insertMany([
      {color: "Черный", accessorie_id:10},
      {color: "Красный", accessorie_id:1},
      {color: "Черный", accessorie_id:3},
      {color: "Черный", accessorie_id:4},
      {color: "Желтый",  accessorie_id:1},
      {color: "Желтый", accessorie_id:7},
      {color: "Голубой", accessorie_id:6},
      {color: "Белый", accessorie_id:5},
      {color: "Красный", accessorie_id:10},
      {color: "Оранжевый", accessorie_id:8}
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