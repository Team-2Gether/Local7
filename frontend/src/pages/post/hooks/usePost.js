// src/hooks/usePost.js
import { useState, useCallback } from 'react';
// PostApi.js에서 함수들을 임포트합니다.
import { fetchPosts, fetchPostById, createPost, updatePost as updatePostApi, deletePost } from '../../../api/PostApi';


const usePost = () => {
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // 모든 게시글을 불러오는 함수 (sortBy 파라미터 추가)
    const loadAllPosts = useCallback(async (sortBy = 'latest') => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPosts(sortBy);
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 특정 게시글을 ID로 불러오는 함수
    const loadPostById = useCallback(async (postId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPostById(postId); // PostApi.js의 fetchPostById 호출
            setPost(data); // 이제 data에 userLoginId가 포함된 완전한 post 객체가 올 것으로 예상
        } catch (err) {
            setError(`게시글 (ID: ${postId})을 불러오는 데 실패했습니다.`);
            console.error(`Failed to fetch post by ID ${postId}:`, err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 게시글 생성 함수 (이미지 파일 인자 추가)
    const addPost = useCallback(async (postData, imageFiles) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await createPost(postData, imageFiles);
            setMessage(response.message || '게시글이 성공적으로 생성되었습니다.');
            return response.data;
        } catch (err) {
            console.error("게시글 생성 오류:", err);
            setError(err.response?.data?.message || '게시글 생성에 실패했습니다.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // 게시글 수정 함수 (newImageFiles 인자 추가)
    const modifyPost = useCallback(async (postId, postData, newImageFiles) => { // newImageFiles 인자 추가
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await updatePostApi(postId, postData, newImageFiles); // newImageFiles 전달
            setMessage(response.message || '게시글이 성공적으로 업데이트되었습니다.');
            return response.data; // 업데이트된 게시글 정보 반환
        } catch (err) {
            setError(err.response?.data?.message || '게시글 업데이트에 실패했습니다.');
            console.error('Failed to update post:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // 게시글 삭제 함수
    const removePost = useCallback(async (postId) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await deletePost(postId);
            setMessage(response.message || '게시글이 성공적으로 삭제되었습니다.');
        } catch (err) {
            setError(err.response?.data?.message || '게시글 삭제에 실패했습니다.');
            console.error('Failed to delete post:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        posts,
        setPost,
        setPosts,
        post,
        loading,
        error,
        message,
        loadAllPosts,
        loadPostById,
        addPost,
        modifyPost,
        removePost,
        setMessage,
        setError
    };
};

export default usePost;