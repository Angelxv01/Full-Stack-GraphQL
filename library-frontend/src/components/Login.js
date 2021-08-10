import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { LOGIN } from '../queries'

const Login = ({ show, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN)

  const handleSubmit = (e) => {
    e.preventDefault()

    login({ variables: { username, password } })
  }

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('loggedUser', token)
    }
  }, [result.data])

  useEffect(() => {
    const token = localStorage.getItem('loggedUser')
    if (token) {
      setToken(token)
    }
  }, [])

  const visibile = { display: show ? '' : 'none' }
  return (
    <form style={visibile} onSubmit={handleSubmit}>
      <div>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default Login
