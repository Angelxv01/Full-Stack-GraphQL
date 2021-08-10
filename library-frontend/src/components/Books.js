import { useLazyQuery, useQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  // use this only once to mantain the state of genres
  const allBooks = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState([])

  const [show, setShow] = useState([])
  const [getBooks, books] = useLazyQuery(ALL_BOOKS)

  const showBooks = (name) => {
    getBooks({ variables: { genre: name } })
  }

  useEffect(() => {
    if (allBooks.data) {
      const genres = allBooks.data.allBooks
        .reduce((acc, obj) => [...acc, ...obj.genres], [])
        .filter((obj, i, arr) => arr.indexOf(obj) === i)
      setGenre(genres)
    }
  }, [allBooks])

  useEffect(() => {
    if (books.data) {
      setShow(books.data.allBooks)
    }
  }, [books])

  if (books.loading || !props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {show.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {genre.map((obj) => (
        <button onClick={({ target }) => showBooks(obj)} key={obj}>
          {obj}
        </button>
      ))}
    </div>
  )
}

export default Books
