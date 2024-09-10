const _ = require('lodash')

const dummy = (blogs) => {
    return 1;
  }

const totalLikes = (array) => {
    const reducer = (accumulator, blog) => {
      return accumulator + blog.likes
    }
    return array.length === 0
    ? 0
    : array.reduce(reducer,0)
 }

 // figuring out which blog has most likes
 const favoriteBlog = (array) => {
    const mostLikes = (accumulator, blog) => {
      return accumulator.likes > blog.likes ? accumulator : {title: blog.title, author: blog.author, likes: blog.likes}
    }
    return array.length === 0
    ? 0
    : array.reduce(mostLikes,0)
 }

 const mostBlogs = (array) => {
    // count how many blogs authors have in the array. using countby to find out the number of blogs for
    // each writer and then naming key-value-pairs with map
    const countBlogs = _.map(_.countBy(array, 'author'), (number, name) => ({author: name, blogs: number}))
    // check the biggest number of blogs with maxby 
    const authorWithMostBlogs = _.maxBy(countBlogs, 'blogs')
              
    return authorWithMostBlogs
 }

 
 // figuring out writer with most likes in all blogs
 const mostLikes = (array) => {
    // first, group array by authors as key-value pairs containing first author and then blog data object
    const groupedAuthors = _.groupBy(array, 'author')
    // then we map the values grouped authors and sum those likes
    const countLikes = _.mapValues(groupedAuthors, (author) => _.sumBy(author, 'likes'))
    // picking the most liked author with maxby and formatting result data
    const mostLikedAuthor = _.maxBy(_.map(countLikes, (number, name) => ({author: name, likes: number})), 'likes')
    return mostLikedAuthor
    
 }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }