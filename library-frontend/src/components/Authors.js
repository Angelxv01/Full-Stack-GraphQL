import { useQuery } from '@apollo/client'
import React from 'react'
import { ALL_AUTHORS } from '../queries'
import BirthForm from './BirthForm'

const Authors = (props) => {
  const res = useQuery(ALL_AUTHORS)
  if (!props.show || res.loading) {
    return null
  }

  const authors = res.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token && <BirthForm />}
    </div>
  )
}

export default Authors
