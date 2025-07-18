import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import usePost from '../hooks/usePost';
import useLike from '../hooks/useLike';

import './Post.css'; 

function PostList({ currentUser, selectedCity }) {

    const { posts, loading, error, message, loadAllPosts, removePost, setMessage, setPosts } = usePost();
    const { toggleLike, likeLoading, likeError } = useLike();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('latest');
    const [filteredPosts, setFilteredPosts] = useState([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOption, setSearchOption] = useState('all'); 

    useEffect(() => {
        loadAllPosts(sortBy);
    }, [loadAllPosts, sortBy]);

        useEffect(() => {
        if (posts.length > 0) {
            // 1. 도시 필터링
            let currentFilteredPosts = [];
            if (selectedCity === '전체') {
                currentFilteredPosts = posts;
            } else {
                currentFilteredPosts = posts.filter(post => post.locationTag === selectedCity);
            }

            // 2. 검색어 필터링
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                currentFilteredPosts = currentFilteredPosts.filter(post => {
                    switch (searchOption) {
                        case 'title':
                            return post.postTitle.toLowerCase().includes(searchLower);
                        case 'author':
                            return post.userNickname.toLowerCase().includes(searchLower);
                        case 'content':
                            return post.postContent.toLowerCase().includes(searchLower);
                        case 'location': // 지역 검색 옵션 추가
                            return post.locationTag.toLowerCase().includes(searchLower);
                        case 'all':
                        default:
                            return (
                                post.postTitle.toLowerCase().includes(searchLower) ||
                                post.postContent.toLowerCase().includes(searchLower) ||
                                post.userNickname.toLowerCase().includes(searchLower) ||
                                post.locationTag.toLowerCase().includes(searchLower)
                            );
                    }
                });
            }

            setFilteredPosts(currentFilteredPosts);
        } else {
            setFilteredPosts([]);
        }
    }, [posts, selectedCity, searchQuery, searchOption]);

    const handleDelete = async (postId) => {
        console.log('Current User:', currentUser);
        // alert 대신 커스텀 모달 UI 사용 권장
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await removePost(postId);
                loadAllPosts();
            } catch (err) {
                console.error('게시글 삭제 오류:', err);
                // alert 대신 커스텀 모달 UI 사용 권장
                alert(err.response?.data?.message || '게시글 삭제에 실패했습니다. 권한을 확인해주세요.');
            }
        }
    };

    // 좋아요 버튼 클릭 핸들러
    const handleToggleLike = async (postId, e) => {
        e.stopPropagation(); // 이벤트 버블링 방지 (게시글 상세 페이지로 이동하는 것을 막음)

        if (!currentUser) {
            // alert 대신 커스텀 모달 UI 사용 권장
            alert('로그인 후 좋아요를 누를 수 있습니다.');
            return;
        }

        try {
            const result = await toggleLike(postId); // 좋아요 토글 API 호출
            // posts 상태 업데이트
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.postId === postId
                        ? { ...post, liked: result.liked, likeCount: result.likeCount }
                        : post
                )
            );
            setMessage(result.message); // 좋아요 성공/취소 메시지 표시
        } catch (err) {
            console.error('좋아요 처리 오류:', err);
            // alert 대신 커스텀 모달 UI 사용 권장
            alert(err.message); // 에러 메시지 표시
        }
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

     const handlePostClick = (postId) => {
        navigate(`/posts/${postId}`); // postId를 포함한 URL로 이동
    };

    if (loading) return <div className="loading-message">게시글 로딩 중...</div>;
    if (error) return <div className="error-message">오류: {error}</div>;

    return (

        <div className="post-list-container">
            {/*{message && <div className="success-message">{message}</div>}*/}
            {likeError && <div className="error-message">{likeError}</div>}

            <div className="post-actions-top">
                {/* 정렬 드롭다운 추가 */}
                <div className="sort-options">
                    <label htmlFor="sortBy">정렬:</label>
                    <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="latest">최신순</option>
                        <option value="likes">좋아요순</option>
                        <option value="comments">댓글순</option>
                    </select>
                </div>

                <div className="search-container">
                    <select
                        className="search-option-select"
                        value={searchOption}
                        onChange={(e) => setSearchOption(e.target.value)}
                    >
                        <option value="all">전체</option>
                        <option value="title">제목</option>
                        <option value="author">작성자</option>
                        <option value="content">내용</option>
                        <option value="location">지역</option>
                    </select>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="검색어를 입력하세요..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => navigate('/posts/new')}
                    className="post-button create-button"
                >
                    새 게시글 작성
                </button>
            </div>
            <div className="post-grid-wrapper">
                {filteredPosts.length === 0 ? (
                    <p className="no-posts-message">게시글이 없습니다.</p>
                ) : (
                    <ul className="post-grid">
                        {filteredPosts.map((post) => {
                        return (
                            <li key={post.postId} className="post-card">
                                {/* 게시글 상세 페이지로 이동 링크 */}
                                <div onClick={() => handlePostClick(post.postId)} style={{ cursor: 'pointer' }}>
                                    {/* 이미지 미리보기 추가 */}
                                    <div className="post-thumbnail">
                                        {post.firstImageUrl ? (
                                        <img
                                            src={`data:image/jpeg;base64,${post.firstImageUrl}`}
                                            alt="게시글 미리보기"
                                            className="thumbnail-image"
                                        />
                                        ) : (
                                        <div className="no-image">
                                            이미지가 없습니다
                                        </div>
                                        )}
                                    </div>
                                    
                                    <h2 className="post-card-title">{post.postTitle}</h2>
                                    <p className="post-card-content">{post.postContent}</p>
                                    <p className="post-card-meta">작성자: {post.userNickname}</p>
                                    <p className="post-card-meta">작성일: {new Date(post.createdDate).toLocaleDateString()}</p>
                                    <p className="post-card-likes">
                                        <span
                                            className={`like-button1 ${post.liked ? 'liked' : ''}`}
                                            onClick={(e) => handleToggleLike(post.postId, e)} // 좋아요 버튼 클릭 이벤트
                                            disabled={likeLoading}
                                        >
                                            {post.liked ? '❤️' : '🤍'}
                                        </span>
                                        <span className="like-count">❤️{post.likeCount || 0}</span>
                                        <span className="comment-count">💬 {post.commentCount}</span>
                                    </p>

                                    <p className="post-card-meta">위치: {post.locationTag}</p>
                                </div>

                                <div className="post-card-actions">

                                {currentUser && (currentUser.userId === post.userId || currentUser.userLoginId === 'admin') && (

                                    <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('수정하시겠습니까?')) {
                                                navigate(`/posts/edit/${post.postId}`);
                                            }
                                        }}
                                        className="post-action-button edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('삭제하시겠습니까?')) {
                                                handleDelete(post.postId);
                                            }
                                        }}
                                        className="post-action-button delete"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                    </>
                                )}
                                </div>
                            </li>
                        );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default PostList;
