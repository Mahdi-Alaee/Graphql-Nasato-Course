import { useParams } from "react-router";
import JobList from "../components/JobList";
import { useCompany } from "../graphql/hooks";

function CompanyPage() {
  const { companyId } = useParams();
  const { error, loading, company } = useCompany(companyId);

  if (loading) {
    return <h1>Loading ...</h1>;
  } else if (error) {
    return <h1 style={{ color: "red" }}>Data is unavalible</h1>;
  } else {
    return (
      <div>
        <h1 className="title">{company.name}</h1>
        <div className="box">{company.description}</div>
        <h2 className="title is-5">Jobs at {company.name}</h2>
        <JobList jobs={company.jobs} />
      </div>
    );
  }
}

export default CompanyPage;
