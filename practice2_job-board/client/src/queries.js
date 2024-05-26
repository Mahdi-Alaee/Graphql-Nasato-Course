import { getAccessToken } from "./lib/auth";
import {
  InMemoryCache,
  gql,
  ApolloClient,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";

const httpLink = new HttpLink({
  uri: "http://localhost:9000/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export async function getJobs() {
  const query = gql`
    {
      jobs {
        id
        title
        date
        description
        company {
          id
          name
        }
      }
    }
  `;

  const { data } = await client.query({ query });
  return data.jobs;
}

const getJobByIdQuery = gql`
  query jobById($id: ID!) {
    job(id: $id) {
      title
      description
      date
      company {
        id
        name
      }
    }
  }
`;

export async function getJobById(id) {
  const { data } = await client.query({
    query: getJobByIdQuery,
    variables: { id },
  });
  return data.job;
}

export async function getCompanyById(id) {
  const query = gql`
    query getCompanyById($id: ID!) {
      company(id: $id) {
        name
        description
        jobs {
          id
          title
          date
          description
          company {
            id
            name
          }
        }
      }
    }
  `;

  const { data } = await client.query({ query, variables: { id } });
  return data.company;
}

export async function createJob(title, description) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        title
        description
        date
        company {
          id
          name
        }
      }
    }
  `;

  const { data } = await client.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: getJobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return data.job.id;
}
