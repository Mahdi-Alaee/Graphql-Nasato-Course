import { getJobs, getJob, getCompanyJobs } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
  Query: {
    jobs: async () => getJobs(),
    job: async (_root, { id }) => getJob(id),
    company: async (_root, { id }) => getCompany(id),
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
