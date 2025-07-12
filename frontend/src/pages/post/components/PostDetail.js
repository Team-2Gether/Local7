import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePosts from '../hooks/usePost';
import '../../../assets/css/post.css'; // 기존 post.css 재활용
import '../../../assets/css/PostDetail.css'; // MyPosts.css와 유사한 스타일을 위한 새 CSS

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { post, loading, error, loadPostById, removePost, setMessage } = usePosts();

    useEffect(() => {
        if (id) {
            loadPostById(parseInt(id));
        }
    }, [id, loadPostById]);

    const handleDelete = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await removePost(parseInt(id));
                alert('게시글이 성공적으로 삭제되었습니다.');
                navigate('/posts'); // 삭제 후 게시글 목록으로 이동
            } catch (err) {
                console.error('게시글 삭제 오류:', err);
                setMessage('게시글 삭제에 실패했습니다.');
            }
        }
    };

    if (loading) {
        return <div className="post-detail-container loading">게시글을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="post-detail-container error-message">오류: {error}</div>;
    }

    if (!post) {
        return <div className="post-detail-container no-post">게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="post-detail-page">
            <div className="post-detail-content-area">
                <div className="post-detail-container">
                    <h2 className="post-detail-title">{post.postTitle}</h2>
                    <p className="post-detail-meta">
                        작성자: {post.userName || '알 수 없음'} | 작성일: {new Date(post.createdDate).toLocaleString()}
                    </p>
                    <div className="post-detail-content">
                        <p>{post.postContent}</p>
                    </div>

                    {/* post.images 배열이 있을 경우 (여러 이미지) */}
                    {post.images && post.images.length > 0 && (
                        <div className="post-detail-images">
                            {post.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:8080${image.imageUrl}`}
                                    alt={`게시글 이미지 ${index + 1}`}
                                    className="post-detail-image"
                                />
                            ))}
                        </div>
                    )}
                    {/* firstImageUrl만 있는 경우 (images 배열이 비어있거나 없는 경우) */}
                    {(!post.images || post.images.length === 0) && post.firstImageUrl && (
                        <div className="post-detail-images">
                            <img
                                src={`http://localhost:8080${post.firstImageUrl}`}
                                alt="게시글 대표 이미지"
                                className="post-detail-image"
                            />
                        </div>
                    )}


                    {post.locationTag && <p className="post-detail-location-tag">위치 태그: {post.locationTag}</p>}
                    <div className="post-detail-actions">
                        <button
                            onClick={() => navigate(`/posts/edit/${post.postId}`)}
                            className="post-detail-button edit"
                        >
                            수정
                        </button>
                        <button
                            onClick={handleDelete}
                            className="post-detail-button delete"
                        >
                            삭제
                        </button>
                        <button
                            onClick={() => navigate('/posts')}
                            className="post-detail-button back"
                        >
                            목록으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;