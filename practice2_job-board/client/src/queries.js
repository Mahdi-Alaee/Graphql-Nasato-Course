import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "./lib/auth";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new GraphQLClient("http://localhost:9000/graphql", {
  headers: () => {
    const token = getAccessToken();
    if (!token) {
      return {};
    }

    return { Authorization: `Bearer ${token}` };
  },
});

const apolloClient = new ApolloClient({
  uri: "http://localhost:9000/graphql",
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

  const { data } = await apolloClient.query({ query });
  return data.jobs;
}

export async function getJobById(id) {
  const query = gql`
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

  const { data } = await apolloClient.query({
    query,
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

  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.company;
}

export async function createJob(title, description) {
  const mutation = `#graphql
    mutation CreateJob($input: CreateJobInput!){
      job:createJob(input: $input) {
        id
      }
    }
  `;

  const { job } = await client.request(mutation, {
    input: { title, description },
  });
  return job.id;
}

export async function deleteJob(id) {
  const mutation = `#graphql
    mutation DeleteJob($id: ID!){
      deleteJob(id: $id) {
        id
        title    
      }
    }
  `;

  const data = await client.request(mutation, { id });
  return data;
}
