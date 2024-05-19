import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../queries";

function HomePage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      const jobs = await getJobs();
      setJobs(jobs);
    })();
  }, []);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      {jobs.length > 0 && <JobList jobs={jobs} />}
    </div>
  );
}

export default HomePage;
