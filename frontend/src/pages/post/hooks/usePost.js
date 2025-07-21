import { useState, useCallback } from 'react';
import { fetchPosts, fetchPostById, createPost, updatePost as updatePostApi, deletePost, reportPost as reportPostApi } from '../../../api/PostApi';

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
            const data = await fetchPostById(postId);
            setPost(data);
        } catch (err) {
            setError(`게시글 (ID: ${postId})을 불러오는 데 실패했습니다.`);
            console.error(`Failed to fetch post by ID ${postId}:`, err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 새 게시글 추가 함수
    const addPost = useCallback(async (postData, imageFiles) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await createPost(postData, imageFiles);
            setMessage(response.message || '게시글이 성공적으로 작성되었습니다.');
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || '게시글 작성에 실패했습니다.');
            console.error('Failed to add post:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // 게시글 수정 함수
    const modifyPost = useCallback(async (postId, postData, newImageFiles) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await updatePostApi(postId, postData, newImageFiles);
            setMessage(response.message || '게시글이 성공적으로 업데이트되었습니다.');
            return response.data;
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
    
    // 게시글 신고 함수
    const reportPost = useCallback(async (postId, reportReason) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await reportPostApi(postId, reportReason);
            setMessage(response.message || '게시글이 성공적으로 신고되었습니다.');
            return response; // 성공 응답 객체 반환
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || '게시글 신고에 실패했습니다.';
            setError(errorMsg);
            console.error('Failed to report post:', err);
            throw new Error(errorMsg); // 실패 메시지를 담아 에러를 throw
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
        setError,
        reportPost,
    };
};

export default usePost;