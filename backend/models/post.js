const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const Post = sequelize.define('Post', {
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // 'Users'は関連付けられたモデルのテーブル名に合わせてください
      key: 'id', // 'id'はUserモデルの主キーの名前に合わせてください
    },
  },
});

module.exports = Post;