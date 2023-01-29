export const typeDefinitions = `
  type Query {
    info: String!
    users: [User!]!
    getUser(email: String, id: ID): [User!]
    loginUser(email: String!, password: String!): [User!]
    allShortcuts: [Shortcut!]!
    totalUsers: Int
    userShortcuts(user_id: ID!): [Shortcut!]!
    getShortcut(snippet: String, user_id: ID): [Shortcut!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, Org_name: String!, password: String!, id: ID!): User!
  }

  type Mutation {
    createShortcut(user_id: ID!, snippet: String!, url: String!): Shortcut!
  }

  type Mutation {
    deleteShortcut(snippet: String!, user_id: ID!): Shortcut!
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