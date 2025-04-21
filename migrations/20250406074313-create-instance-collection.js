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
          required: ["color","orientation", "instrument"],
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
            instrument: {
              bsonType: "object",
              required: ["$ref", "$id"],
              properties: {
                $ref: { bsonType: "string", description: "Коллекция, на которую ссылается" },
                $id: { bsonType: "objectId", description: "ID документа в коллекции" }
              },
              description: "Ссылка на инструмент"
            }
          }
        }
      }
    });
    const instruments = await db.collection("instrument").find().toArray();
    await db.collection("instance").insertMany([
      {color: "Черный", orientation: "Правый", instrument: {$ref: "instrument", $id: instruments[0]._id}},
      {color: "Красный", orientation: "Правый", instrument: {$ref: "instrument", $id: instruments[1]._id}},
      {color: "Черный", orientation: "Любой", instrument: {$ref: "instrument", $id: instruments[2]._id}},
      {color: "Черный", orientation: "Любой", instrument: {$ref: "instrument", $id: instruments[3]._id}},
      {color: "Желтый", orientation: "Правый", instrument: {$ref: "instrument", $id: instruments[4]._id}},
      {color: "Желтый", orientation: "Любой", instrument: {$ref: "instrument", $id: instruments[5]._id}},
      {color: "Голубой", orientation: "Любой", instrument: {$ref: "instrument", $id: instruments[6]._id}},
      {color: "Белый", orientation: "Любой", instrument: {$ref: "instrument", $id: instruments[7]._id}},
      {color: "Красный", orientation: "Левый", instrument: {$ref: "instrument", $id: instruments[8]._id}},
      {color: "Оранжевый", orientation: "Левый", instrument: {$ref: "instrument", $id: instruments[9]._id}}
    ]);
  },

  async down(db, client) {
    await db.collection("instance").drop(); 
  }
};