import Hero from '../components/Hero.jsx';
import HomeCards from '../components/HomeCards.jsx';
import JobsListing from '../components/JobsListing.jsx';
import ViewAllJobs from '../components/ViewAllJobs.jsx';

const HomePage = () => {
  return (
    <>
        <Hero/>
        <HomeCards/>
        <JobsListing isHome= {true}/>
        <ViewAllJobs/>
    </>
    
  )
}

export default HomePage