const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// initial blogs ready for the db
const initialBlogs = [
    {
        "_id": "670027a1e1b7bc2c6abb0281",
        "title": "showering for all",
        "author": "dandruff",
        "url": "www.google.com",
        "likes": 54646,
        "user": "6700275ae1b7bc2c6abb027d",
    },
    {
        "_id": "670027a1e1b7bc2c6abb0245",
        "title": "Shrimp yelling at me that Grumbles asked for no tomato on his burger",
        "author": "haley",
        "url": "https://x.com/feederofcats/status/1820256929471676663?t=KEeoIVEDZmAnrJS4PVii1A&s=19",
        "likes": 10000000,
        "user": "6700275ae1b7bc2c6abb027d"
    }
  ]

const initialUsers = [
    {
        "_id": "6700275ae1b7bc2c6abb027d",
        "username": "testuser",
        "name": "test tester",
        "passwordHash": null,
        "blogs": ["670027a1e1b7bc2c6abb0281", "670027a1e1b7bc2c6abb0245"]
    }
]

// this functions creates a token for test user
const testToken = async () => {

    // we need one test user from the database, and we are first initializing
    // the db with one user, so it should find the one that has been added
    const testUser = await oneUser()

    // token creation 

    const userForToken = {
        username: testUser.userName,
        id: testUser.id
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 }
    )
    console.log(token)

    // returning the token for the user in db
    return token

}

const nonExistingId = async () => {
    const blog = new Blog({"title":"asd", "author":"asdf", "url":"www.google.com"})
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

// returns all blogs from db
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

// returns all users from db 
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

// returns one user from db
const oneUser = async () => {
    const user = await User.findOne({})
    return user
}

module.exports = {
    initialBlogs, initialUsers, testToken, nonExistingId, blogsInDb, usersInDb, oneUser
}