const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

// initial blogs ready for the db
const initialBlogs = [
  {
      "title": "showering for all",
      "author": "dandruff",
      "url": "www.google.com",
      "likes": 54646
  },
  {
      "title": "Shrimp yelling at me that Grumbles asked for no tomato on his burger",
      "author": "haley",
      "url": "https://x.com/feederofcats/status/1820256929471676663?t=KEeoIVEDZmAnrJS4PVii1A&s=19",
      "likes": 10000000
  }
]

// let's empty the db first and then add the initial blogs to it
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('blog api tests', () => {

  // 4.8 test that there are two tests in the db after initializing it
  test('correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
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
    assert.strictEqual(response.body.length, initialBlogs.length+1)
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

  // post blog to db
 const response = await api
    .post('/api/blogs')
    .send(newTestBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  
  assert.strictEqual(response.body.likes, 0)
})

})

after(async () => {
  await mongoose.connection.close()
})