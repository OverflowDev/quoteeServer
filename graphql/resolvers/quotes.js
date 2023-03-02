const { GraphQLError } = require('graphql')
const Quote = require('../../models/Quote')

const checkAuth = require('../../util/check-auth')

module.exports = {
    Query: {
        getQuotes: async () => {
            try {
                const quotes = await Quote.find().sort({createdAt: -1})
                return quotes
            } catch (error) {
                throw new Error(error)
            }
        }, 
        getQuote: async (_, {quoteId}) => {
            try {
                const quote = await Quote.findById(quoteId)

                if(quote) {
                    return quote
                } else {
                    throw new Error('Quote not found')
                }
            } catch(error) {
                throw new Error(error)
            }
        }
    }, 

    Mutation: {
        createQuote: async (_, {body}, context) => {
            const user = checkAuth(context)

            if(body.trim() === '') {
                throw new Error('Quote body must not be empty')
            }

            const newQuote = new Quote({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const quote = await newQuote.save()

            return quote
        },
        deleteQuote: async (_, {quoteId}, context) => {
            const user = checkAuth(context)

            try {
                const quote = await Quote.findById(quoteId)
                if(user.username === quote.username) {
                    await quote.delete()
                    return quote
                } else {
                    throw new GraphQLError('Actions not allowed', {
                        extensions: {
                            code: 'GRAPHQL_VALIDATION_FAILED',
                            error
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }, 
        likeQuote: async (_, {quoteId}, context) => {
            const {username} = checkAuth(context)
            
            const quote = await Quote.findById(quoteId)
            if(quote) {

                if(quote.likes.find(like => like.username === username)){
                    // quote already liked - unlike the quote 
                    quote.likes = quote.likes.filter(like => like.username !== username)
                } else {
                    // not a liked post 
                    quote.likes.push({
                        username, 
                        createdAt: new Date().toISOString()
                    })
                }

                await quote.save()
                return quote

            } else {
                throw new GraphQLError('Quote not found', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
        }
    }
}