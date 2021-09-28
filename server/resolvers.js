const { v4 } = require("uuid");
const { PubSub } = require("graphql-subscriptions");
const { subscribe } = require("graphql");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    chats: (parent, args, ctx) => ctx.chats,
  },
  Mutation: {
    addChat: (parent, args, ctx) => {
      const { chats } = ctx;
      const { userID1, userID2, sender, message } = args;
      const now = new Date().toString()
      const newMessage = {
        id: v4(),
        userID1,
        userID2,
        sender,
        message,
        timestamp: now,
      };
      pubsub.publish("CHAT_ADDED", { newChat: {...newMessage} });
      chats.push(newMessage);
      return newMessage;
    },
  },
  Subscription: {
    newChat: {
      subscribe: (parent, args, context) => {
        console.log('subscribe')
        return pubsub.asyncIterator(["CHAT_ADDED"])}
    }
  }
};

module.exports = resolvers;
