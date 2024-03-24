const User = require("./models/user");
const Post = require("./models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("./utils/constants");
const verifyToken = require("./utils/verifyToken");

const resolvers = {
  Query: {
    users: async () => await User.findAll(),
    posts: async () => await Post.findAll(),
    userById: async (parent, args, context, info) =>
      await User.findByPk(args.id),
    postById: async (parent, args, context, info) =>
      await Post.findByPk(args.id),

    login: async (_, { email, password }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("ユーザーが見つかりません。");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("パスワードが間違っています。");
      }
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "24h",
      });
      const refreshToken = jwt.sign({ email }, SECRET_KEY, {
        expiresIn: "7d",
      });
      return { user, token, refreshToken };
    },

    authenticatedUser: async (_, __, { req }) => {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("トークンが提供されていません。");
      }
      const decoded = verifyToken(token);
      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw new Error("ユーザーが見つかりません。");
      }
      return user;
    },
  },
  Mutation: {
    addUser: async (_, { name, email, password }) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ name, email, password: hashedPassword });
      const token = jwt.sign({ email }, SECRET_KEY, {
        expiresIn: "24h",
      });
      const refreshToken = jwt.sign({ email }, SECRET_KEY, {
        expiresIn: "7d",
      });
      console.log("token: ", token);
      console.log("refreshToken: ", refreshToken);
      return user;
    },
    addPost: async (_, { title, content, userId }) => {
      const post = await Post.create({ title, content, userId });
      return post;
    },
    updatePost: async (_, { id, title, content }, { req }) => {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("トークンが提供されていません。");
      }
      const decoded = verifyToken(token);
      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw new Error("ユーザーが見つかりません。");
      }
      const post = await Post.findByPk(id);
      if (!post) {
        throw new Error("ポストが見つかりません。");
      }
      if (post.userId !== user.id) {
        throw new Error("このポストを更新する権限がありません。");
      }
      await post.update({ title, content });
      return post;
    },
    deletePost: async (_, { id }, { req }) => {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("トークンが提供されていません。");
      }
      const decoded = verifyToken(token);
      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw new Error("ユーザーが見つかりません。");
      }
      const post = await Post.findByPk(id);
      if (!post) {
        throw new Error("ポストが見つかりません。");
      }
      if (post.userId !== user.id) {
        throw new Error("このポストを削除する権限がありません。");
      }
      await post.destroy();
      return { message: "ポストが正常に削除されました。" };
    },
  },
  User: {
    posts(parent) {
      return Post.findAll({ where: { userId: parent.id } });
    },
  },
  Post: {
    user(parent) {
      return User.findByPk(parent.userId);
    },
  },
};

module.exports = { resolvers };
