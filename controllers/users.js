const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {

  if(request.body.username && request.body.password) {
    if(request.body.username.length < 3 || request.body.password.length < 3) {
      return response.status(400).json({ exception: 'username and password must be at least 3 characters' })
    }

  } else {
    return response.status(400).json({ exception: 'user must have username and password'})
  }

  try {
    const body = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1, id: 1})
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter