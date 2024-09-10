const { test, describe } = require('node:test')
const assert = require('node:assert')
const _ = require('lodash')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
  id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger',
  url: 'www.google.com',
  likes: 5,
}]

const listWithManyBlogs = [
  {
    id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  },
  {
    id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0
  },
  {
    id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }  
]


// 4.3 test that dummy function returns 1 
test('dummy returns one', () => {
        const result = listHelper.dummy([])
        assert.strictEqual(result, 1)
      })


// 4.4 tests for blogs 
describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result,0)
  })
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result,5)
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result,36)
  })
})

// 4.5. more tests for blogs
describe('favorite blog', () => {
  test('blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    const mostLiked = 
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    assert.deepStrictEqual(result, mostLiked)
  })
})

// 4.6. more tests, installed lodash
// mostBlogs figures out the writer with most blogs in the parameter array
describe('writer with most blogs', () => {
  test('most blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)
    const correctResult = {
        author: "Robert C. Martin",
        blogs: 3
      }
    assert.deepStrictEqual(result, correctResult)
  })
  test('most likes for author', () => {
    const result = listHelper.mostLikes(listWithManyBlogs)
    const correctResult = 
    {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    assert.deepStrictEqual(result, correctResult)
  })
})


