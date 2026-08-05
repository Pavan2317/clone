import React, { useState, useEffect } from "react";
import { getJobs } from "../services/jobService";
import { createApplication } from "../services/applicationService";
import ApplyModal from "../components/ApplyModal";

const JobsPage = ({ search }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);


  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadJobs();
  }, []);


  const handleSubmit = async (formData) => {

    try {

      const applicationData = {
        jobId: String(selectedJob._id || selectedJob.id),

        candidateId:
          localStorage.getItem("userId") || "1785783550243",

        companyId:
          selectedJob.companyId || "",

        jobTitle:
          selectedJob.title,

        company:
          selectedJob.company,

        candidateName:
          formData.fullName,

        candidateEmail:
          formData.email,

        phone:
          formData.phone,

        resume:
          formData.resume,

        status:
          "pending"
      };


      await createApplication(applicationData);

      alert("Application Submitted Successfully");

      setIsModalOpen(false);
      setSelectedJob(null);


    } catch(error) {

      console.error(error);
      alert("Failed to submit application");

    }

  };


  return (

    <div className="max-w-7xl mx-auto px-5 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Available Jobs
      </h1>


      {jobs.map((job)=>(

        <div 
          key={job._id || job.id}
          className="border p-5 mb-5 rounded"
        >

          <h2 className="text-xl font-bold">
            {job.title}
          </h2>

          <p>
            Company: {job.company}
          </p>

          <button
            onClick={()=>{
              setSelectedJob(job);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
          >
            Apply Now
          </button>


        </div>

      ))}


      <ApplyModal
        isOpen={isModalOpen}
        onClose={()=>{
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
        onSubmit={handleSubmit}
      />


    </div>

  );

};


export default JobsPage;