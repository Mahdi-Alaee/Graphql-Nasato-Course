import { useState } from "react";
import JobList from "../components/JobList";
import { useJobs } from "../graphql/hooks";
import PaginationBar from "../components/PaginationBar";

const SHOW_JOBS_COUNT = 5;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { jobs, error, loading } = useJobs(
    SHOW_JOBS_COUNT,
    (currentPage - 1) * SHOW_JOBS_COUNT
  );
  const pagesCount = Math.ceil(jobs?.totalCount / SHOW_JOBS_COUNT);
  if (loading) {
    return <h1>Loading ...</h1>;
  } else if (error) {
    return <h1>Error ...</h1>;
  } else {
    return (
      <div>
        <h1 className="title">Job Board</h1>
        {/* pagination */}
        <PaginationBar
          currentPage={currentPage}
          totalPages={pagesCount}
          onPageChange={setCurrentPage}
        />
        <JobList jobs={jobs?.items} />
      </div>
    );
  }
}

export default HomePage;
