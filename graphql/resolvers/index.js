const usersResolvers = require('./users')
const quotesResolvers = require('./quotes')
const commentsResolvers = require('./comments')

module.exports = {

    Quote: {
        likeCount(parent) {
            return parent.likes.length
        },
        commentCount: (parent) => parent.comments.length
    },

    Query: {
        ...usersResolvers.Query,
        ...quotesResolvers.Query
    },

    Mutation: {
        ...usersResolvers.Mutation,
        ...quotesResolvers.Mutation,
        ...commentsResolvers.Mutation,
    }
}