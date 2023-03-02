
const typeDefs = `

    type Quote {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }

    type Comment {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }
    
    type Like {
        id: ID!
        username: String!
        createdAt: String!
    }

    type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        token: String!
        createdAt: String!
    }

    input RegisterInput {
        name: String!
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    type Query {
        getQuotes: [Quote]
        getQuote(quoteId: ID!): Quote
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!

        createQuote(body: String!): Quote!
        deleteQuote(quoteId: ID!): Quote!
        likeQuote(quoteId: ID!): Quote!

        createComment(quoteId: ID!, body: String!): Quote!
        deleteComment(quoteId: ID!, commentId: ID!): Quote!
    }
`

module.exports = typeDefs
