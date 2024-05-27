import JobList from "../components/JobList";
import { useJobs } from "../graphql/hooks";

function HomePage() {
  const { jobs, error, loading } = useJobs();
  if (loading) {
    return <h1>Loading ...</h1>;
  } else if (error) {
    return <h1>Error ...</h1>;
  } else {
    return (
      <div>
        <h1 className="title">Job Board</h1>
        <JobList jobs={jobs} />
      </div>
    );
  }
}

export default HomePage;
