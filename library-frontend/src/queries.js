import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query Query {
    allBooks {
      title
      published
      author
    }
  }
`

export const ADD_BOOK = gql`
  mutation Mutation(
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
      title
      author
    }
  }
`
export const EDIT_AUTHOR = gql`
  mutation Mutation($author: String!, $year: Int!) {
    editAuthor(name: $author, setBornTo: $year) {
      name
      born
    }
  }
`
