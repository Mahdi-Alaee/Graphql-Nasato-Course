import { useQuery } from "@apollo/client";
import { getCompanyByIdQuery } from "./queries";

export function useCompany(id) {
  const { error, loading, data } = useQuery(getCompanyByIdQuery, {
    variables: { id },
  });

  return { error: Boolean(error), loading, company: data?.company };
}
