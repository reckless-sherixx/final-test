import { useEffect, useState } from 'react'
import SearchPost from './SearchPost'
// import { useFetchPostsQuery } from '../../redux/features/posts/PostsApi';
import { Link } from 'react-router-dom';

import AddButton from '../../components/AddButton/AddButton';
import Modal from '../../components/Modal/Modal';
import AddPost from './AddPost';

const Posts = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState({ search: "", category: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Get data using redux
  // const { data: posts = [], error, isLoading } = useFetchPostsQuery(query);
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearch = () => setQuery({ search, category });

  //Open close Modal handler
  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

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
    <div className="mt-64 container mx-auto">
      <SearchPost
        search={search}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
      />

      {loading && <div>Loading....</div>}

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
      <AddButton onClick={openModal} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-24 font-semibold">Create a new Post</h2>
        <AddPost closeModalOnSubmit={closeModal} />
      </Modal>
    </div>
  );
};

export default Posts;