import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaUserFriends } from "react-icons/fa";
import { LiaBlogSolid } from "react-icons/lia";
import { RiAdminFill } from "react-icons/ri";
import { FaComments } from "react-icons/fa";
import { useFetchPostsQuery } from '../../../redux/features/posts/PostsApi';
import { useGetCommentsQuery } from '../../../redux/features/comments/commentApi';
import { useGetUserProfileQuery } from '../../../redux/features/auth/authapi';
import PostsChart from './PostsChart';

const Dashboard = () => {
  const [query, setQuery] = useState({search: '', category: ''});
  const {user} = useSelector((state) => state.auth);

  const posts = []
  const isLoading = false
  const error = false

  // const {data: posts=[], error, isLoading} = useFetchPostsQuery(query);
  // console.log(posts)
  const {data: comments=[]} = useGetCommentsQuery();
  const {data: usersData = {}} = useGetUserProfileQuery();
  const usersList = usersData.users || [];
  const usersCount = usersList.length;
  const adminCounts = usersList.filter((user) => user.role === 'admin').length;
  // console.log(adminCounts);

  return (
    <>
    {isLoading && (<div>Loading...</div>)}
    <div className='space-y-6 '>
      <div className='bg-gray-50 p-5'>
        <h1>Hi, {user?.username}!</h1>
        <p>Welcome to the admin dashboard</p>
        <p>Here you can manage your posts, users, and other related data</p>
      </div>

      {/* Cards Grid */}
      <div className='flex flex-col md:flex-row justify-between gap-8 pt-8'>
        <div className='bg-indigo-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center'>
          {/* user react icons */}
          <FaUserFriends className='size-8 text-indigo-600'/>
          <p>{usersCount} Users</p>
        </div>
        <div className='bg-red-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center'>
          {/* user react icons */}
          <LiaBlogSolid className='size-8 text-red-600'/>
          <p>{posts.length} Blogs</p>
        </div>
        <div className='bg-lime-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center'>
          {/* user react icons */}
          <RiAdminFill className='size-8 text-lime-600'/>
          <p>{adminCounts} Admin{adminCounts !==1 ? 's' : ''}</p>
        </div>
        <div className='bg-orange-100 py-6 w-full rounded-sm space-y-1 flex flex-col items-center'>
          {/* user react icons */}
          <FaComments  className='size-8 text-orange-600'/>
          <p>{comments?.totalComments} Comments</p>
        </div>
      </div>

      {/* Graphs and chart */}
      <div className='pt-5 pb-5'>
        <PostsChart posts={posts} />
      </div>

    </div>
    </>
  )
}

export default Dashboard