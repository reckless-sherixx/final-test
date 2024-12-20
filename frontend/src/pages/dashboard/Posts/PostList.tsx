import * as u from "@/utils"

import { Post } from "@/types"

import { FaPen } from "react-icons/fa";

const PostList = ({
  posts,
  editPost,
} : {
  posts: Post[],
  editPost: (post:Post) => void,
}) => {
  console.log({ posts })

  return (
    <div className="mt-32 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-32">
      {posts.map(post => (
        <div className="relative" key={post.id}>
          <button
            type="button"
            className="group absolute top-12 right-12 size-36 flex items-center justify-center border-2 border-black hover:bg-black rounded-full transition duration-150"
            onClick={() => editPost(post)}
          >
            <FaPen className="group-hover:text-white text-black transition duration-150" />
          </button>
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
      ))}
    </div>
  )
}

export default PostList