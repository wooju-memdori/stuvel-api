const { Sequelize } = require('sequelize');

class Follow extends Sequelize.Model {
  static init(sequelize) {
    // 모델 동기화를 위한 부모 model의 init 메서드 호출
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        subjectId: {
          field: 'subject_id',
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        targetId: {
          field: 'target_id',
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true, // 속성값이 true일 경우, createdAt과 updatedAt 컬럼이 자동 추가되며 생성/수정 시간 기록
        modelName: 'Follow', // 모델 이름 설정
        tableName: 'follow', // 실제 데이터베이스의 테이블 이름, 명명규칙: 소문자 및 복수형
        paranoid: false, // true 로 설정 시 deletedAt 컬럼이 생성되며 로우 삭제 시 deletedAt 컬럼에 지운 시각이 기록됨, 로우 복원 상황이 필요할 경우 true 로 설정
        underscored: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      },
    );
  }

  // 다른 모델과의 관계를 서술하는 associate 메서드
  static associate(db) {
    db.Follow.belongsTo(db.User, {
      as: 'followers',
      foreignKey: 'subject_id',
    });
    db.Follow.belongsTo(db.User, {
      as: 'followings',
      foreignKey: 'target_id',
    });
  }
}

module.exports = Follow;
