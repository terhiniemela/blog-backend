const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

// reformatted to async
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {blogs: 0})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)

  const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    }
    else {
      response.status(404).end()
    }
})

// formatted to async
blogRouter.post('/', async (request, response, next) => {
    const body = request.body

    if ((body.title || body.url) === undefined ) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    // const user = await User.findById(body.userId)
    // temporary way to assign user for a blog
    const user = await User.findOne({})
    //const id = new mongoose.Types.ObjectId(user._id)

    //logger.info(id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

  })

// formatted to async
blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog)
})

module.exports = blogRouter