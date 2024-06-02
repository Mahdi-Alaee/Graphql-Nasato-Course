import { useState } from "react";
import JobList from "../components/JobList";
import { useJobs } from "../graphql/hooks";

const SHOW_JOBS_COUNT = 5;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, loading } = useJobs(
    SHOW_JOBS_COUNT,
    (currentPage - 1) * SHOW_JOBS_COUNT
  );
  const pagesCount = data?.totalCount / SHOW_JOBS_COUNT;
  if (loading) {
    return <h1>Loading ...</h1>;
  } else if (error) {
    return <h1>Error ...</h1>;
  } else {
    return (
      <div>
        <h1 className="title">Job Board</h1>
        {/* pagination */}
        <div>
          {/* prev */}
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
            }
          >
            {"<"}
          </button>
          {/* page */}
          <span style={{ margin: "0 5px" }}>{currentPage}</span>
          {/* next */}
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < pagesCount ? prev + 1 : prev))
            }
          >
            {">"}
          </button>
        </div>
        <JobList jobs={data?.items} />
      </div>
    );
  }
}

export default HomePage;
