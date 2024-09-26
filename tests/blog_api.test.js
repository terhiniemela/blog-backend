const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const helper = require('../utils/test_helper')

const api = supertest(app)

// let's empty the db first and then add the initial blogs to it
// edit: better format for adding many blogs
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('blog api tests', () => {

  // 4.8 test that there are two tests in the db after initializing it
  test('correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  // 4.9 test checks if the identifier property is 'id' instead of default '_id
  test('correct id for blog', async () => {
    const response = await api.get('/api/blogs')
    // this works assuming there are blogs available in the db, but
    // in this case it seems to be reasonable to check if there is
    // a blog object with property named id
    const testForId = response.body.some(blog => blog.hasOwnProperty('id'))
    // should be true if there's a id property 
    assert.strictEqual(testForId, true)
      
  })
  
  // 4.10 checks that post request adds the blog to the db
  test('succesful blog post with post request', async () => {
    const newBlog = { 
      title: "I was freakin forgor part 35835",
      author: "Juje",
      url: "https://x.com/goodgirljuliee/status/1821857840492933293",
      likes: 5 
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    // let's check that there's a new blog post in db
    assert.strictEqual(response.body.length, helper.initialBlogs.length+1)
  })

// 4.11. if there is no likes value in the post request, it should be zero.
// lets test that
test('post request without likes argument has the value 0 for likes', async() => {
  
  // a new test blog without argument likes
  const newTestBlog = {
    title: "I was freakin forgor again",
    author: "Clee",
    url: "http://www.ggoogle.com/cleememoir"
  }

  logger.info(newTestBlog)

  // post blog to db
 const response = await api
    .post('/api/blogs')
    .send(newTestBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  
  assert.strictEqual(response.body.likes, 0)
})

// 4.12 post request should return 400 if title or url is missing
test('post should return 400 if title or url missing', async() => {

    const testBlogWithoutTitle = {
      author: "Juje"
    }

    const response = await api 
      .post('/api/blogs')
      .send(testBlogWithoutTitle)
      .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.status, 400)
})

// 4.13 test that blog can be deleted
test('test that blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api 
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map(r => r.title)
  assert(!contents.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length-1)
})

// 4.14 test that you can edit a blog
test('test that blog can be edited', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToEdit = blogsAtStart[0]

  const replacingBlog = {
    "title": "sleeping in a cat condo",
    "author": "dandruff",
    "url": "www.google.com",
    "likes": 1022222
}

 const response =  await api
    .put(`/api/blogs/${blogToEdit.id}`)
    .send(replacingBlog)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map(r => r.title)
  assert(contents.includes(replacingBlog.title))

  assert.strictEqual(response.status, 200)

})

})

after(async () => {
  await mongoose.connection.close()
})