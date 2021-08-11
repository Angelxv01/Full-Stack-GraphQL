import React, { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendation from './components/Recommendation'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('login')
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    token ? setPage('authors') : setPage('login')
  }, [token])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      window.alert(
        `new book: ${subscriptionData.data.bookAdded.title}\nwritten by ${subscriptionData.data.bookAdded.author.name}
        `
      )
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />
      <Recommendation show={page === 'recommend'} />
      <NewBook show={page === 'add'} />

      <Login show={page === 'login'} setToken={setToken} />
    </div>
  )
}

export default App
