module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ํ๊ทธ ์์ฑ
    await queryInterface.bulkInsert('tag', [
      { id: 1, name: 'History', category: 'Knowledge' },
      { id: 2, name: 'Science', category: 'Knowledge' },
      { id: 3, name: 'Physics', category: 'Knowledge' },
      { id: 4, name: 'Math', category: 'Knowledge' },
      { id: 5, name: 'Psychology', category: 'Knowledge' },
      { id: 6, name: 'The Future', category: 'Knowledge' },
      { id: 7, name: 'Education', category: 'Knowledge' },
      { id: 8, name: 'Philosophy', category: 'Knowledge' },
      { id: 9, name: 'Space', category: 'Knowledge' },
      { id: 10, name: 'Covid-19', category: 'Knowledge' },
      { id: 11, name: 'Biology', category: 'Knowledge' },
      { id: 12, name: 'Weights', category: 'Wellness' },
      { id: 13, name: 'Veganism', category: 'Wellness' },
      { id: 14, name: 'Health', category: 'Wellness' },
      { id: 15, name: 'Meditation', category: 'Wellness' },
      { id: 16, name: 'Fitness', category: 'Wellness' },
      { id: 17, name: 'Venture', category: 'Tech' },
      { id: 18, name: 'Startups', category: 'Tech' },
      { id: 19, name: 'Product', category: 'Tech' },
      { id: 20, name: 'Engineering', category: 'Tech' },
      { id: 21, name: 'VR/AR', category: 'Tech' },
      { id: 22, name: 'AI', category: 'Tech' },
      { id: 23, name: 'Marketing', category: 'Tech' },
      { id: 24, name: 'Crypto', category: 'Tech' },
      { id: 25, name: 'Programmer', category: 'Tech' },
      { id: 26, name: 'Designer', category: 'Tech' },
      { id: 27, name: 'Project Manager', category: 'Tech' },
      { id: 28, name: 'Portuguese', category: 'Languages' },
      { id: 29, name: 'Indonesian', category: 'Languages' },
      { id: 30, name: 'German', category: 'Languages' },
      { id: 31, name: 'Hindi', category: 'Languages' },
      { id: 32, name: 'Mandarin', category: 'Languages' },
      { id: 33, name: 'Spanish', category: 'Languages' },
      { id: 34, name: 'Japanese', category: 'Languages' },
      { id: 35, name: 'Arabic', category: 'Languages' },
      { id: 36, name: 'Russian', category: 'Languages' },
      { id: 37, name: 'French', category: 'Languages' },
      { id: 38, name: 'English', category: 'Languages' },
      { id: 39, name: 'Korean', category: 'Languages' },
      { id: 40, name: 'Gaming', category: 'Entertainment' },
      { id: 41, name: 'Music', category: 'Entertainment' },
      { id: 42, name: 'Karaoke', category: 'Entertainment' },
      { id: 43, name: 'Celebrities', category: 'Entertainment' },
      { id: 44, name: 'Podcasts', category: 'Entertainment' },
      { id: 45, name: 'Anime & Manga', category: 'Entertainment' },
      { id: 46, name: 'Fun', category: 'Entertainment' },
      { id: 47, name: 'Variety', category: 'Entertainment' },
      { id: 48, name: 'Movies', category: 'Entertainment' },
      { id: 49, name: 'Television', category: 'Entertainment' },
      { id: 50, name: 'Performances', category: 'Entertainment' },
      { id: 51, name: 'Comedy', category: 'Entertainment' },
      { id: 52, name: 'Storytelling', category: 'Entertainment' },
      { id: 53, name: 'Pregnancy', category: 'Life' },
      { id: 54, name: 'Travelling', category: 'Life' },
      { id: 55, name: 'Weddings', category: 'Life' },
      { id: 56, name: 'Dating', category: 'Life' },
      { id: 57, name: 'Parenting', category: 'Life' },
      { id: 58, name: 'Relationships', category: 'Life' },
      { id: 59, name: 'Job Hunting', category: 'Life' },
      { id: 60, name: 'Career', category: 'Life' },
      { id: 61, name: 'Real Estate', category: 'Life' },
      { id: 62, name: 'Stocks', category: 'Life' },
      { id: 63, name: 'Side Jobs', category: 'Life' },
      { id: 64, name: 'Networking', category: 'Life' },
      { id: 65, name: 'Business', category: 'Life' },
      { id: 66, name: 'Entrepreneurship', category: 'Life' },
      { id: 67, name: 'Basketball', category: 'Sports' },
      { id: 68, name: 'MMA', category: 'Sports' },
      { id: 69, name: 'Golf', category: 'Sports' },
      { id: 70, name: 'Soccer', category: 'Sports' },
      { id: 71, name: 'Football', category: 'Sports' },
      { id: 72, name: 'Cycling', category: 'Sports' },
      { id: 73, name: 'Baseball', category: 'Sports' },
      { id: 74, name: 'Tennis', category: 'Sports' },
      { id: 75, name: 'Volleyball', category: 'Sports' },
      { id: 76, name: 'Food & Drink', category: 'Arts' },
      { id: 77, name: 'Dance', category: 'Arts' },
      { id: 78, name: 'Theater', category: 'Arts' },
      { id: 79, name: 'Fashion', category: 'Arts' },
      { id: 80, name: 'Beauty', category: 'Arts' },
      { id: 81, name: 'Design', category: 'Arts' },
      { id: 82, name: 'Sci-Fi', category: 'Arts' },
      { id: 83, name: 'Writing', category: 'Arts' },
      { id: 84, name: 'Photography', category: 'Arts' },
      { id: 85, name: 'Advertising', category: 'Arts' },
      { id: 86, name: 'Architecture', category: 'Arts' },
      { id: 87, name: 'Books', category: 'Arts' },
      { id: 88, name: 'Economics', category: 'WorldAffairs' },
      { id: 89, name: 'Markets', category: 'WorldAffairs' },
      { id: 90, name: 'Social Issues', category: 'WorldAffairs' },
      { id: 91, name: 'Current Events', category: 'WorldAffairs' },
      { id: 92, name: 'Climate', category: 'WorldAffairs' },
      { id: 93, name: 'Politics', category: 'WorldAffairs' },
      { id: 94, name: 'Geopolitics', category: 'WorldAffairs' },
      { id: 95, name: 'ISTJ', category: 'MBTI' },
      { id: 96, name: 'ISTP', category: 'MBTI' },
      { id: 97, name: 'ISFJ', category: 'MBTI' },
      { id: 98, name: 'ISFP', category: 'MBTI' },
      { id: 99, name: 'INTJ', category: 'MBTI' },
      { id: 100, name: 'INTP', category: 'MBTI' },
      { id: 101, name: 'INFJ', category: 'MBTI' },
      { id: 102, name: 'INFP', category: 'MBTI' },
      { id: 103, name: 'ESTJ', category: 'MBTI' },
      { id: 104, name: 'ESTP', category: 'MBTI' },
      { id: 105, name: 'ESFJ', category: 'MBTI' },
      { id: 106, name: 'ESFP', category: 'MBTI' },
      { id: 107, name: 'ENTJ', category: 'MBTI' },
      { id: 108, name: 'ENTP', category: 'MBTI' },
      { id: 109, name: 'ENFJ', category: 'MBTI' },
      { id: 110, name: 'ENFP', category: 'MBTI' },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tag', null, {});
  },
};
