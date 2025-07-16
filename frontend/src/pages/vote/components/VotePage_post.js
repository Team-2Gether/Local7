import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VotePagePost() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/vote/posts') //
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.error('게시물 불러오기 실패:', err);
      });
  }, []);

  return (
    <div className="post-section">
      <h2>이달의 게시물 인기순</h2>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.postId} className="post-item">
            <h2>{post.locationTag}</h2>
            <h4>{post.postTitle}</h4>
            <p>{post.postContent}</p>
            <p>{post.createdDate}</p>
            <small>{post.userCount} like</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VotePagePost;
