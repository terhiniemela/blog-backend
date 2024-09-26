const bcrypt = require('bcrypt')
const { test, after, describe, beforeEach } = require('node:test')
const supertest = require('supertest')
const assert = require('node:assert')
const mongoose = require('mongoose')
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('../utils/test_helper')
const app = require('../app')

const api = supertest(app)
//...

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creating an user with too short password should fail', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'uniqueUser3585',
        name: 'uniqueName385',
        password: 'u'
    }

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password too short'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

  })
  test('post request without username and password should fail', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        name: 'uniqueName'
    }
    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('username/password missing'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

})

after(async () => {
    await mongoose.connection.close()
  })