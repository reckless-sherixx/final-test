import { ChangeEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import SearchPost from './SearchPost'

import { fetchPosts } from "@/api"
import { createPostRoute } from "@/router"
import { Post } from "@/types"
import * as u from "@/utils" 

const PostList = ({
  posts,
} : {
  posts: Post[],
}) => {
  return (
    <div className="mt-32 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-32">
      {posts.map((post) => (
        <Link
          to={createPostRoute(post.id)}
          key={post.id}
          className="group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="relative">
            <img
              src={post.coverImage}
              className="h-288 w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="p-20 bg-white">
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#1E73BE] transition-colors duration-300">
                {post?.title}
              </h2>
              <p className="text-sm text-gray-500 mt-8">
                {u.trimWithEllipsis(post.description)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

const Posts = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState({ search: "", category: "" });
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const handleSearchChange = (e:ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleSearch = () => setQuery({ search, category });

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
      {loading ? (
        <div>Loading....</div>
      ) : (
        <PostList posts={posts} />
      )}
      {/* <AddButton onClick={openModal} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-24 font-semibold">Create a new Post</h2>
        <AddPost closeModalOnSubmit={closeModal} />
      </Modal> */}
    </div>
  );
};

export default Posts;