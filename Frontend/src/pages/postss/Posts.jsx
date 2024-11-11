import React, { useState } from 'react'
import SearchPost from './SearchPost'
import { useFetchPostsQuery } from '../../redux/features/posts/PostsApi';
import { Link } from 'react-router-dom';

const Posts = () => {
    const [search, setSearch]= useState('');
    const [category, setCategory]= useState('');
    const [query, setQuery]= useState({search: "", category: ""});

    // Get data using redux
    const {data: posts = [], error, isLoading} = useFetchPostsQuery(query);
    console.log(posts);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    const handleSearch =  () => setQuery({search, category})

  return (
    <div className='mt-16 container mx-auto'>
        <SearchPost 
        search={search} 
        handleSearchChange={handleSearchChange} 
        handleSearch={handleSearch} 
        />

        {isLoading && <div>Loading....</div>}
        {error && <div>{error.toString()}</div>}

        <div className='mt-8 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
          {
            posts.map(post => (
              <Link 
              to={`/posts/${post._id}`}
              key={post._id} 
              className='group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300'
              >
                <div className='relative'>
                  <img src={post?.coverImg}  className='h-72 w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105' />
                  <div className='p-5 bg-white'>
                    <h2 className='text-lg font-semibold text-gray-800 group-hover:text-[#1E73BE] transition-colors duration-300'>
                      {post?.title}
                    </h2>
                    <p className='text-sm text-gray-500 mt-2'>
                      {post?.description.substring(0, 60)}...
                    </p>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
    </div>
  )
}

export default Posts;
