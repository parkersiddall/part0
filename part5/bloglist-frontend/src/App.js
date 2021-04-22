import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [ notif, setNotif ] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Logging in with', username, password)

    try {
    const user = await loginService.login({username, password})
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    ) 
    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
    } catch (exception) {
      setNotif(
        {
          message: 'Login failed.',
          style: 'errorMessage'
        })
      setTimeout(() => {
        setNotif(null)
      }, 5000)
    }
  }

  //logout handler
  const handleLogout = () => {
    console.log('You are now logged out.')
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleNewPost = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: title, 
      author: author, 
      url: url
    }

    try {
      const user = await blogService.addPost(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotif(
        {
          message: 'Blog added successfully!',
          style: 'successMessage'
        })
      setTimeout(() => {
        setNotif(null)
      }, 5000)
      } catch (exception) {
        setNotif(
          {
            message: `Error adding blog! ${exception}`,
            style: 'errorMessage'
          })
        setTimeout(() => {
          setNotif(null)
        }, 5000)
      }
  }

  if (user === null) {
    return (
      <div>
        <Notification notification={notif}/>
        <h2>blogs</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input type='text' 
              value={username} 
              name='username' 
              onChange={({target}) => setUsername(target.value)}
              />
          </div>
          <div>
            password
            <input
            type='password'
            value={password}
            name='password'
            onChange = {({target}) => setPassword(target.value)} 
            />
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notif}/>
      <b>
        You are logged in as {user.username}
      </b>
      <button onClick={handleLogout}>Logout</button>
      <h2>blogs</h2>  
      <form onSubmit={handleNewPost}>
        <div>
          title
            <input type='text' 
            value={title} 
            name='title' 
            onChange={({target}) => setTitle(target.value)}
            />
        </div>
        <div>
          author
          <input
          type='text'
          value={author}
          name='author'
          onChange = {({target}) => setAuthor(target.value)} 
          />
        </div>
        <div>
          url
          <input
          type='url'
          value={url}
          name='url'
          onChange = {({target}) => setUrl(target.value)} 
          />
        </div>
        <button type='submit'>Add post</button>
      </form>
      {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App