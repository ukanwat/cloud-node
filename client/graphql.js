import { GraphQLClient, gql } from 'graphql-request'



const graphqlClient = new GraphQLClient('https://hasura.corp.coplane.co/v1/graphql', { headers: { 'x-hasura-admin-secret': 'Tay13Utk12' } })


export { graphqlClient }