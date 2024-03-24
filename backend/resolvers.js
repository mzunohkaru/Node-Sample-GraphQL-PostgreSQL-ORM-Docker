const User = require("./models/user");
const Post = require("./models/post");
const bcrypt = require("bcryptjs");

const resolvers = {
  Query: {
    users: async () => await User.findAll(),
    posts: async () => await Post.findAll(),
    userById: async (parent, args, context, info) => await User.findByPk(args.id),
    postById: async (parent, args, context, info) => await Post.findByPk(args.id),
  },
  Mutation: {
    addUser: async (_, { name, email, password }) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ name, email, password: hashedPassword });
      return user;
    },
    addPost: async (_, { title, content, userId }) => {
      const post = await Post.create({ title, content, userId });
      return post;
    },
  },
  // User: {
  //   posts: async (user) => await user.getPosts(),
  // },
  // Post: {
  //   user: async (post) => await post.getUser(),
  // },
};

module.exports = { resolvers };
