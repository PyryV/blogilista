import React from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'
import {
  // eslint-disable-next-line no-unused-vars
  Route, Link, Redirect, withRouter
} from 'react-router-dom'

const Blog = ({ blog, blogs, setBlogs, setErrorMessage, user }) => {


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

  if(blog === undefined) {
    return null
  }

  return (
    <div className="blog">
      <h2>{blog.title}</h2>
      Kirjoittaja: {blog.author}
      <div className="bloginfo">
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