import React from 'react'
import EditorJSHTML from "editorjs-html"
import { useNavigate } from 'react-router-dom';

import { formatDate } from '@/utility/formatDate';
import { useDeletePostMutation } from '@/redux/features/posts/PostsApi';

import DeleteButtonWithConfirmation from '@/components/DeletionButton/DeletionButton';

const editorJSHTML = EditorJSHTML();

const singlePostCard = ({post}) => {
  const {title,description,content,coverImg,category,author,rating,createdAt} = post || {};
  const htmlContent = editorJSHTML.parse(content).join('');
  const [deletePosts] = useDeletePostMutation();
  const navigate = useNavigate();
  
  const handleDelete = async (id) => {
    try {
      const response = await deletePosts(id).unwrap();
      navigate('/posts');

    } catch (error) {
      console.error("Failed to delete post", error);
    }
  }

  return (
    <>
    <div className='bg-white shadow-lg rounded-lg p-8 overflow-hidden'>
      {/* Blog header */}
      <div>
        <h1 className='md:text-4xl text-3xl font-bold mb-4 text-gray-900'>{title}</h1>
        {/* TODO: Need to change author */}
        <p className='mb-6 text-gray-600 text-sm'>
          {formatDate(createdAt)} by <span className='text-[#1E73BE] cursor-pointer hover:underline'>Admin</span>
        </p>
      </div>
      {/* Blog cover image */}
      <div className='relative'>
        <img src={coverImg} alt="cover Image" className='w-full md:h-[520px] object-cover rounded-md hover:opacity-90 transition-opacity duration-300'/>
      </div>
      {/* Blog content */}
      <div className='mt-8 space-y-6'>
        <div dangerouslySetInnerHTML={{__html: htmlContent}} className='space-y-4 leading-relaxed text-gray-700 editorjsdiv' />
      </div>
      <div>
        <DeleteButtonWithConfirmation onDelete={() => handleDelete(post._id)}/>
      </div>
    </div>
    </>
  )
}

export default singlePostCard;
