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

const mostLikes = (blogs) => {
  var authors = []

  var a = 0
  var b = true
  var most = undefined
  blogs.forEach(blog => {
    b = true
    authors.forEach(author => {
      if(author.name === blog.author) {
        author.likes += blog.likes
        b = false
        if(most.likes < author.likes) {
          most = author
        }
        b = false
      } 
    })
    if(b) {
      authors[a] = {
        name: blog.author,
        likes: blog.likes
      }
      if(most === undefined) {
        most = authors[a]
      } else {
        if(most.likes < authors[a].likes) {
          most = authors[a]
        }
      }

      a++
    }

  })
  return most
  
}

const mostBlogs = (blogs) => {
  var authors = []

  var a = 0
  var b = true
  var most = undefined
  blogs.forEach(blog => {
    b = true
    authors.forEach(author => {
      if(author.name === blog.author) {
        author.blogs ++
        b = false
        if(most.blogs < author.blogs) {
          most = author
        }
        b = false
      } 
    })
    if(b) {
      authors[a] = {
        name: blog.author,
        blogs: 1
      }
      if(most === undefined) {
        most = authors[a]
      } else {
        if(most.blogs < authors[a].blogs) {
          most = authors[a]
        }
      }

      a++
    }

  })
  return most
  
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs
}