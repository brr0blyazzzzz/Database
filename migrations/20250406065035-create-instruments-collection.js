module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection("instrument", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "manufacturer", "model", "case_material", "price"],
          properties: {
            title: {
              bsonType: "string",
              description: "Название инструмента"
            },
            manufacturer: {
              bsonType: "string",
              description: "Производитель инструмента"
            },
            neck_material: {
              bsonType: "string",
              description: "Материал основы инструмента"
            },
            case_material: {
              bsonType: "string",
              description: "Материал корпуса инструмента"
            },
            model: {
              bsonType: "string",
              description: "Модель инструмента"
            },
            price: {
              bsonType: "number",
              minimum: 0.00,
              description: "Цена инструмента"
            },
          }
        }
      }
    });
    
    await db.collection("instrument").insertMany([
      { title: "Акустическая гитара", manufacturer: "YAMAHA", neck_material: "Клён", case_material: "Тополь", model: "F310", price: 15000.00 },
      { title: "Бас-гитара", manufacturer: "IBANEZ", neck_material: "Буковое дерево", case_material: "Палисандр", model: "GSR200B-WNF", price: 18000.99 },
      { title: "Профессиональный синтезатор", manufacturer: "KORG", neck_material: "Пластик", case_material: "Металл", model: "PA1000", price: 60000.50 },
      { title: "Ударная установка", manufacturer: "ROCKDALE", neck_material: "Металл", case_material: "Металл", model: "Tempest Mesh 1", price: 30000.01 },
      { title: "Пианино", manufacturer: "KORG", neck_material: "Ель", case_material: "Бук", model: "LP-380 WH U", price: 80000.25 },
      { title: "Блок-флейта", manufacturer: "NUVO", neck_material: "Пластик", case_material: "Пластик", model: "Recorder+", price: 2500.01 },
      { title: "Саксофон", manufacturer: "Stephan Weis", neck_material: "Латунь", case_material: "Латунь", model: "SS-301", price: 25000.99 },
      { title: "Тенор-горн", manufacturer: "Atelier Goncharov Besson", neck_material: "Латунь", case_material: "Закаленная сталь", model: "BE157", price: 35000.50 },
      { title: "Аккордеон", manufacturer: "WELTMEISTER", neck_material: "Буковое дерево", case_material: "Кожаная папка со стальными накладками", model: "Perle-II-48/26-RD", price: 45000.75 },
      { title: "Баян", manufacturer: "Тульская гармонь", neck_material: "Красное дерево", case_material: "Картонная папка", model: "BN-37-BK", price: 30000.10 }
    ]);
  },

  async down(db, client) {
    await db.collection("instrument").drop();
  }
};