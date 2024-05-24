import {
  getJobs,
  getJob,
  getCompanyJobs,
  createJob,
  deleteJob,
  updateJob,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw new graphqlErrorGenerator(`the job not found with id: "${id}"`);
      }
      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw graphqlErrorGenerator(`the company not found with id: "${id}"`);
      }
      return company;
    },
  },
  Job: {
    date: (job) => {
      return job.createdAt.slice(0, "yyyy-mm-dd".length);
    },
    company: (job) => getCompany(job.companyId),
  },
  Company: {
    jobs: (company) => getCompanyJobs(company.id),
  },
  Mutation: {
    createJob: (_root, { input: { title, description } }, { auth }) => {
      console.log(auth);
      if (!auth) {
        throw graphqlErrorGenerator(
          "you can't post job before login",
          "INVALID_TOKEN"
        );
      }
      return createJob({ companyId: auth.companyId, title, description });
    },
    deleteJob: (_root, { id }) => deleteJob(id),
    updateJob: (_root, { input: { id, title, description } }) =>
      updateJob({ id, title, description }),
  },
};

function graphqlErrorGenerator(message, code = "INVALID_ID") {
  return new GraphQLError(message, {
    extensions: { code },
  });
}
