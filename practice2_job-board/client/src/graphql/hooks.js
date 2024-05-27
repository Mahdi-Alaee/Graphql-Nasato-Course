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

export function useJobs() {
  const { error, loading, data } = useQuery(getJobsQuery, {
    fetchPolicy: "network-only",
  });
  return { loading, error: Boolean(error), jobs: data?.jobs };
}

export function useCreateJob(title, description) {
  const navigator = useNavigate();
  const [mutate,result] = useMutation(createJobMutation, {
    variables: {
      input: { description, title },
    },
  });

  async function call() {
    const {
      data: {
        job: { id },
      },
    } = await mutate();
    navigator(`/jobs/${id}`);
  }

  return [call, result];
}
