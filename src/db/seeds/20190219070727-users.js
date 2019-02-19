'use strict';

const faker = require("faker");

let users = [{
  email: 'admin@example.com',
  password: 'password',
  role: 'admin',
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  email: 'standfirst@example.com',
  password: 'password',
  role: 'standard',
  id: 2,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
 email: 'standlast@example.com',
 password: 'password',
 role: 'standard',
 id: 3,
 createdAt: new Date(),
 updatedAt: new Date()
},
{
 email: 'premium@example.com',
 password: 'password',
 role: 'premium',
 id: 4,
 createdAt: new Date(),
 updatedAt: new Date()
}];

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
   return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete("Users", null, {});
  }
};
