import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobs } from "../data/jobs";

const FeaturedJobs = ({ search }) => {

  const navigate = useNavigate();

  const keyword = search?.keyword?.toLowerCase() || "";
  const location = search?.location?.toLowerCase() || "";


  const filteredJobs = jobs.filter((job) => {

    const jobData =
      `${job.title} ${job.company} ${job.skills.join(" ")}`.toLowerCase();

    const locationData = job.location.toLowerCase();


    return (
      jobData.includes(keyword) &&
      locationData.includes(location)
    );

  });


  return (
    <section className="py-16 bg-gray-50">

      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Jobs
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {filteredJobs.map((job) => (

            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md p-6"
            >

              <h3 className="text-xl font-bold">
                {job.title}
              </h3>

              <p>{job.company}</p>

              <p>
                Location: {job.location}
              </p>

              <p>
                Salary: {job.salary}
              </p>

              <div className="mt-3 flex gap-2 flex-wrap">
                {job.skills.map((skill,index)=>(
                  <span
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>


              <div className="flex gap-3 mt-4">
  <button
    onClick={() => navigate("/jobs")}
    className="bg-gray-600 text-white px-4 py-2 rounded"
  >
    View Job
  </button>

  <button
    onClick={() => navigate("/jobs")}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Apply Now
  </button>
</div>

            </div>

          ))}

        </div>


        <div className="text-center mt-10">
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            View All Jobs
          </Link>
        </div>

        {filteredJobs.length === 0 && (
          <p className="text-center mt-5">
            No jobs found
          </p>
        )}

      </div>

    </section>
  );
};


export default FeaturedJobs;