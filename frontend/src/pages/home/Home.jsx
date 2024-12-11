import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import Banner from "./Banner"
import SearchPost from '../postss/SearchPost'

const Home = () => {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearch = () => setQuery({ search, category });

  const fetchPosts = async () => {
    let url = import.meta.env.VITE_BACKEND_URL + `/posts`
    if (search) {
      url += `?search=${search}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      return []
    }

    const posts = await response.json()

    return posts.map(post => ({
      ...post,
      title: "Test title",
      description: "test",
    }))
  }

  const fetchData = async () => {
    const posts = await fetchPosts()
    setPosts(posts)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='bg-white text-gray-900 container mx-auto mt-16 p-16'>
      <Banner/>
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
              to={`/posts/${post._id}`}
              key={post._id}
              className="group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={post?.coverImg}
                  className="h-288 w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-20 bg-white">
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#1E73BE] transition-colors duration-300">
                    {post?.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-8">
                    {post?.description.substring(0, 60)}...
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