module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection("instrument_accessorie", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["instrument", "accessorie"],
          properties: {
            instrument: {
              bsonType: "object",
              required: ["$ref", "$id"],
              properties: {
                $ref: { bsonType: "string"},
                $id: { bsonType: "objectId"}
              },
              description: "Ссылка на инструмент"
            },
            accessorie: {
              bsonType: "object",
              required: ["$ref", "$id"],
              properties: {
                $ref: { bsonType: "string"},
                $id: { bsonType: "objectId"}
              },
              description: "Ссылка на аксессуар"
            }
          }
        }
      }
    });
    const instruments = await db.collection("instrument").find().toArray();
    const accessories = await db.collection("accessorie").find().toArray();
    await db.collection("instrument_accessorie").insertMany([
      {instrument: {$ref: "instrument", $id: instruments[0]._id}, accessorie: {$ref: "accessorie", $id: accessories[0]._id}},
      {instrument: {$ref: "instrument", $id: instruments[1]._id}, accessorie: {$ref: "accessorie", $id: accessories[0]._id}},
      {instrument: {$ref: "instrument", $id: instruments[2]._id}, accessorie: {$ref: "accessorie", $id: accessories[2]._id}},
      {instrument: {$ref: "instrument", $id: instruments[3]._id}, accessorie: {$ref: "accessorie", $id: accessories[3]._id}},
      {instrument: {$ref: "instrument", $id: instruments[4]._id}, accessorie: {$ref: "accessorie", $id: accessories[2]._id}},
      {instrument: {$ref: "instrument", $id: instruments[4]._id}, accessorie: {$ref: "accessorie", $id: accessories[0]._id}},
      {instrument: {$ref: "instrument", $id: instruments[5]._id}, accessorie: {$ref: "accessorie", $id: accessories[6]._id}},
      {instrument: {$ref: "instrument", $id: instruments[6]._id}, accessorie: {$ref: "accessorie", $id: accessories[7]._id}},
      {instrument: {$ref: "instrument", $id: instruments[8]._id}, accessorie: {$ref: "accessorie", $id: accessories[6]._id}},
      {instrument: {$ref: "instrument", $id: instruments[8]._id}, accessorie: {$ref: "accessorie", $id: accessories[2]._id}}
    ]);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("instrument_accessorie").drop(); 
  }
};