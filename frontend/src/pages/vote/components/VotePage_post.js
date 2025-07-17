import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VotePagePost() {
  const [posts, setPosts] = useState([]);

  //벡엔드 호출
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
      <h2>Like TOP 10</h2>
      <div className="post-list">
        {posts.map((post, index) => (
          <div key={post.postId} className="post-item">
            <p className="rank">NO.{index + 1}</p> {/*순위 표시*/}
            <div className="post-item-img">
              <img className="post-img" src={post.imageUrl} alt="post" />
            </div>
            <p>{post.postTitle}</p>
            <img
              className="profile-img"
              src={post.userProfImgUrl}
              alt="profile"
            />
            <p>{post.userNickname}</p>
            <p>{post.userCount} like</p>
            <p>{post.locationTag}</p>
            <p>{post.postContent}</p>
            <p>{post.createdDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VotePagePost;
