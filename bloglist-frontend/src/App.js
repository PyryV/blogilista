import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import  { useField } from './hooks/'
import './index.css'

const Success = ({ message }) => {
  if(message === null) {
    return null
  }
  return (
    <div className="success">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if(message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}





const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [createVisible, setCreateVisible] = useState(false)
  const username = useField('text')
  const password = useField('password')

  const hideWhenVisible = { display: createVisible ? 'none' : '' }
  const showWhenVisible = { display: createVisible ? '' : 'none' }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = (event) => {
    event.preventDefault()
    const creditentials = {
      username: username.value,
      password: password.value
    }
    loginService
      .login(creditentials).then(user => {
        window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(user)
        )
        blogService.setToken(user.token)
        setUser(user)
        username.reset()
        password.reset()
        setMessage('Sisäänkirjautuminen onnistui')
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch (() => {
        setErrorMessage('Käyttäjätunnus tai salasana virheellinen!')
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })
  }

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
    setMessage('Kirjauduit ulos')
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }


  const sorting = (a, b) => {
    if(a.likes > b.likes) {
      return -1
    }
    if(a.likes < b.likes) {
      return 1
    }
    return 0
  }




  if(user === null) {
    return (
      <div>
        <form id='login' onSubmit={handleLogin}>
          <Error message={errorMessage}/>
          <Success message={message}/>
          <br/>
          Käyttäjätunnus
          <input {...username} reset=''/>
          <br/>
          Salasana
          <input {...password} reset=''/>
          <br/>
          <button type="submit">kirjaudu sisään</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Success message={message}/>
      <div style={hideWhenVisible}>
        <button onClick={() => setCreateVisible(true)}>Lisää uusi blogi</button>
      </div>
      <div style={showWhenVisible}>
        <BlogForm
          blogs={blogs}
          setBlogs={setBlogs}
          setErrorMessage={setErrorMessage}
          message={message}
          setMessage={setMessage}
          setCreateVisible={setCreateVisible}
        />
      </div>
      <h2>Blogit</h2>
      <p>{user.name} on kirjatuneena</p>
      <button onClick={() => logout()}>kirjaudu ulos</button>
      {blogs.sort(sorting).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          blogs={blogs}
          setBlogs={setBlogs}
          setErrorMessage={setErrorMessage}
          user={user}
        />
      )}
    </div>
  )
}

export default App