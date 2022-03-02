'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Users', [{
        username: 'sampleUser',
        password: 'samplePassword',
        email: 'sampleUser@email.com',
        createdAt: new Date(), 
        updatedAt: new Date()
      }], {});

  },

  async down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Users', null, {});
  }
};
