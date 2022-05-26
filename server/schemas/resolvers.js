const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth')
const { User } = require('../models');

const resolvers = {
    Query: {
        me: async () => {
            return User.find({});
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError("No user found with the listed email address");
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }

            // If email and password are correct, use JWT to sign the user into the application
            const token = signToken(user)

            return { token, user }
        }
    }
}
