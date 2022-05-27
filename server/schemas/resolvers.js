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
        },
        addUser: async (parent, {username, email, password}) => {
            const user = await User.findOne({username}, { email });

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
        },
        // saveBook: async (parent, { authors, description, title, bookId, image, link }) => {
        //     return User.findOneAndUpdate(
        //         { _id: bookId },
        //     )
        // },
        removeBook: async (parent, { bookId }) => {
            return User.findOneAndDelete({bookId})
        }
    }
};

moduel.exports = resolvers;
