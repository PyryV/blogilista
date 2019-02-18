const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

const blogs = [
  {
    title: "Testiblogi",
    author: "Testbloggaaja",
    url: "www.testiosoite.fi",
    likes: 1
  },
  {
    title: "Toinen testiblogi",
    author: "Testibloggaaja 2",
    url: "www.testiosoite2.fi",
    likes: 2
  }

]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(blogs[0])
  await blogObject.save()

  blogObject = new Blog(blogs[1])
  await blogObject.save()
})

test('all blogs are returned', async() => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(blogs.length)
})

test('id name is id not _id', async() => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('posting blog works', async() => {
  const newBlog =   {
    title: "Postattava blogi",
    author: "Pekka Postpyyntö",
    url: "www.postaus.fi",
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(3)
})

test('undefined likes is turnt into 0 likes', async() => {
  const newBlog =   {
    title: "Postattava blogi",
    author: "Pekka Postpyyntö",
    url: "www.postaus.fi"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')

  expect(response.body[2].likes).toBe(0)  

})

test('undefined title and url returns 400', async() => {
  const newBlog =   {
    author: "Pekka Postpyyntö",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})



