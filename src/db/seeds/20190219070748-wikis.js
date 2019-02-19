'use strict';

const faker = require("faker");

//#2
 let wikis = [];

 wikis.push({
   title: "wiki1byadmin",
   body: faker.hacker.phrase(),
   userId: 1,
   createdAt: new Date(),
   updatedAt: new Date()
 }, {
  title: "wiki2byadmin",
  body: faker.hacker.phrase(),
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  title: "wiki1bystandfirst",
  body: faker.hacker.phrase(),
  userId: 2,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  title: "wiki2bystandfirst",
  body: faker.hacker.phrase(),
  userId: 2,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  title: "wiki1bystandlast",
  body: faker.hacker.phrase(),
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  title: "wiki2bystandlast",
  body: faker.hacker.phrase(),
  userId: 3,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  title: "wiki1bypremium",
  body: faker.hacker.phrase(),
  userId: 4,
  createdAt: new Date(),
  updatedAt: new Date()
}, {
  title: "wiki2bypremium",
  body: faker.hacker.phrase(),
  userId: 4,
  createdAt: new Date(),
  updatedAt: new Date()
});

 for(let i = 1 ; i <= 15 ; i++){
   wikis.push({
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     userId: 2,
     createdAt: new Date(),
     updatedAt: new Date()
   });
 };

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete("Wikis", null, {});
  }
};
