import Posts from "../postss/Posts"
import Banner from "./Banner"

const Home = () => {
  return (
    <div className='bg-white text-primary container mx-auto mt-8 p-8'>
      <Banner/>
      <Posts/>
    </div>
  )
}

export default Home