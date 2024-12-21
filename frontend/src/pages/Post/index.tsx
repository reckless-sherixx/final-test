import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from "react-redux"

// import { useFetchPostByIdQuery } from '@/redux/features/posts/PostsApi';
import SinglePostCard from './singlePostCard';
import CommentCards from './comments/CommentCards';
import RelatedPosts from './RelatedPosts';

import { apiRoutes } from "@/router"
import { clearUserData } from "@/common"
import { logout as clearUserDataFromRedux } from '@/redux/features/auth/authSlice'

import { Post } from "@/types"

const SinglePost = () => {
  const { postId } = useParams(); 

  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState<Post|null>(null)

  const logout = () => {
    clearUserData()
    dispatch(clearUserDataFromRedux());
  }
  
  const fetchData = async () => {
    if (!postId) {
      return
    }

    const response = await fetch(apiRoutes.findPost(postId), {
      credentials: "include",
    })

    if (!response.ok) {
      if (response.status === 401) {
        logout()
      }

      return
    }

    const jsonResponse = await response.json()

    setPost(jsonResponse.post)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='text-gray-900 container mx-auto mt-8'>
      <div>
        {isLoading && <div>Loading...</div>}
        {post && (
          <div className='flex flex-col lg:flex-row justify-between items-start md:gap-12 gap-8'>
            <div className='lg:w-2/3 w-full'>
              <SinglePostCard post={post}/>
              <CommentCards comments={post?.comments}/>
            </div>
            {/*
            <div className='bg-white lg:w-1/3 w-full'>
              <RelatedPosts />
            </div>
            */}
          </div>
        )}
      </div>
    </div>
  )
}

export default SinglePost