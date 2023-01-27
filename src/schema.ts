import { makeExecutableSchema } from '@graphql-tools/schema'
import { connect } from '@planetscale/database'

const config = {
    host: 'us-east.connect.psdb.cloud',
    username: 'v8pv86gq25zylt6jz29t',
    password: 'pscale_pw_uODyreQj8yl8IGUlxLyjYf8zaVvBZ1PE0GoDVH0SeUg'
}

const conn = connect(config);

const typeDefinitions = /* GraphQL */ `
  type Query {
    info: String!
    users: [User!]!
  }

  type Mutation {
    userAuth(name: String!, email: String!, Org_name: String!, password: String!, id: ID!): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    Org_name: String!
    password: String!
  }
 
`
// const links: Link[] = [
//     {
//       id: 'link-0',
//       url: 'https://graphql-yoga.com',
//       description: 'The easiest way of setting up a GraphQL server'
//     }
//   ]

const resolvers = {
    Query: {
      info: () => 'This is the API of a Hackernews clone',
      users: async () => {
        const [results] = await Promise.all([conn.execute('select * from users')]);
        const json = JSON.stringify(results.rows);
        return JSON.parse(json);
      }
    },
    Mutation: {
        userAuth: async (parent: unknown, args: { name: string; email: string, Org_name: string, password: string, id: number }) => {
          const user = {
            id: args.id,
            name: args.name,
            email: args.email,
            Org_name: args.Org_name,
            password: args.password
        }

          const query = 'INSERT INTO users (`id`, `name`, `email`, `password`, `OrgName`) VALUES (?, ?, ?, ?, ?)'
          const params = [args.id, args.name, args.email, args.password, args.Org_name]
          await conn.execute(query, params)
     
          return user
        }
      }
}

export const schema = makeExecutableSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions]
})