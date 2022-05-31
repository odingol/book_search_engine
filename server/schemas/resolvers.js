const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth')
const { User } = require('../models');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError("User must be logged in!");
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
        saveBook: async (parent, { authors, description, title, bookId, image, link }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id },
                    { $push: {savedBooks: authors, description, title, bookId, image, link }},
                    {new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("User needs to be logged in!");
        },
        removeBook: async (parent, { bookId }, context ) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id },
                    { $pull: { saveBooks: { bookId }}},
                    { new: true }
                );
                return updatedUser;
            } 
            throw new AuthenticationError("User needs to be logged in!");
        }
    }
};

moduel.exports = resolvers;
