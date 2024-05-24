import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleWare } from "@apollo/server/express4";
import { readFile } from "node:fs/promises";
import { resolvers } from "./resolvers.js";
import { getUser } from "./db/users.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

//! apollo server

async function setContext({ req }) {
  console.log('[setContext] req.auth', req.auth);
  if (!req.auth) return {};
  const auth = await getUser(req.auth.sub);
  return { auth };
}

const typeDefs = await readFile("./schema.graphql", "utf-8");

const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use("/graphql", apolloMiddleWare(apolloServer, { context: setContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQl endpoint is in http://localhost:${PORT}/graphql`);
});
