import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';

import AddButton from '@/components/AddButton/AddButton';
import Modal from '@/components/Modal';
import PostList from './PostList';
import CreatePost from './CreatePost';
import EditPost from './EditPost';

import { fetchPosts } from "@/api"
import { createPostRoute } from "@/router"
import { Post } from "@/types"

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post|null>(null)

  const isEditModalOpen = editingPost !== null

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  const fetchData = async () => {
    const posts = await fetchPosts()
    setPosts(posts)
    setLoading(false)
  }

  const editPost = (post:Post) => {
    setEditingPost(post)
  }

  const closeEditModal = () => {
    setEditingPost(null)
  }

  const addPostToList = (post:Post) => {
    setPosts([
      ...posts,
      post,
    ])
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <PostList
        posts={posts}
        editPost={editPost}
      />
      <AddButton onClick={openModal} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-24 font-semibold">Create a new Post</h2>
        <CreatePost
          addPostToList={addPostToList}
          closeModalOnSubmit={closeModal}
        />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <h2 className="text-24 font-semibold">Edit Post</h2>
        <EditPost closeModalOnSubmit={closeModal} />
      </Modal>
    </>
  )
}

export default Posts