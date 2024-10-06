const Blog = require('../models/blog')
const User = require('../models/user')

// initial blogs ready for the db
const initialBlogs = [
    {
        "id": "670027a1e1b7bc2c6abb0281",
        "title": "showering for all",
        "author": "dandruff",
        "url": "www.google.com",
        "likes": 54646,
        "user": "6700275ae1b7bc2c6abb027d"
    },
    {
        "title": "Shrimp yelling at me that Grumbles asked for no tomato on his burger",
        "author": "haley",
        "url": "https://x.com/feederofcats/status/1820256929471676663?t=KEeoIVEDZmAnrJS4PVii1A&s=19",
        "likes": 10000000,
        "user": "6700275ae1b7bc2c6abb027d"
    }
  ]


const nonExistingId = async () => {
    const blog = new Blog({"title":"asd", "author":"asdf", "url":"www.google.com"})
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb,
}