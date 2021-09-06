module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 태그 생성
    await queryInterface.bulkInsert('tag', [
      {
        id: 1,
        name: 'ISTJ',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'ISTP',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'ISFJ',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: 'ISFP',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: 'INTJ',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        name: 'INTP',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        name: 'INFJ',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        name: 'INFP',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        name: 'ESTJ',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        name: 'ESTP',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        name: 'ESFJ',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 12,
        name: 'ESFP',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 13,
        name: 'ENTJ',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 14,
        name: 'ENTP',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 15,
        name: 'ENFJ',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 16,
        name: 'ENFP',
        category: 'MBTI',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tag', null, {});
  },
};
