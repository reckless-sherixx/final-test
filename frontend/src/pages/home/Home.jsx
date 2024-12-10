import Posts from "../postss/Posts"
import Banner from "./Banner"

const Home = () => {
  return (
    <div className='bg-white text-gray-900 container mx-auto mt-16 p-16'>
      <Banner/>
      <Posts/>
    </div>
  )
}

export default Home