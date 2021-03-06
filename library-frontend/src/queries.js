import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genres: $genre) {
      id
      title
      published
      author {
        name
      }
      genres
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      id
      title
      author {
        name
      }
    }
  }
`

export const BOOK_ADDED = gql`
  subscription bookAdded {
    bookAdded {
      id
      title
      published
      genres
      author {
        name
      }
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($author: String!, $year: Int!) {
    editAuthor(name: $author, setBornTo: $year) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ME = gql`
  query me {
    me {
      username
      favoriteGenre
    }
  }
`
