import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import Banner from "./Banner"
import SearchPost from '@/pages/Posts/SearchPost'
import Popup from '@/components/popup';
import { createSingleNewsRoute } from "@/router"
import * as u from "@/utils"

const Home = () => {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const { user } = useSelector(state => state.auth)
  console.log("Utserdfdeifjdf", user)
  const [showResetPopup, setShowResetPopup] = useState(false);
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearch = () => setQuery({ search, category });

  const fetchPosts = async () => {
    let url = import.meta.env.VITE_BACKEND_URL + `/posts`
    if (search) {
      url += `?search=${search}`
    }

    const response = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if (!response.ok) {
      return []
    }

    return await response.json()
  }

  const fetchData = async () => {
    const posts = await fetchPosts()
    setPosts(posts)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    if (user.firstLogin === true) {
      setShowResetPopup(true);
    }
  }, [user])
  useEffect(() => {
    let timer;
    if (showResetPopup) {
      timer = setTimeout(() => {
        setShowResetPopup(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [showResetPopup]);
  return (
    <div className='bg-white text-gray-900 container mx-auto mt-16 p-16'>
      <Popup show={showResetPopup} onClose={() => setShowResetPopup(false)} />
      <Banner />
      <div className="mt-64 container mx-auto">
        <SearchPost
          search={search}
          handleSearchChange={handleSearchChange}
          handleSearch={handleSearch}
        />
        {loading && <div>Loading...</div>}
        <div className="mt-32 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-32">
          {posts.map((post) => (
            <Link
              to={createSingleNewsRoute(post.id)}
              key={post.id}
              className="group block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative rounded-3xl">
                <img
                  src={post.coverImageUrl}
                  className="h-288 w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-20 bg-white">
                  <h2 className="text-lg font-semibold rounded-xl text-gray-800 group-hover:text-[#1E73BE] transition-colors duration-300">
                    {post?.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-8">
                    {/* {post?.description.substring(0, 60)}... */}
                    {u.trimWithEllipsis(post.description)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
