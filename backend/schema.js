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
    addUser(user: UserInput!): AuthPayload!
    updateUser(id: ID!, user: UpdateUserInput!): User!
    addPost(post: PostInput!): Post!
    updatePost(id: ID!, post: UpdatePostInput!): Post!
    deletePost(id: ID!): Message!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String!
  }

  input PostInput {
    title: String!
    content: String!
    userId: ID!
  }

  input UpdatePostInput {
    title: String!
    content: String!
  }
`;

module.exports = { typeDefs };
