const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Chat {
    id: ID!
    userID1: ID!
    userID2: ID!
    sender: String!
    message: String!
    timestamp: String!
  }

  type Query {
    chats: [Chat]
  }

  type Mutation {
    addChat(userID1: ID!, userID2: ID!, sender: String!, message: String!): Chat
  }

  type Subscription {
    newChat: Chat
  }
`;

module.exports = typeDefs;
