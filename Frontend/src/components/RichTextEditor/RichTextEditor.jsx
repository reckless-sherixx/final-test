import React, { useState } from "react";

const RichTextPostCreator = ({ addPost }) => {
    const [content, setContent] = useState("");

    const handleStyleInsert = (tag) => {
      const selectedText = window.getSelection().toString();
      if (!selectedText) return;
  
      const styledText = `<${tag}>${selectedText}</${tag}>`;
      setContent(content.replace(selectedText, styledText));
    };
  
    const handleSubmit = () => {
      if (content.trim()) {
        addPost(content);
        setContent(""); // Reset the content after posting
      }
    };
  
    return (
      <div className="create-post">
        <div className="text-editor">
          <button onClick={() => handleStyleInsert("b")}>Bold</button>
          <button onClick={() => handleStyleInsert("i")}>Italic</button>
          <button onClick={() => handleStyleInsert("u")}>Underline</button>
          <button onClick={() => handleStyleInsert("s")}>Strikethrough</button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
        ></textarea>
        <button onClick={handleSubmit}>Post</button>
      </div>
    );
  };

export default RichTextPostCreator;