module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 유저태그 생성
    await queryInterface.bulkInsert('user_tag', [
      {
        user_id: 1,
        tag_id: 8,
      },
      {
        user_id: 1,
        tag_id: 14,
      },
      {
        user_id: 1,
        tag_id: 20,
      },
      {
        user_id: 1,
        tag_id: 21,
      },
      {
        user_id: 1,
        tag_id: 25,
      },
      {
        user_id: 1,
        tag_id: 33,
      },
      {
        user_id: 1,
        tag_id: 38,
      },
      {
        user_id: 1,
        tag_id: 39,
      },
      {
        user_id: 1,
        tag_id: 40,
      },
      {
        user_id: 1,
        tag_id: 41,
      },
      {
        user_id: 1,
        tag_id: 54,
      },
      {
        user_id: 1,
        tag_id: 87,
      },
      {
        user_id: 2,
        tag_id: 14,
      },
      {
        user_id: 2,
        tag_id: 21,
      },
      {
        user_id: 2,
        tag_id: 24,
      },
      {
        user_id: 2,
        tag_id: 25,
      },
      {
        user_id: 2,
        tag_id: 34,
      },
      {
        user_id: 2,
        tag_id: 39,
      },
      {
        user_id: 2,
        tag_id: 40,
      },
      {
        user_id: 2,
        tag_id: 42,
      },
      {
        user_id: 2,
        tag_id: 48,
      },
      {
        user_id: 2,
        tag_id: 59,
      },
      {
        user_id: 2,
        tag_id: 108,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserTag', null, {});
  },
};
