import { useQuery } from '@apollo/client'
import React from 'react'
import { ALL_BOOKS, ME } from '../queries'

const Recommendation = (props) => {
  const me = useQuery(ME)
  const books = useQuery(ALL_BOOKS)
  if (me.loading || books.loading || !props.show || !me.data.me) {
    return null
  }

  const genre = me.data.me.favoriteGenre
  const recommended = books.data.allBooks.filter(
    (obj) => obj.genres.indexOf(genre) !== -1
  )

  return (
    <div>
      <h1>recommendation</h1>
      books in your favorite genre {genre}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommended.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendation
