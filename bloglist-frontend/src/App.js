import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import BlogForm from './components/BlogForm'
import  { useField } from './hooks/'
import {
  BrowserRouter as Router,
  // eslint-disable-next-line no-unused-vars
  Route, Link, Redirect, withRouter
} from 'react-router-dom'
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

const Blogs = (props) => {
  const sorting = (a, b) => {
    if(a.likes > b.likes) {
      return -1
    }
    if(a.likes < b.likes) {
      return 1
    }
    return 0
  }

  return (
    <div className="blogs">

      {props.blogs.sort(sorting).map(blog =>
        <div key={blog.id}>
          <Link className="links" to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      )}
    </div>
  )

}

const User = ({ user }) => {
  if(user === undefined) {
    return null
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Lisätyt blogit: </h3>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>

    </div>
  )

}

const Users = ({ users }) => {
  const sorting = (a,b) => {
    if(a.blogs.length > b.blogs.length) return -1
    if(a.blogs.length < b.blogs.length) return 1
    return 0
  }

  return (
    <div>
      <h2>Users</h2>
      {users.sort(sorting).map(user =>
        <div key={user.id}>
          <Link className="links" to={`/users/${user.id}`}>
            {user.name} {user.blogs.length}
          </Link>
        </div>
      )}
    </div>
  )
}

const Menu = ({ user, logout }) => {
  return (
    <div className="menu">
      <Link className="menuLinks" to="/">Blogit </Link>
      <Link className="menuLinks" to="/users">Käyttäjät </Link>
      {user.name} on kirjatuneena
      <button className="logoutButton" onClick={() => logout()}>kirjaudu ulos</button>
    </div>
  )
}



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
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
    userService.getAll().then(users =>
      setUsers( users )
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

  const userById = (id) => users.find(u => u.id === id)
  const blogById = (id) => blogs.find(b => b.id === id)

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
    <div className="blogApp">
      <h2 className="header">Blogit</h2>
      <Success message={message}/>


      <Router>
        <div>
          <Menu logout={logout} user={user}/>
          <Route exact path="/" render={() =>
            <div>
              <Blogs
                blogs={blogs}
                setBlogs={setBlogs}
                setErrorMessage={setErrorMessage}
                user={user}
              />
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
            </div>
          } />
          <Route exact path = "/users" render={() =>
            <Users users={users}/>
          } />
          <Route exact path="/users/:id" render={({ match }) =>
            <User user={userById(match.params.id)}/>
          }/>
          <Route exact path="/blogs/:id" render={({ match }) =>
            <Blog
              blog={blogById(match.params.id)}
              blogs={blogs}
              setBlogs={setBlogs}
              setErrorMessage={setErrorMessage}
              user={user}
            />
          }/>
        </div>
      </Router>

    </div>
  )
}

export default App