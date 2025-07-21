import React, { useEffect, useState } from 'react';
import { FaUser, FaHeart, FaMapMarkerAlt, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import './VotePage_post.css';

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
              <img className="post-img" src={`data:image/jpeg;base64,${post.imageUrl}`} alt="post" />
            </div>
            <div className="user-info55">
              <img
                className="profile-img"
                src={post.userProfImgUrl}
                alt="profile"
              />
              <p className="user-nickname">{post.userNickname}</p>
            </div>
            <p><FaHeart /> {post.userCount} like</p>
            <p><FaMapMarkerAlt /> {post.locationTag}</p>
            <p><FaFileAlt /> {post.postContent}</p>
            <p><FaCalendarAlt /> {post.createdDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VotePagePost;
