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
      {
        id: 2,
        email: 'gmlwls3520@naver.com',
        nickname: '은근',
        image:
          'https://stuvelimg.s3.ap-northeast-2.amazonaws.com/img/1629643289663_unnamed.jpg',
        gender: 0,
        password:
          'oRv9NhjZO6Niei9POEpfym/33pxqel2MJdPdnVOa3GJ0squ8mRxwZ8epzIfvSlzjy1397CoMffckqBWiJzyEww==',
        salt: 'ylu1wFPOiTHUJwXeb1Sba86DDWEPFTJs2JHu+wt2F4sHDjaEC7DZroh+fGelgIg7uve0UUtbyG7I2qpbgXrPgQ==',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
