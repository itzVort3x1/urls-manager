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
        return results.rows;
      },
      allShortcuts: async () => {
        const [results] = await Promise.all([conn.execute('select * from shortcuts')]);
        return results.rows;
      }
    },
    Mutation: {
        createUser: async (parent: unknown, args: { name: string; email: string, Org_name: string, password: string, id: number }) => {
          const user = {
            id: args.id,
            name: args.name,
            email: args.email,
            Org_name: args.Org_name
        }

          const query = 'INSERT INTO users (`id`, `name`, `email`, `password`, `OrgName`) VALUES (?, ?, ?, ?, ?)'
          const params = [args.id, args.name, args.email, args.password, args.Org_name]
          await conn.execute(query, params)
     
          return user
        },
        createShortcut: async(parent: unknown, args: {user_id: number, snippet: string, url: string}) => {
            const shortcut = {
                user_id: args.user_id,
                snippet: args.snippet,
                url: args.url
            }

            const query = 'INSERT INTO shortcuts (`user_id`, `snippet`, `url`) VALUES (?, ?, ?)'
            const params = [args.user_id, args.snippet, args.url];
            await conn.execute(query, params);

            return shortcut
        }
      }
}

export const schema = makeExecutableSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions]
})