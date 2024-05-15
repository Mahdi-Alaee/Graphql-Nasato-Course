const typeDefs = `#graphql
    type Query {
        greeting: String
    }
`;

const resolvers = {
    Query: {
        greeting: () => 'hello world!'
    }
};