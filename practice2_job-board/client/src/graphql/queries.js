import { getAccessToken } from "../lib/auth";
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

export const client = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

const JobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    date
    description
    company {
      id
      name
    }
  }
`;

export const getJobsQuery = gql`
  {
    jobs {
      ...JobDetail
    }
  }
  ${JobDetailFragment}
`;

export const getJobByIdQuery = gql`
  query jobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JobDetailFragment}
`;

export const getCompanyByIdQuery = gql`
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

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${JobDetailFragment}
`;
// export async function createJob(title, description) {

//   const { data } = await client.mutate({
//     mutation,
//     variables: { input: { title, description } },
//     update: (cache, { data }) => {
//       cache.writeQuery({
//         query: getJobByIdQuery,
//         variables: { id: data.job.id },
//         data,
//       });
//     },
//   });
//   return data.job.id;
// }
