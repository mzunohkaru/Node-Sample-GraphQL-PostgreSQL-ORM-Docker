const User = require("./models/user");
const Post = require("./models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("./utils/constants");
const verifyToken = require("./utils/verifyToken");

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await User.findAll();
      } catch (error) {
        throw new Error("ユーザーの取得中にエラーが発生しました。");
      }
    },
    posts: async () => {
      try {
        return await Post.findAll();
      } catch (error) {
        throw new Error("投稿の取得中にエラーが発生しました。");
      }
    },
    userById: async (parent, args, context, info) => {
      return findUserById(args.id);
    },
    postById: async (parent, args, context, info) => {
      return findPostById(args.id);
    },

    login: async (_, { email, password }) => {
      return loginUser(email, password);
    },

    authenticatedUser: async (_, __, { req }) => {
      return verifyUser(req.headers.authorization);
    },
  },

  Mutation: {
    addUser: async (_, { user }) => {
      return createUser(user);
    },
    updateUser: async (_, { id, user }) => {
      return updateUser(id, user);
    },
    addPost: async (_, { post }) => {
      try {
        const newPost = await Post.create(post);
        return newPost;
      } catch (error) {
        throw new Error("投稿の追加中にエラーが発生しました。");
      }
    },
    updatePost: async (_, { id, post }) => {
      return updatePost(id, post);
    },
    deletePost: async (_, { id }) => {
      return deletePost(id);
    },
  },
  User: {
    posts(parent) {
      try {
        return Post.findAll({ where: { userId: parent.id } });
      } catch (error) {
        throw new Error("ユーザーの投稿の取得中にエラーが発生しました。");
      }
    },
  },
  Post: {
    user(parent) {
      try {
        return User.findByPk(parent.userId);
      } catch (error) {
        throw new Error("投稿に紐づくユーザーの取得中にエラーが発生しました。");
      }
    },
  },
};

async function findUserById(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      const errorMessage = "指定されたIDのユーザーが見つかりません。";
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
    return user;
  } catch (error) {
    throw new Error("ユーザーの検索中にエラーが発生しました。");
  }
}

async function findPostById(id) {
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      const errorMessage = "指定されたIDの投稿が見つかりません。";
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
    return post;
  } catch (error) {
    throw new Error("投稿の検索中にエラーが発生しました。");
  }
}

async function loginUser(email, password) {
  try {
    const user = await findUserByEmail(email);
    await verifyPassword(password, user.password);
    const { token, refreshToken } = generateTokens(user);
    return { user, token, refreshToken };
  } catch (error) {
    throw new Error("ログイン処理中にエラーが発生しました。");
  }
}

async function findUserByEmail(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const errorMessage = "ユーザーが見つかりません。";
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
  return user;
}

async function verifyPassword(inputPassword, userPassword) {
  const isMatch = await bcrypt.compare(inputPassword, userPassword);
  if (!isMatch) {
    const errorMessage = "パスワードが間違っています。";
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}

async function verifyUser(token) {
  try {
    const user = await getUserFromToken(token);
    return user;
  } catch (error) {
    throw new Error("認証済みユーザーの取得中にエラーが発生しました。");
  }
}

async function getUserFromToken(token) {
  if (!token) {
    const errorMessage = "トークンが提供されていません。";
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
  const decoded = verifyToken(token);
  const user = await User.findByPk(decoded.id);
  if (!user) {
    const errorMessage = "ユーザーが見つかりません。";
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
  return user;
}

const generateTokens = (user) => {
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "24h",
  });
  const refreshToken = jwt.sign({ email: user.email }, SECRET_KEY, {
    expiresIn: "7d",
  });
  return { token, refreshToken };
};

async function createUser(user) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = await User.create({
      ...user,
      password: hashedPassword,
    });
    const { token, refreshToken } = generateTokens(newUser);
    return { user: newUser, token, refreshToken };
  } catch (error) {
    throw new Error("ユーザーの追加中にエラーが発生しました。");
  }
}

async function updateUser(id, user) {
  try {
    await User.update(user, { where: { id } });
    const updatedUser = await User.findByPk(id);
    return updatedUser;
  } catch (error) {
    throw new Error("ユーザーの更新中にエラーが発生しました。");
  }
}

async function updatePost(id, post) {
  try {
    await Post.update(post, { where: { id } });
    const updatedPost = await Post.findByPk(id);
    if (!updatedPost) {
      const errorMessage = "更新する投稿が見つかりません。";
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
    return updatedPost;
  } catch (error) {
    throw new Error("投稿の更新中にエラーが発生しました。");
  }
}

async function deletePost(id) {
  try {
    const result = await Post.destroy({ where: { id } });
    if (result === 0) {
      const errorMessage = "削除する投稿が見つかりません。";
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
    return { message: "投稿は正常に削除されました" };
  } catch (error) {
    throw new Error("投稿の削除中にエラーが発生しました。");
  }
}

module.exports = { resolvers };
