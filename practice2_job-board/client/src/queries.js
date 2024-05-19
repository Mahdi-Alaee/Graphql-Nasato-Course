import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

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

export async function getJob(id) {
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
    `

  const { job } = await client.request(query, {id});
  return job;
}
