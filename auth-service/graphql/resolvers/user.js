import bcrypt from 'bcryptjs'
import User from '../../Models/User.js';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.SECRET;

export const userResolver = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated!');
      const me = await User.findById(user.id);
      return me;
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new GraphQLError('Username is taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      };

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      
      const token = jwt.sign({ id: newUser.id }, SECRET, { expiresIn: '1h' });
      
      return {
        token,
        user: newUser,
      };
    },

    login: async (_, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid login credentials');

        const valid = bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid login credentials');

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });

        return {
            token,
            user,
        };
    },
  },
};