import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

export async function getJobs() {
  const query = `
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
