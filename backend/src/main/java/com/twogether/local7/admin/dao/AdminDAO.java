package com.twogether.local7.admin.dao;

import com.twogether.local7.comment.vo.CommentVO;
import com.twogether.local7.pagintion.Pageable;
import com.twogether.local7.post.vo.PostVO;
import com.twogether.local7.report.vo.ReportVO;
import com.twogether.local7.restaurant.vo.RestaurantVO;
import com.twogether.local7.review.vo.ReviewVO;
import com.twogether.local7.user.vo.UserVO; // UserVO 임포트
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface AdminDAO {

    // 사용자 관련
    List<UserVO> selectAllUsers(@Param("pageable") Pageable pageable);
    int countAllUsers(); // 총 사용자 수 조회 추가
    int deleteUser(Long userId); // 사용자 삭제 추가
    UserVO findByUserId(@Param("userId") Long userId); // 사용자 ID로 사용자 정보 조회 (관리자 권한 확인용)

    // 게시글 관련
    List<PostVO> selectAllPosts(@Param("pageable") Pageable pageable);
    int countAllPosts(); // 총 게시글 수 조회 추가
    int updatePost(PostVO postVO); // 관리자용 게시글 업데이트
    void deletePost(Long postId); // 게시글 삭제 (반환 타입 void로 변경)
    void deleteImagesByPostId(@Param("postId") Long postId); // 게시글 ID로 이미지 삭제

    // 댓글 관련
    List<CommentVO> selectAllComments(@Param("pageable") Pageable pageable);
    int countAllComments(); // 총 댓글 수 조회 추가
    void deleteComment(Long commentId); // 댓글 삭제

    // 리뷰 관련
    List<ReviewVO> selectAllReviews(@Param("pageable") Pageable pageable); // 리뷰 목록 조회 추가
    int countAllReviews(); // 총 리뷰 수 조회 추가
    void deleteReview(Long reviewId); // 리뷰 삭제

    // 신고 관련
    List<ReportVO> selectAllReports(@Param("pageable") Pageable pageable);
    int countAllReports(); // 총 신고 수 조회 추가
    int updateReportStatus(@Param("reportId") Long reportId, @Param("status") String status);

    // 특정 신고 내역 조회
    ReportVO getReportById(@Param("reportId") Long reportId);

    // 사용자가 작성한 기록 삭제
    void deleteAllPostsByUserId(@Param("userId") Long userId);
    void deleteAllCommentsByUserId(@Param("userId") Long userId);
    void deleteAllReportsByUserId(@Param("userId") Long userId);
    void deleteAllReviewsByUserId(@Param("userId") Long userId); // 리뷰 기록 삭제 추가


    RestaurantVO findRestaurantById(Long restaurantId);
}
