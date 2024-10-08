const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/test_helper')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({}).populate('blogs')
    response.json(users)
  })

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!request.body.username || !request.body.password === undefined ) {
    return response.status(400).json({ error: 'username/password missing' })
  }

  else if (password.length < 3) {
    return response.status(400).json({error: 'password too short'})
  }

  const users = await helper.usersInDb()
  
  if (users.includes(username)) {
    return response.status(400).json({error: 'username not unique'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)

  
  usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({}).populate('blogs')
    response.json(users)
  })
})

module.exports = usersRouter