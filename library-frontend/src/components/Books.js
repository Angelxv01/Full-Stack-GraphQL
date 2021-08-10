import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const res = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState('')
  if (!props.show) {
    return null
  }

  if (res.loading) {
    return null
  }

  const books = res.data.allBooks
  const filteredBooks = filter
    ? books.filter((obj) => obj.genres.indexOf(filter) !== -1)
    : books
  const genres = books
    .reduce((acc, obj) => [...acc, ...obj.genres], [])
    .filter((obj, i, arr) => arr.indexOf(obj) === i)

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
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <select value={filter} onChange={({ target }) => setFilter(target.value)}>
        <option value="">Select an option</option>
        {genres.map((obj) => (
          <option value={obj} key={obj}>
            {obj}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Books
