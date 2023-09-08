import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import http from 'http';
import * as dotenv from 'dotenv';

// Internal files
import {typeDefs} from './graphql/typeDefs.js'
import connectDB from './MongoDB/connect.js';
import { getUserFromToken } from './utils/token.js';
import { userResolver } from './graphql/resolvers/user.js';

dotenv.config()

const server = new ApolloServer({
  typeDefs,
  resolvers: [userResolver]
});

await server.start();

const app = express();
const httpServer = http.createServer(app);

const MONGO_URL = process.env.MONGODB_AUTH_SERVICE_URL;

// await connectDB(MONGO_URL);

app.use(
  '/',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ user: getUserFromToken(req) }),
  }),
);



const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL || MONGO_URL);
  } catch (error) {
    console.log(error);
  }
  // app.listen(4000, () => console.log('Server has started on port http://localhost:4000'))
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/`);
}

startServer();