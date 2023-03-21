const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { GraphQLError } = require('graphql')


// importing model 
const User = require('../../models/User')

// validation 
const {validateregisterInput, validateLoginInput} = require('../../util/validation')

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
    }, process.env.SECRET_KEY, {expiresIn: '2h'})
}

module.exports = {
    Mutation: {
        register: async (_, {registerInput: {name, username, email, password, confirmPassword}}) => {
            
            // Validate data 
            const {errors, valid} = validateregisterInput(name, username, email, password, confirmPassword)
            if(!valid) {
                throw new GraphQLError('Errors', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors
                    }
                })
            }
            // Check if a user exist 
            // const user = await User.findOne({ $or: [{ username }, { email }] })
            // // const user = await User.findOne({username})
            // if(user) {
            //     throw new GraphQLError('Errors', {
            //         extensions: {
            //             code: 'BAD_USER_INPUT',
            //             errors: {
            //                 username: "Username is taken",
            //                 email: "Email already existed"
            //             }
            //         }
            //     })
            // }
            const usernameTaken = await User.findOne({ username })
            const emailTaken = await User.findOne({ email })

            if (usernameTaken && emailTaken) {
                throw new GraphQLError('Errors', {
                    extensions: {
                    code: 'BAD_USER_INPUT',
                    errors: {
                        username: 'Username is taken',
                        email: 'Email already exists',
                    },
                },
            })
            } else if (usernameTaken) {
                throw new GraphQLError('Errors', {
                    extensions: {
                    code: 'BAD_USER_INPUT',
                    errors: {
                        username: 'Username is taken',
                    },
                },
            })
            } else if (emailTaken) {
                throw new GraphQLError('Errors', {
                    extensions: {
                    code: 'BAD_USER_INPUT',
                    errors: {
                        email: 'Email already exists',
                    },
                },
            })
            }


            // hash password
            password = await bcrypt.hash(password, 12)

            // Create user and save
            const newUser = new User({
                name,
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()

            // generate token 
            const token = generateToken(res)

            // return data 
            return {
                ...res._doc,
                id: res.id,
                token
            }
        }, 
        login: async (_,{username, password}) => {
            const {errors, valid} = validateLoginInput(username, password)

            if(!valid) {
                throw new GraphQLError('Errors', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors
                    }
                })
            }

            // check if user exist 
            // Convert the username to lowercase to ensure case-insensitive matching
            const lowercaseUsername = username.toLowerCase()
            const user = await User.findOne({username: lowercaseUsername})

            if(!user) {
                errors.general = 'User not found'
                throw new GraphQLError('Errors', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors
                    }
                })
            }

            // Check password 
            const match = await bcrypt.compare(password, user.password)

            if(!match) {
                errors.general = 'Wrong Credentials'
                throw new GraphQLError('User not found', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors
                    }
                })
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user.id,
                token
            }
        }
    }
}