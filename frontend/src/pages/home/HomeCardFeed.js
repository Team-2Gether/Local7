import React, { useState } from "react";
import "./HomeCardFeed.css";
import img1 from "../../assets/images/001_01.png"; // 음식점 이미지1
import img2 from "../../assets/images/001_02.png"; // 음식점 이미지2
import profile from "../../assets/images/002_01.png"; // 댓글 작성자 프로필 이미지
import KakaoMap from "../../components/KakaoMap"; // 주소 기반 카카오 지도 컴포넌트

// 초기 데이터 배열
const initialData = [
  {
    id: 1,
    image: img1,
    mapUrl: "https://map.kakao.com/?q=부산 중구 자갈치해안로 57-1",
    name: "수정횟집",
    address: "부산 중구 자갈치해안로 57-1 1층",
    city: "부산",
    comments: [{ id: 1, userId: "yyyy1234", text: "너무 좋아용", likes: 150 }],
  },
  {
    id: 2,
    image: img2,
    mapUrl: "https://map.kakao.com/?q=포항 북구 해안로 203-1",
    name: "퐝물회",
    address: "경북 포항시 북구 해안로 203-1 1층",
    city: "포항",
    comments: [{ id: 2, userId: "yyyy1234", text: "너무 맛나용", likes: 200 }],
  },
];

const HomeCardFeed = ({ selectedCity }) => {
  const [data, setData] = useState(initialData);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [commentInputs, setCommentInputs] = useState({});
  const [favorites, setFavorites] = useState({});
  const [likes, setLikes] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [reportedComments, setReportedComments] = useState([]);

  // 검색 버튼 클릭
  const handleSearch = () => setSearch(searchInput.trim());

  // 댓글 입력값 변경
  const handleInputChange = (cardId, value) =>
    setCommentInputs((prev) => ({ ...prev, [cardId]: value }));

  // 댓글 추가
  const handleAddComment = (cardId) => {
    const newComment = commentInputs[cardId];
    if (!newComment?.trim()) return;

    const updated = data.map((item) =>
      item.id === cardId
        ? {
            ...item,
            comments: [
              ...item.comments,
              {
                id: Date.now(),
                userId: "guestUser",
                text: newComment.trim(),
                likes: 0,
              },
            ],
          }
        : item
    );

    setData(updated);
    setCommentInputs((prev) => ({ ...prev, [cardId]: "" }));
  };

  // 찜 토글
  const toggleFavorite = (cardId) =>
    setFavorites((prev) => ({ ...prev, [cardId]: !prev[cardId] }));

  // 댓글 좋아요
  const likeComment = (commentId) =>
    setLikes((prev) => ({ ...prev, [commentId]: (prev[commentId] || 0) + 1 }));

  // 댓글 수정 시작
  const startEditing = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditingText(text);
  };

  // 댓글 수정 취소
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  // 댓글 신고
  const reportComment = (commentId) => {
    if (reportedComments.includes(commentId)) {
      alert("이미 신고하신 댓글입니다.");
      return;
    }
    if (window.confirm("정말 이 댓글을 신고하시겠습니까?")) {
      setReportedComments((prev) => [...prev, commentId]);
      alert("신고가 접수되었습니다.");
    }
  };

  // 댓글 수정 저장
  const saveEditedComment = (cardId, commentId) => {
    if (!editingText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    const updated = data.map((item) =>
      item.id === cardId
        ? {
            ...item,
            comments: item.comments.map((c) =>
              c.id === commentId ? { ...c, text: editingText.trim() } : c
            ),
          }
        : item
    );

    setData(updated);
    cancelEditing();
  };

  // 댓글 삭제
  const deleteComment = (cardId, commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    const updated = data.map((item) =>
      item.id === cardId
        ? {
            ...item,
            comments: item.comments.filter((c) => c.id !== commentId),
          }
        : item
    );

    setData(updated);

    if (editingCommentId === commentId) cancelEditing();
  };

  // 음식점 전체 좋아요 수 (댓글 좋아요 + 추가 좋아요 합산)
  const getTotalLikes = (item) =>
    item.comments.reduce(
      (sum, c) => sum + (likes[c.id] !== undefined ? likes[c.id] : c.likes),
      0
    );

  // 필터링 및 정렬
  const filteredData = data
    .filter(
      (item) =>
        (selectedCity === "전체" || item.city === selectedCity) &&
        item.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "popular") return getTotalLikes(b) - getTotalLikes(a);
      if (filter === "favorites")
        return (favorites[b.id] ? 1 : 0) - (favorites[a.id] ? 1 : 0);
      return 0;
    });

  return (
    <div className="home-feed">
      {/* 검색 및 필터 */}
      <div className="search-filter-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button onClick={handleSearch}>검색</button>
        </div>

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            전체
          </button>
          <button
            className={filter === "popular" ? "active" : ""}
            onClick={() => setFilter("popular")}
          >
            인기순
          </button>
          <button
            className={filter === "favorites" ? "active" : ""}
            onClick={() => setFilter("favorites")}
          >
            찜 많은 순
          </button>
        </div>
      </div>

      {/* 음식점 카드 그리드 */}
      <div className="restaurant-card-grid">
        {filteredData.length === 0 && (
          <p className="no-results">검색 조건에 맞는 음식점이 없습니다.</p>
        )}

        {filteredData.map((item) => (
          <div key={item.id} className="restaurant-card">
            {/* 이미지 및 지도 */}
            <div className="image-map-wrapper">
              <div className="restaurant-image">
                <img src={item.image} alt={`${item.name} 대표 이미지`} />
                <button
                  className="like-button"
                  aria-label={favorites[item.id] ? "찜 해제" : "찜하기"}
                  onClick={() => toggleFavorite(item.id)}
                >
                  {favorites[item.id] ? "♥" : "♡"}
                </button>
              </div>

              <div className="restaurant-map">
                <KakaoMap address={item.address} />
              </div>
            </div>

            {/* 식당 정보 */}
            <div className="restaurant-info">
              <div>
                <strong>■ 식당명</strong>
                <br /> {item.name}
              </div>
              <div>
                <strong>📍 주소</strong>
                <br /> {item.address}
              </div>
            </div>

            {/* 댓글 리스트 */}
            <div className="review-list">
              {item.comments.map((c) => (
                <div className="review-item" key={c.id}>
                  <img src={profile} alt="profile" className="profile" />
                  <span className="comment-id">{c.userId}</span>

                  {editingCommentId === c.id ? (
                    <>
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="edit-input"
                      />
                      <div className="review-actions">
                        <button onClick={() => saveEditedComment(item.id, c.id)}>
                          저장
                        </button>
                        <button onClick={cancelEditing}>취소</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="comment-text">{c.text}</span>
                      <div className="review-actions">
                        <button onClick={() => startEditing(c.id, c.text)}>수정</button>
                        <button onClick={() => deleteComment(item.id, c.id)}>삭제</button>
                      </div>

                      <span className="review-like">
                        <button onClick={() => likeComment(c.id)} aria-label="좋아요">
                          👍
                        </button>{" "}
                        {likes[c.id] !== undefined ? likes[c.id] : c.likes}
                        <button
                          onClick={() => reportComment(c.id)}
                          className="report-button"
                          disabled={reportedComments.includes(c.id)}
                          aria-label="신고"
                        >
                          신고
                        </button>
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* 댓글 입력창 */}
            <div className="review-input">
              <input
                type="text"
                value={commentInputs[item.id] || ""}
                onChange={(e) => handleInputChange(item.id, e.target.value)}
                placeholder="댓글달기"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment(item.id);
                }}
              />
              <button onClick={() => handleAddComment(item.id)}>작성</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCardFeed;
