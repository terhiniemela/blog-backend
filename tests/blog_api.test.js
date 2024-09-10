const { test, after, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')

const api = supertest(app)

describe('blog api tests', () => {
  /*
  test('correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 7)
  })
*/
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
  
  test('succesful blog post with post request', async () => {
    const newBlog = { 
      title: "I was freakin forgor",
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
    

  })

})



after(async () => {
  await mongoose.connection.close()
})