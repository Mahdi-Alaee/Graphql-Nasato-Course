import { getJobs, getJob } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
  Query: {
    jobs: async () => getJobs(),
    job: async (_root, { id }) => getJob(id),
  },
  Job: {
    date: (job) => {
      console.log(job);
      return job.createdAt.slice(0, "yyyy-mm-dd".length);
    },
    company: (job) => getCompany(job.companyId),
  },
};
