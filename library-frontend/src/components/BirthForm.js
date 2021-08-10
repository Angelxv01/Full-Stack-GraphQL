import { useMutation, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const BirthForm = () => {
  const res = useQuery(ALL_AUTHORS).data.allAuthors
  const defaultSelect = res[0] || { name: '' }
  const [author, setAuthor] = useState(defaultSelect.name)
  const [year, setYear] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (err) => console.log(err.graphQLErrors[0].message)
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    editAuthor({ variables: { author, year: Number(year) } })

    setAuthor(defaultSelect.name)
    setYear('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        author:
        <select
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        >
          {res.map((obj) => (
            <option value={obj.name} key={obj.name}>
              {obj.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        year
        <input
          value={year}
          onChange={({ target }) => setYear(target.value)}
          type="text"
        />
      </div>
      <button type="submit">update author</button>
    </form>
  )
}

export default BirthForm
