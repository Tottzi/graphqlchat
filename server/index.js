const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { PubSub } = require("graphql-subscriptions");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const servers = async () => {
  const chats = [
    {
      id: "ff1ebcb5-5af8-4cf4-865f-2bfd5d99bb91",
      userID1: "Adam",
      userID2: "John",
      sender: "Adam",
      message: "First chat message",
      timestamp:
        "Mon Sep 27 2021 10:42:59 GMT+0200 (sentraleuropeisk sommertid)",
    },
    {
      id: "da5245bf-dd54-4bc7-a9db-1f0b57e5d928",
      userID1: "John",
      userID2: "Adam",
      sender: "John",
      message: "Second chat message",
      timestamp:
        "Mon Sep 27 2021 10:43:51 GMT+0200 (sentraleuropeisk sommertid)",
    },
  ];
  const cors = require("cors");
  const app = express();
  app.use(
    cors({
      origin: "*",
    })
  );
  const httpServer = createServer(app);
  const pubsub = new PubSub();
  const context = { chats };
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    cors: {
      origin: "*",
    },
    schema,
    context,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  const subscriptionServer = SubscriptionServer.create(
    {
      // This is the `schema` we just created.
      schema,
      // These are imported from `graphql`.
      execute,
      subscribe,
    },
    {
      // This is the `httpServer` we created in a previous step.
      server: httpServer,
      // This `server` is the instance returned from `new ApolloServer`.
      path: server.graphqlPath,
    }
  );

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
};

servers();
