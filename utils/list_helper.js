/*const dummy = (blogs) => {
    return 1;
  }
    */

const totalLikes = (array) => {
    const countedLikes = array.reduce((accumulator, blog) => accumulator + blog.likes, 0)
    console.log(countedLikes)
    return countedLikes 
  }
    
    /*
    return array.length === 0
    ? 0
    : array.reduce(reducer,0)
    */

  
  module.exports = {
    //dummy,
    totalLikes
  }