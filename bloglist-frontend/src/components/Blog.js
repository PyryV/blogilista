import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, blogs, setBlogs, setErrorMessage, user }) => {
  const[showFull, setShowFull] = useState(false)

  const showFullInfo = { display: showFull ? '' : 'none' }


  const visibility = () => {
    if(showFull) {
      setShowFull(false)
    } else {
      setShowFull(true)
    }
  }

  const visibleuser = () => {
    if(blog.user !== undefined) {
      return (
        <p>
          Lisääjä: {blog.user.name}
        </p>
      )
    }
    return (null)
  }

  const removeButton = () => {
    if(user.username === blog.user.username) {
      return (
        <button onClick={() => handleRemove(blog.id)}>Poista</button>
      )
    }

    return null
  }

  const addLike = id => {
    const blog = blogs.find(b => b.id ===id)
    console.log(`tykkäys lisätty blogille ${blog.title}`)
    const changedBlog = { ...blog, likes: blog.likes+1 }
    blogService
      .update(changedBlog).then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(() => {
        setErrorMessage(`Blogi '${blog.title}' on jo poistettu palvelimelta`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })
  }

  const handleRemove = id => {
    const blog = blogs.find(b => b.id ===id)
    if(window.confirm(`Haluatko varmasti poistaa blogin ${blog.title}?`)) {
      blogService
        .remove(id)
        .catch(() => {
          setErrorMessage(`${blog.name} on jo poistettu`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
        })
      blogService
        .getAll()
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
        .catch(error => {
          setErrorMessage(error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
        })
    }

  }

  return (
    <div className="blog" onClick={() => visibility()}>
      {blog.title} {blog.author}
      <div className="bloginfo" style={showFullInfo}>
        <p>{blog.url}</p>
        <p>
          Tykkäykset: {blog.likes}
          <button onClick={() => addLike(blog.id)}>Tykkää</button>
        </p>
        {visibleuser()}
        {removeButton()}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired
}

export default Blog