import React from 'react'
import 'jest-dom/extend-expect'
import { render, fireEvent, cleanup } from 'react-testing-library'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

test('renders title', () => {
  const blog = {
    title: 'Otsikko',
    author: 'kirjailija',
    url: 'www.osoite.fi',
    likes: 2
  }

  const component = render(
    <SimpleBlog blog={blog}/>
  )

  const div = component.container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Otsikko kirjailija'
  )

  const div2 = component.container.querySelector('.likes')
  expect(div2).toHaveTextContent(
    'blog has 2'
  )
})

test('likes are counted right', async () => {
  const blog = {
    title: 'Otsikko',
    author: 'kirjailija',
    url: 'www.osoite.fi',
    likes: 2
  }

  const mockHandler = jest.fn()
  const { getByText } = render(
    <SimpleBlog blog={blog} onClick={mockHandler}/>
  )

  const button = getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)
  expect(mockHandler.mock.calls.length).toBe(2)

})