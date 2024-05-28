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
    company: (job, _args, { companyLoader }) =>
      companyLoader.load(job.companyId),
  },
  Company: {
    jobs: (company) => getCompanyJobs(company.id),
  },
  Mutation: {
    createJob: (_root, { input: { title, description } }, { auth }) => {
      if (!auth) {
        throw graphqlErrorGenerator(
          "you can't post job before login",
          "INVALID_TOKEN"
        );
      }
      return createJob({ companyId: auth.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { auth }) => {
      const job = await deleteJob(id, auth.companyId);
      if (!job) {
        throw graphqlErrorGenerator("you can't delete this job", "NO_ACCESS");
      }
      return job;
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { auth }
    ) => {
      const job = await updateJob({ id, title, description }, auth.companyId);
      if (!job) {
        throw graphqlErrorGenerator("you can't edit this job", "NO_ACCESS");
      }
      return job;
    },
  },
};

function graphqlErrorGenerator(message, code = "INVALID_ID") {
  return new GraphQLError(message, {
    extensions: { code },
  });
}
