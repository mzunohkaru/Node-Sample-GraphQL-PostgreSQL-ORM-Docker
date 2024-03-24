const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    posts: [Post!]
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    userId: ID!
    user: User!
  }

  type AuthPayload {
    user: User!
    token: String!
    refreshToken: String!
  }

  type Message {
    message: String!
  }

  type Query {
    users: [User!]!
    posts: [Post!]!
    userById(id: ID!): User
    postById(id: ID!): Post
    login(email: String!, password: String!): AuthPayload!
    authenticatedUser: User
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): User!
    addPost(title: String!, content: String!, userId: ID!): Post!
    updatePost(id: ID!, title: String!, content: String!): Post!
    deletePost(id: ID!): Message!
  }
`;

module.exports = { typeDefs };
