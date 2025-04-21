module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection("accessorie", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title", "description", "price", "material"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 3,
              pattern: "^[A-Za-zА-Яа-яЁё\\s\\-().,:;]+$",
              description: "Название аксессуара"
            },
            description: {
              bsonType: "string",
              minLength: 3,
              description: "Описание аксессуара"
            },
            price: {
              bsonType: "number",
              minimum: 1.00,
              description: "Цена аксессуара"
            },
            material: {
              bsonType: "string",
              minLength: 3,
              pattern: "^[A-Za-zА-Яа-яЁё\\s\\-().,:;]+$",
              description: "Материал аксессуара"
            },
            instruments: {
              bsonType: "array",
              items: {
                bsonType: "objectId"
              },
              description: "Массив идентификаторов совместимых инструментов"
            }
          }
        }
      }
    });

    const instruments = await db.collection("instrument").find().toArray();
    const instrumentIds = instruments.map(i => i._id);

    await db.collection("accessorie").insertMany([
      { 
        title: "Чехол для гитары",
        description: "Чехол для защиты гитары от повреждений.",
        price: 1500.05,
        material: "Нейлон",
        instruments: [instrumentIds[0], instrumentIds[1]] 
      },
      { 
        title: "Струны для скрипки",
        description: "Набор струн для скрипки, обеспечивающий хороший звук.",
        price: 800.01,
        material: "Нейлон",
        instruments: [instrumentIds[0]]
      },
      { 
        title: "Тюнер для гитары",
        description: "Прибор для настройки гитары.",
        price: 1200.00,
        material: "Пластик",
        instruments: [instrumentIds[2], instrumentIds[4]]
      },
      { 
        title: "Мундштук для саксофона",
        description: "Мундштук для саксофона, обеспечивающий комфортное звучание.",
        price: 2000.01,
        material: "Металл",
        instruments: [instrumentIds[3]]
      },
      { 
        title: "Педаль эффектов для гитары",
        description: "Педаль для создания различных звуковых эффектов.",
        price: 3500.34,
        material: "Металл и пластик",
        instruments: [instrumentIds[8]]
      },
      { 
        title: "Кейс для духовых инструментов",
        description: "Кейс для безопасного хранения духовых инструментов.",
        price: 2500.00,
        material: "Дерево и ткань",
        instruments: [instrumentIds[6]]
      },
      { 
        title: "Ремень для гитары",
        description: "Ремень для удобного ношения гитары.",
        price: 900.99,
        material: "Кожа",
        instruments: [instrumentIds[8]]
      },
      { 
        title: "Стойка для микрофона",
        description: "Стойка для надежной установки микрофона.",
        price: 1800.96,
        material: "Металл",
        instruments: [instrumentIds[1]]
      },
      { 
        title: "Держатель для нот",
        description: "Держатель для удобного чтения нот во время игры.",
        price: 600.34,
        material: "Металл",
        instruments: [instrumentIds[2]]
      },
      { 
        title: "Чехол для ударной установки",
        description: "Чехол для защиты ударной установки от повреждений.",
        price: 3000.01,
        material: "Полиэстер",
        instruments: [instrumentIds[9]]
      }
    ]);
  },

  async down(db, client) {
    await db.collection("accessorie").drop();
  }
};