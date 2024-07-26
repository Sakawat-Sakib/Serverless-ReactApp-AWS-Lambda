import {useState, useEffect} from 'react';
import JobListing from './JobListing';
import Spinner from './Spinner';


const JobsListing = ({isHome = false}) => {

  const [jobs, setJobs] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const fetchJobs = async () => {

      
      const apiURL = 'https://4wmgp3usti.execute-api.us-east-1.amazonaws.com/dev/jobs'
      
      try {
        // //using fetch
        const res = await fetch(apiURL);
        const data = await res.json()
        const allJobs = data.jobs.Items
        



        setJobs(allJobs);

      } catch (error) {
        console.log('Error fetching data',error);

      } finally{
        setLoading(false);
      }
    }

    fetchJobs();
  },[]);

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? 'Recent Jobs' : 'Browse Jobs'}
        </h2>
        

        {loading ? <Spinner loading={loading}/> : 
        
          (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jobs.map((job)=>(
                <JobListing key={job.id} job={job}/>
              ))}
            </div>
          )
        
        }
            
          
        
      </div>
    </section>
  );
};

export default JobsListing