import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompanyById } from "../queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    getCompanyById(companyId).then(setCompany);
  }, [companyId]);

  if (company === null) return <h1>Loading ...</h1>;
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">
        Jobs at {company.name}
      </h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
