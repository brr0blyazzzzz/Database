module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection("instrument-accessorie", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["instrument_id", "accessorie_id"],
          properties: {
            accessorie_id: {
              bsonType: "int",
              minimum: 1,
              description: "Связь с аксессуаром"
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

    await db.collection("instrument-accessorie").insertMany([
       {accessorie_id: 1, instrument_id: 1 },
       {accessorie_id: 1, instrument_id: 2 },
       {accessorie_id: 8, instrument_id: 3},
       {accessorie_id: 6, instrument_id: 4},
       {accessorie_id: 8, instrument_id: 5},
       {accessorie_id: 1, instrument_id: 5},
       {accessorie_id: 3, instrument_id: 6},
       {accessorie_id: 4, instrument_id: 7},
       {accessorie_id: 3, instrument_id: 9},
       {accessorie_id: 8, instrument_id: 9}

    ]);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("instrument-accessorie").drop(); 
  }
};