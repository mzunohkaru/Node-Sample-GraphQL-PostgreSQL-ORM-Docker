const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    userId: ID!
  }

  type Query {
    users: [User!]!
    posts: [Post!]!
    userById(id: ID!): User
    postById(id: ID!): Post
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): User!
    addPost(title: String!, content: String!, userId: ID!): Post!
  }
`;

module.exports = { typeDefs };
