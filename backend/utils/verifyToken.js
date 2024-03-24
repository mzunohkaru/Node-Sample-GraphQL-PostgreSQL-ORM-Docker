const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./constants');

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error('トークンの検証に失敗しました。');
  }
};

module.exports = verifyToken;