import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  getApplicationsByCandidateId,
  getApplicationsByCompanyId
} from "../services/applicationService";

const Applications = () => {

const { user } = useAuth();

  console.log("LOGIN USER:", user);

  const [applications, setApplications] = useState([]);

useEffect(() => {

  const fetchApplications = async () => {

    try {

      let data = [];

      if (user.role === "candidate") {

        data = await getApplicationsByCandidateId(user.id);

      } 
      else if (user.role === "company") {

data = await getApplicationsByCompanyId(user.name);

      }

      console.log("Applications:", data);

      setApplications(data);

    } catch(error) {

      console.log(error);

    }

  };


  if(user){
    fetchApplications();
  }


}, [user]);


  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-950">

      <h1 className="text-3xl font-bold mb-6">
        My Applications
      </h1>


      {applications.length === 0 ? (

        <p>No applications found</p>

      ) : (

        applications.map((application)=>(

          <div 
          key={application._id}
          className="p-5 mb-4 bg-gray-100 rounded">

            <h2 className="text-xl font-bold">
              {application.jobTitle}
            </h2>

            <p>
              Company: {application.company}
            </p>

            <p>
              Candidate: {application.candidateName}
            </p>

            <p>
              Status: {application.status}
            </p>

          </div>

        ))

      )}

    </div>
  );  
};


export default Applications;