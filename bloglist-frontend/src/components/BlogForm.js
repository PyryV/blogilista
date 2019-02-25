import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'
import '../index.css'



const BlogForm = ({ blogs, setBlogs, setErrorMessage, setMessage, setCreateVisible }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService
      .create(blog).then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`Uusi blogi ${returnedBlog.title} lisätty`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setCreateVisible(false)
      })
      .catch(error => {
        setErrorMessage(error)
        setTimeout(() => {
          setErrorMessage(error)
        }, 5000)
      })
  }

  return (
    <form onSubmit={addBlog}>
      <h2>Lisää uusi blogi</h2>
      <div>
        Otsikko
        <input
          type="text"
          value={newTitle}
          name="newTitle"
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        Kirjoittaja
        <input
          type="text"
          value={newAuthor}
          name="newAuthor"
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        URL
        <input
          type="text"
          value={newUrl}
          name="newUrl"
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">tallenna</button>
    </form>
  )
}

BlogForm.propTypes = {
  blogs: PropTypes.array.isRequired
}
export default BlogForm