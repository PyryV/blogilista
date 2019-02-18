const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  var total = 0;
  blogs.forEach(element => {
    total += element.likes
  });
  return total
}

const favoriteBlog = (blogs) => {
  var bestBlog
  blogs.forEach(blog => {
    if(bestBlog === undefined) {
      bestBlog = blog
    } else if (blog.likes > bestBlog.likes) {
      bestBlog = blog
    }
  })
  return bestBlog;
}

const mostBlogs = (blogs) => {
  var authors = []
  
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}