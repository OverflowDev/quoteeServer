const Quote = require("../../models/Quote")
const checkAuth = require("../../util/check-auth")

const { GraphQLError } = require('graphql')

module.exports = {

    Mutation: {
        createComment: async (_, {quoteId, body}, context) => {
            const {username} = checkAuth(context)

            if(body.trim() === '') {
                throw new GraphQLError('Empty Comment', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        body: 'Comment body must not be empty'
                    }
                })
            }

            const quote = await Quote.findById(quoteId)

            if(quote) {
                quote.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })

                await quote.save()
                return quote
            } else {
                throw new GraphQLError('Quote not found')
            }
        }, 
        deleteComment: async (_, {quoteId, commentId}, context) => {
            
            const {username} = checkAuth(context)

            const quote = await Quote.findById(quoteId)

            if(quote) {
                const commentIndex = quote.comments.findIndex(c => c.id === commentId)
                if(quote.comments[commentIndex].username === username){
                    quote.comments.splice(commentIndex, 1)
                    await quote.save()
                    return quote
                } else {
                    throw new GraphQLError('Action not allowed', {
                        extensions: {
                            code: 'GRAPHQL_VALIDATION_FAILED',
                        }
                    })
                }
            } else {
                throw new GraphQLError('Post not found', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
        }
    }
}