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
              pattern:"^[A-Za-zА-Яа-яЁё\\s\\-().,:;]+$",
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
            }
          }
        }
      }
    });

    await db.collection("accessorie").insertMany([
      {title: "Чехол для гитары",description: "Чехол для защиты гитары от повреждений.",price: 1500.05,material: "Нейлон"},
      {title: "Струны для скрипки",description: "Набор струн для скрипки, обеспечивающий хороший звук.",price: 800.00,material: "Нейлон"},
      {title: "Тюнер для гитары",description: "Прибор для настройки гитары.",price: 1200.00,material: "Пластик"},
      {title: "Мундштук для саксофона",description: "Мундштук для саксофона, обеспечивающий комфортное звучание.",price: 2000.01,material: "Металл"},
      {title: "Педаль эффектов для гитары",description: "Педаль для создания различных звуковых эффектов.",price: 3500.34,material: "Металл и пластик"},
      {title: "Кейс для духовых инструментов",description: "Кейс для безопасного хранения духовых инструментов.",price: 2500,material: "Дерево и ткань"},
      {title: "Ремень для гитары",description: "Ремень для удобного ношения гитары.",price: 900.99,material: "Кожа"},
      {title: "Стойка для микрофона",description: "Стойка для надежной установки микрофона.",price: 1800.96,material: "Металл"},
      {title: "Держатель для нот",description: "Держатель для удобного чтения нот во время игры.",price: 600.34,material: "Металл"},
      {title: "Чехол для ударной установки",description: "Чехол для защиты ударной установки от повреждений.",price: 3000.01,material: "Полиэстер" }
    ]);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("accessorie").drop(); 
  }
};
