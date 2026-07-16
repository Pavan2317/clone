import React, { useState } from "react";
import { jobs } from "../data/jobs";
import ApplyModal from "../components/ApplyModal";

const JobsPage = ({ search }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredJobs = jobs.filter((job) => {

    const keyword = search?.keyword?.toLowerCase() || "";
    const location = search?.location?.toLowerCase() || "";
    const experience = search?.experience?.toLowerCase() || "";

    const keywordMatch =
      job.title.toLowerCase().includes(keyword) ||
      job.skills.some(skill =>
        skill.toLowerCase().includes(keyword)
      );

    const locationMatch =
      job.location.toLowerCase().includes(location);

    const experienceMatch =
      experience === "" ||
      job.experience.toLowerCase().includes(experience);

    return keywordMatch && locationMatch && experienceMatch;
  });

  const handleSubmit = (formData) => {

    const applications =
      JSON.parse(localStorage.getItem("applications")) || [];

    applications.push(formData);

    localStorage.setItem(
      "applications",
      JSON.stringify(applications)
    );

    alert("Application Submitted Successfully");

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Available Jobs
      </h1>

      {filteredJobs.length === 0 ? (
        <p className="text-center text-red-500">
          No jobs found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {filteredJobs.map((job) => (

            <div
              key={job.id}
              className="border p-5 rounded-lg shadow"
            >

              <h2 className="text-xl font-bold">
                {job.title}
              </h2>

              <p>
                <strong>Company:</strong> {job.company}
              </p>

              <p>
                <strong>Location:</strong> {job.location}
              </p>

              <p>
                <strong>Salary:</strong> {job.salary}
              </p>

              <p>
                <strong>Experience:</strong> {job.experience}
              </p>

            <button
  onClick={() => {
    alert("Button clicked");
    setIsModalOpen(true);
  }}
  className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
>
  Apply Now
</button>
            </div>

          ))}

        </div>
      )}

      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

    </div>
  );
};

export default JobsPage;
