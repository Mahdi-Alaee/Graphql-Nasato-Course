import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompanyById } from "../queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [state, setState] = useState({
    company: null,
    isError: false,
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompanyById(companyId);
        setState({ company, isError: false, isLoading: false });
      } catch (error) {
        console.log(error);
        setState({ company: null, isError: true, isLoading: false });
      }
    })();
  }, [companyId]);
  if (state.isLoading) {
    return <h1>Loading ...</h1>;
  } else if (state.isError) {
    return <h1 style={{ color: "red" }}>Data is unavalible</h1>;
  } else {
    return (
      <div>
        <h1 className="title">{state.company.name}</h1>
        <div className="box">{state.company.description}</div>
        <h2 className="title is-5">Jobs at {state.company.name}</h2>
        <JobList jobs={state.company.jobs} />
      </div>
    );
  }
}

export default CompanyPage;
