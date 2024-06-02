import { useMutation, useQuery } from "@apollo/client";
import {
  createJobMutation,
  getCompanyByIdQuery,
  getJobByIdQuery,
  getJobsQuery,
} from "./queries";
import { useNavigate } from "react-router";

export function useCompany(id) {
  const { error, loading, data } = useQuery(getCompanyByIdQuery, {
    variables: { id },
  });

  return { error: Boolean(error), loading, company: data?.company };
}

export function useJob(id) {
  const { loading, error, data } = useQuery(getJobByIdQuery, {
    variables: { id },
  });

  return { loading, error: Boolean(error), job: data?.job };
}

export function useJobs(limit,offset) {
  const { error, loading, data } = useQuery(getJobsQuery, {
    fetchPolicy: "network-only",
    variables: {
      limit,
      offset
    }
  });
  return { loading, error: Boolean(error), jobs: data?.jobs };
}

export function useCreateJob() {
  const navigator = useNavigate();
  const [mutate, { loading }] = useMutation(createJobMutation);

  async function createJob(title, description) {
    const {
      data: {
        job: { id },
      },
    } = await mutate({
      variables: {
        input: { description, title },
      },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: getJobByIdQuery,
          data,
          variables: { id: data.job.id },
        });
      },
    });
    navigator(`/jobs/${id}`);
  }

  return { createJob, loading };
}
