module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Follow', [
      {
        id: 1,
        subjectId: 2,
        targetOd: 1,
      },
      {
        id: 2,
        subjectId: 1,
        targetOd: 2,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Follow', null, {});
  },
};
