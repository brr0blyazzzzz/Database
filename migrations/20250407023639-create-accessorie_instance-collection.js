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
          required: ["color", "accessorie"],
          properties: {
            color: {
              bsonType: "string",
              minLength: 3, 
              pattern: "^[A-Za-zА-Яа-яЁё\\s\\-().,:;]+$", 
              description: "Цвет экземпляра аксессуара"
            },
            accessorie: {
              bsonType: "object",
              required: ["$ref", "$id"],
              properties: {
                $ref: { bsonType: "string", description: "Коллекция, на которую ссылается" },
                $id: { bsonType: "objectId", description: "ID документа в коллекции" }
              },
              description: "Ссылка на аксессуар"
            }
          }
        }
      }
    });
    const accessories = await db.collection("accessorie").find().toArray();
    await db.collection("accessorie_instance").insertMany([
      {color: "Черный", accessorie: {$ref: "accessorie", $id: accessories[0]._id}},
      {color: "Красный", accessorie: {$ref: "accessorie", $id: accessories[1]._id}},
      {color: "Черный", accessorie: {$ref: "accessorie", $id: accessories[2]._id}},
      {color: "Черный", accessorie: {$ref: "accessorie", $id: accessories[3]._id}},
      {color: "Желтый", accessorie: {$ref: "accessorie", $id: accessories[4]._id}},
      {color: "Желтый", accessorie: {$ref: "accessorie", $id: accessories[5]._id}},
      {color: "Голубой", accessorie: {$ref: "accessorie", $id: accessories[6]._id}},
      {color: "Белый", accessorie: {$ref: "accessorie", $id: accessories[7]._id}},
      {color: "Красный", accessorie: {$ref: "accessorie", $id: accessories[8]._id}},
      {color: "Оранжевый", accessorie: {$ref: "accessorie", $id: accessories[9]._id}}
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