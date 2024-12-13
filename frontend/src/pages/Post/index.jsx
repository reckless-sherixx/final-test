import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetchPostByIdQuery } from '@/redux/features/posts/PostsApi';
import SinglePostCard from './singlePostCard';
import CommentCards from './comments/CommentCards';
import RelatedPosts from './RelatedPosts';

const singlePost = () => {
  // Fetch data from API and display post details here
  const {id} = useParams(); 
  // console.log(id);
  const {data: post, error, isLoading} = useFetchPostByIdQuery(id);
  console.log(post);
  return (
    <div className='text-gray-900 container mx-auto mt-8'>
      <div>
        {isLoading && <div>Loading...</div>}
        {error && <div>Something Went Wrong...</div>}
        {
          post?.post && (
            <div className='flex flex-col lg:flex-row justify-between items-start md:gap-12 gap-8'>
              <div className='lg:w-2/3 w-full'>
                <SinglePostCard post={post.post}/>
                <CommentCards comments={post?.comments}/>
              </div>
              <div className='bg-white lg:w-1/3 w-full'>
              <RelatedPosts/>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default singlePost