const { ApolloServer } = require("apollo-server");

// types
const { typeDefs } = require("./schema");

// resolvers
const { resolvers } = require("./resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

// サーバーを起動
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
