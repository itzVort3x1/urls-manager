export const typeDefinitions = `
  type Query {
    info: String!
    users: [User!]!
    getUser(email: String!): [User!]
    allShortcuts: [Shortcut!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, Org_name: String!, password: String!, id: ID!): User!
  }

  type Mutation {
    createShortcut(user_id: ID!, snippet: String!, url: String!): Shortcut!
  }

  type Shortcut {
    user_id: ID!
    snippet: String!
    url: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    Org_name: String!
    password: String!
  }
`