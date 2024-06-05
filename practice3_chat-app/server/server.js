import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { readFile } from "node:fs/promises";
import { authMiddleware, decodeToken, handleLogin } from "./auth.js";
import { resolvers } from "./resolvers.js";
import { WebSocketServer } from "ws";
import { createServer as createHttpServer } from "node:http";
import { useServer as useWsServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

const PORT = 9000;

const app = express();
app.use(cors(), express.json());

app.post("/login", handleLogin);

function setContext({ req }) {
  if (req.auth) {
    return { user: req.auth.sub };
  }
  return {};
}

function setWsContext({ connectionParams }) {
  console.log("[setWsContext] connectionParams", connectionParams);
  const accessToken = connectionParams?.accessToken;
  if (accessToken) {
    const user = decodeToken(accessToken);
    return { user: user.sub };
  }
  return {};
}

const typeDefs = await readFile("./schema.graphql", "utf8");
const schema = makeExecutableSchema({ typeDefs, resolvers });
const apolloServer = new ApolloServer({ schema });
await apolloServer.start();
app.use(
  "/graphql",
  authMiddleware,
  apolloMiddleware(apolloServer, {
    context: setContext,
  })
);

const httpServer = createHttpServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
useWsServer({ schema, context: setWsContext }, wsServer);

httpServer.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
