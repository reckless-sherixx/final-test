import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

import Modal from "../../components/Modal/Modal"
import Avatar from "../../components/Avatar/Avatar"
import RichTextPostCreator from "../../components/RichTextEditor/RichTextEditor"

import { clearUserData } from "../../common"

import "./Announcement.css"

const Announcements = () => {
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [content, setContent] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState("")

  const openCommentsModal = (post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const closeCommentsModal = () => {
    setSelectedPost(null)
    setNewComment("") // Réinitialise le champ de saisie
    setIsModalOpen(false)
  }

  const addComment = () => {
    if (!newComment.trim()) return
  
    const updatedPosts = posts.map((post) => {
      if (post.id === selectedPost.id) {
        const updatedPost = {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              content: newComment,
              author: {
                username: "CurrentUser",
                avatar: `https://i.pravatar.cc/40?u=CurrentUser${Date.now()}`,
              },
            },
          ],
        }
  
        // Ensure selectedPost is updated to reflect the changes
        setSelectedPost(updatedPost)
  
        return updatedPost
      }
      return post
    })
  
    setPosts(updatedPosts)
    setNewComment("")
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const trimmedContent = content.trim()
    if (!trimmedContent) return

    const response = await fetch(import.meta.env.VITE_API_URL + "/posts", {
      method: "POST",
      body: JSON.stringify({ content }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        clearUserData()
        navigate("/login")
      }

      return
    }

    const jsonResponse = await response.json()
    
    setPosts([ { ...jsonResponse.post }, ...posts ])
    setContent("")
  }

  const fetchPosts = async () => {
    const response = await fetch(import.meta.env.VITE_API_URL + "/posts")

    if (!response.ok) {
      return
    }

    setPosts(await response.json())
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="Ann">
      <div className="ann-create-post">
        <RichTextPostCreator
          value={content}
          onChange={handleContentChange}
          handleSubmit={handleSubmit}
        />
      </div>
      {posts.map((post) => (
        <div key={post.id} className="ann-post">
          <div className="ann-post-header">
            <Avatar username={post.author.username} />
            <span className="ann-username" style={{marginLeft:"10px"}}>{post.author.username}</span>
          </div>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          <button onClick={() => openCommentsModal(post)} className="ann-comment-button">
            💬 {post.comments.length}
          </button>
        </div>
      ))}
      {selectedPost && (
        <Modal isOpen={isModalOpen} onClose={closeCommentsModal}>
          <div className="ann-modal-post">
            <div className="ann-post-header">
              <Avatar username={selectedPost.author.username} />
              <span className="ann-username" style={{marginLeft:"10px"}}>{selectedPost.author.username}</span>
            </div>
            <p>{selectedPost.content}</p>
          </div>

          <div className="ann-comments-section">
            <h3>Comments</h3>
            {selectedPost.comments.map((comment) => (
              <div key={comment.id} className="ann-comment">
                <Avatar username={comment.author.username}/>
                <div className="ann-comment-content">
                  <span className="ann-username" style={{marginLeft:"10px"}}>{comment.author.username}</span>
                  <p style={{marginLeft:"10px"}}>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="ann-add-comment">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={addComment}>Post</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Announcements