import { getJobs, getJob, getCompanyJobs } from "./db/jobs.js";
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
};

function graphqlErrorGenerator(message, code = "INVALID_ID") {
  return new GraphQLError(message, {
    extensions: { code },
  });
}
