import { useQuery } from "@apollo/client";
import { getCompanyByIdQuery, getJobByIdQuery } from "./queries";

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
