const { Sequelize } = require('sequelize');

class Tag extends Sequelize.Model {
  static init(sequelize) {
    // 모델 동기화를 위한 부모 model의 init 메서드 호출
    return super.init(
      {
        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
        },
        category: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        createdAt: {
          field: 'created_at',
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('now()'),
        },
        updatedAt: {
          field: 'updated_at',
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('now()'),
        },
      },
      {
        sequelize,
        timestamps: true, // 속성값이 true일 경우, createdAt과 updatedAt 컬럼이 자동 추가되며 생성/수정 시간 기록
        modelName: 'Tag', // 모델 이름 설정
        tableName: 'tag', // 실제 데이터베이스의 테이블 이름, 명명규칙: 소문자 및 복수형
        paranoid: false, // true 로 설정 시 deletedAt 컬럼이 생성되며 로우 삭제 시 deletedAt 컬럼에 지운 시각이 기록됨, 로우 복원 상황이 필요할 경우 true 로 설정
        underscored: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      },
    );
  }

  // 다른 모델과의 관계를 서술하는 associate 메서드
  static associate(db) {
    db.Tag.belongsToMany(db.User, {
      through: 'UserTag',
      foreignKey: 'tag_id',
    });
  }
}

module.exports = Tag;
