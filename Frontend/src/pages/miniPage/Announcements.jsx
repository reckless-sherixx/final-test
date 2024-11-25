import React, { useState, useEffect } from "react";
import "./Announcement.css";
import Modal from "../../components/Modal/Modal";
import Avatar from "../../components/Avatar/Avatar";
import RichTextPostCreator from "../../components/RichTextEditor/RichTextEditor";

const Announcements = () => {
  // Charger les posts depuis le LocalStorage ou utiliser des données par défaut
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("posts");
    return savedPosts ? JSON.parse(savedPosts) : [
      {
        id: 1,
        content: "My first post!",
        author: { username: "JohnDoe", avatar: "https://i.pravatar.cc/40?u=JohnDoe" },
        comments: [
          {
            id: 1,
            content: "Nice post!",
            author: { username: "JaneDoe", avatar: "https://i.pravatar.cc/40?u=JaneDoe" },
          },
          {
            id: 2,
            content: "I agree!",
            author: { username: "User123", avatar: "https://i.pravatar.cc/40?u=User123" },
          },
        ],
      },
    ];
  });

  const [newPostContent, setNewPostContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // Post sélectionné pour la modal
  const [newComment, setNewComment] = useState(""); // Nouveau commentaire

  // Sauvegarde les posts dans le LocalStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const createPost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      content: newPostContent,
      author: {
        username: "CurrentUser",
        avatar: `https://i.pravatar.cc/40?u=CurrentUser${Date.now()}`,
      },
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };


  const openCommentsModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setSelectedPost(null);
    setNewComment(""); // Réinitialise le champ de saisie
    setIsModalOpen(false);
  };

  const addComment = () => {
    if (!newComment.trim()) return;
  
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
        };
  
        // Ensure selectedPost is updated to reflect the changes
        setSelectedPost(updatedPost);
  
        return updatedPost;
      }
      return post;
    });
  
    setPosts(updatedPosts);
    setNewComment("");
  };

  return (
    <div className="Ann">
      <div className="ann-create-post">
        <RichTextPostCreator addPost={createPost}/>
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
  );
};

export default Announcements;