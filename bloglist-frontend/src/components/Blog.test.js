import React from 'react'
import 'jest-dom/extend-expect'
import { render, fireEvent, cleanup } from 'react-testing-library'
import Blog from './Blog'

afterEach(cleanup)



test('renders only title and author', () => {
  const user = {
    username: 'Pekka'
  }
  const blog = {
    title: 'Otsikko',
    author: 'kirjailija',
    url: 'www.osoite.fi',
    likes: 2,
    user: {
      username: 'Pekka'
    }
  }


  const component = render(
    <Blog blog={blog} user={user}/>
  )

  const div = component.container.querySelector('.blog')
  const div2 = component.container.querySelector('.bloginfo')
  expect(div).toHaveTextContent(
    'Otsikko kirjailija'
  )

  expect(div2).toHaveStyle('display: none')
})

test('renders everything after click', () => {
  const user = {
    username: 'Pekka96'
  }
  const blog = {
    title: 'Otsikko',
    author: 'kirjailija',
    url: 'www.osoite.fi',
    likes: 2,
    user: {
      username: 'Pekka96',
      name: 'Pekka'
    }
  }


  const component = render(
    <Blog blog={blog} user={user}/>
  )


  const div = component.container.querySelector('.blog')
  fireEvent.click(div)
  const div2 = component.container.querySelector('.bloginfo')
  expect(div2).toHaveTextContent(
    'www.osoite.fiTykkäykset: 2TykkääLisääjä: PekkaPoista'
  )

})