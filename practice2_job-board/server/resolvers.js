import { getJobs } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
  Query: {
    jobs: async () => getJobs(),
  },
  Job: {
    date: (job) => {
      console.log(job);
      return job.createdAt.slice(0, "yyyy-mm-dd".length);
    },
    company: (job) => getCompany(job.companyId)
  },

};
