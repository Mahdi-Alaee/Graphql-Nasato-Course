import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "./lib/auth";

const client = new GraphQLClient("http://localhost:9000/graphql", {
  headers: () => {
    const token = getAccessToken();
    if (!token) {
      return {};
    }

    return { Authorization: `Bearer ${token}` };
  },
});

export async function getJobs() {
  const query = `#graphql
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

  const { jobs } = await client.request(query);
  return jobs;
}

export async function getJobById(id) {
  const query = `#graphql
      query jobById($id: ID!) {
        job(id: $id){
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

  const { job } = await client.request(query, { id });
  return job;
}

export async function getCompanyById(id) {
  const query = `#graphql
  query getCompanyById($id: ID!){
    company(id: $id){
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

  const { company } = await client.request(query, { id });
  return company;
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
