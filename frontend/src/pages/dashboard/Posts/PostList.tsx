import { FaPen, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

import { clearUserData } from "@/common"
import { logout as clearUserDataFromRedux } from '@/redux/features/auth/authSlice';
import * as u from "@/utils"
import { apiRoutes, createSingleNewsRoute } from "@/router"

import { Post } from "@/types"

const PostList = ({
  posts,
  editPost,
  removePostFromList,
} : {
  posts: Post[],
  editPost: (post:Post) => void,
  removePostFromList: (post:Post) => void,
}) => {
  const dispatch = useDispatch()

  const logout = () => {
    clearUserData()
    dispatch(clearUserDataFromRedux());
  }

  const deletePost = async (post:Post) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const response = await fetch(apiRoutes.deletePost(post), {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          logout()
        }

        return
      }

      removePostFromList(post)
    }
  }

  return (
    <div className="mt-32 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-32">
      {posts.map(post => (
        <div className="relative" key={post.id}>
          <div className="absolute top-12 right-12 flex">
            <button
              type="button"
              className="group size-36 flex items-center justify-center border-2 border-black hover:bg-black rounded-full transition duration-150"
              onClick={() => editPost(post)}
            >
              <FaPen className="group-hover:text-white text-black transition duration-150" />
            </button>
            <button
              type="button"
              className="group ml-8 size-36 flex items-center justify-center border-2 border-black hover:bg-black rounded-full transition duration-150"
              onClick={() => deletePost(post)}
            >
              <FaTrash className="group-hover:text-white text-black transition duration-150" />
            </button>
          </div>
          <Link to={createSingleNewsRoute(post.id)}>
            <div>
              <img
                src={post.coverImageUrl}
                className="h-288 w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-20 bg-white">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#1E73BE] transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 mt-8">
                  {u.trimWithEllipsis(post.description)}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default PostList