module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('follow', [
      {
        id: 1,
        subject_id: 2,
        target_id: 1,
      },
      {
        id: 2,
        subject_id: 1,
        target_id: 2,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Follow', null, {});
  },
};
