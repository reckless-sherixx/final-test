import React from 'react'
import { formatDate } from '../../../utility/formatDate';
import EditorJSHTML from "editorjs-html"

const editorJSHTML = EditorJSHTML();

const singlePostCard = ({post}) => {
  const {title,description,content,coverImg,category,author,rating,createdAt} = post || {};
  const htmlContent = editorJSHTML.parse(content).join('');

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
        <div className='flex items-center gap-2'>
          <span className='text-lg font-semibold text-gray-900'>Rating:</span>
          <span className='text-sm font-medium text-gray-500'>{rating} (based on 2,370 reviews)</span>
        </div>
      </div>
    </div>
    </>
  )
}

export default singlePostCard;
