import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.SECRET;

// Middleware to get user from JWT token
export const getUserFromToken = (req) => {
  const token = req.headers.authorization;
  if (token) {
      try {
          return jwt.verify(token, SECRET);
      } catch (err) {
          throw new Error('Session expired. Please login again.');
      }
  }
};