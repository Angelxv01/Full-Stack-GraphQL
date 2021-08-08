import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const BirthForm = () => {
  const [author, setAuthor] = useState('')
  const [year, setYear] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    editAuthor({ variables: { author, year: Number(year) } })

    setAuthor('')
    setYear('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        author
        <input
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          type="text"
        />
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
