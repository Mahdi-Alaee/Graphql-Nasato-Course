import JobList from "../components/JobList";
import { useJobs } from "../graphql/hooks";

function HomePage() {
  const { jobs } = useJobs();

  return (
    <div>
      <h1 className="title">Job Board</h1>
      {jobs && <JobList jobs={jobs} />}
    </div>
  );
}

export default HomePage;
