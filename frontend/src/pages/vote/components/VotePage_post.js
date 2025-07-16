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
          <div key={post.postId} className="post-item">
            <p>{post.locationTag}</p>
            <p>{post.postTitle}</p>
            <p>{post.userName}</p>
            <img
              src={post.userProfImgUrl}
              alt="프로필 이미지"
              width="50"
              height="50"
            />
            <p>{post.postContent}</p>
            <p>{post.createdDate}</p>
            <p>{post.userCount} like</p>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default VotePagePost;
