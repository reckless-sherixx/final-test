import React, { useState } from "react";

const RichTextPostCreator = ({
  addPost,
  value,
  onChange,
}) => {
  const handleStyleInsert = (tag) => {
    const selectedText = window.getSelection().toString();
    if (!selectedText) return;

    const styledText = `<${tag}>${selectedText}</${tag}>`;
    setContent(content.replace(selectedText, styledText));
    addPost()
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
        value={value}
        onChange={onChange}
        placeholder="What's happening?"
      ></textarea>
      <button onClick={addPost}>Post</button>
    </div>
  );
};

export default RichTextPostCreator;
