'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('UserAccounts', [{
      firstname: 'Django',
      lastname: 'Bartel',
      address: '4139 Donna Lynn Dr.',
      city: 'Houston',
      state: 'Texas',
      phone: '512-587-5228',
      income: 100000,
      createdAt: new Date(), 
      updatedAt: new Date()
      }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserAccounts', null, {});
  }
};
