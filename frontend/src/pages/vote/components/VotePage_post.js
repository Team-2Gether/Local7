import React, { useEffect, useState } from 'react';
import {
  FaUser,
  FaHeart,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCalendarAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/css/VotePage_post.css';

function VotePagePost() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  //벡엔드 호출
  useEffect(() => {
    axios
      .get('http://192.168.0.10:8080/api/vote/posts') //
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.error('게시물 불러오기 실패:', err);
      });
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`); // 게시글 ID를 포함한 경로로 이동
  };

  return (
    <div className="post-section">
      <h2>Like TOP 10</h2>
      <div className="post-list">
        {posts.map((post, index) => (
          <div
            key={post.postId}
            className="post-item1"
            onClick={() => handlePostClick(post.postId)}
          >
            <p className="rank">NO.{index + 1}</p> {/*순위 표시*/}
            <div className="post-item-img">
              <img
                className="post-img"
                src={`data:image/jpeg;base64,${post.imageUrl}`}
                alt="post"
              />
            </div>
            <div className="user-info55">
              <img
                className="profile-img"
                src={post.userProfImgUrl}
                alt="profile"
              />
              <p className="user-nickname">{post.userNickname}</p>
            </div>
            <p>
              <FaHeart /> {post.userCount} like
            </p>
            <p>
              <FaMapMarkerAlt /> {post.locationTag}
            </p>
            <p>
              <FaFileAlt /> {post.postContent}
            </p>
            <p>
              <FaCalendarAlt /> {post.createdDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VotePagePost;
