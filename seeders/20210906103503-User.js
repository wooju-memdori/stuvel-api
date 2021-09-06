module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 유저 생성
    await queryInterface.bulkInsert('user', [
      {
        id: 1,
        email: 'hayeon17kim@gmail.com',
        nickname: '깃허브망령',
        gender: 0,
        password:
          'ClHjfiNpMcMKIPP4AVX+09RnvH2TbEnBS2cHQDxbS5AIBb148pqqMTMDmapWF2U7i+3HUfVauU86RzBdhi6eDw==',
        salt: 'Vi1ct7xhot7NjdshkDixLZnbEqUgNYsRTg5KtKr+5tHq7iyoMpyScVz6Gkb+8oFX40NEUOkQiJMLiepqGizaVA==',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
