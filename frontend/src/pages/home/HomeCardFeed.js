import React, { useState } from "react";
import "./HomeCardFeed.css";
import img1 from "../../assets/images/001_01.png";
import img2 from "../../assets/images/001_02.png";
import profile from "../../assets/images/002_01.png";
import KakaoMap from "../../components/KakaoMap";

const initialData = [
  {
    id: 1,
    image: img1,
    mapUrl: "https://map.kakao.com/?q=부산 중구 자갈치해안로 57-1",
    name: "수정횟집",
    address: "부산 중구 자갈치해안로 57-1 1층",
    comments: [{ id: 1, userId: "yyyy1234", text: "너무 좋아용", likes: 150 }],
  },
  {
    id: 2,
    image: img2,
    mapUrl: "https://map.kakao.com/?q=포항 북구 해안로 203-1",
    name: "퐝물회",
    address: "경북 포항시 북구 해안로 203-1 1층",
    comments: [{ id: 2, userId: "yyyy1234", text: "너무 맛나용", likes: 200 }],
  },
];

const HomeCardFeed = () => {
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

  // 검색 버튼 클릭 시 검색어 적용
  const handleSearch = () => {
    setSearch(searchInput);
  };

  // 댓글 입력창 값 변경 시 상태 저장
  const handleInputChange = (cardId, value) => {
    setCommentInputs((prev) => ({ ...prev, [cardId]: value }));
  };

  // 댓글 추가 함수
  const handleAddComment = (cardId) => {
    const newComment = commentInputs[cardId];
    if (!newComment || !newComment.trim()) return;

    const updated = data.map((item) => {
      if (item.id === cardId) {
        return {
          ...item,
          comments: [
            ...item.comments,
            {
              id: Date.now(),
              userId: "guestUser",
              text: newComment,
              likes: 0,
            },
          ],
        };
      }
      return item;
    });

    setData(updated);
    setCommentInputs((prev) => ({ ...prev, [cardId]: "" }));
  };

  // 찜(즐겨찾기) 토글
  const toggleFavorite = (cardId) => {
    setFavorites((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  // 댓글 좋아요 증가
  const likeComment = (commentId) => {
    setLikes((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1,
    }));
  };

  // 댓글 수정 시작
  const startEditing = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditingText(currentText);
  };

  // 댓글 수정 취소
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  // 댓글 신고 처리
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

  // 수정된 댓글 저장
  const saveEditedComment = (cardId, commentId) => {
    const updated = data.map((item) => {
      if (item.id === cardId) {
        return {
          ...item,
          comments: item.comments.map((c) =>
            c.id === commentId ? { ...c, text: editingText } : c
          ),
        };
      }
      return item;
    });
    setData(updated);
    cancelEditing();
  };

  // 댓글 삭제
  const deleteComment = (cardId, commentId) => {
    const updated = data.map((item) => {
      if (item.id === cardId) {
        return {
          ...item,
          comments: item.comments.filter((c) => c.id !== commentId),
        };
      }
      return item;
    });
    setData(updated);
  };

  // 카드별 총 좋아요 수 계산
  const getTotalLikes = (item) =>
    item.comments.reduce((sum, c) => sum + (likes[c.id] || c.likes), 0);

  // 필터링 + 정렬
  const filteredData = data
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (filter === "popular") {
        return getTotalLikes(b) - getTotalLikes(a);
      } else if (filter === "favorites") {
        return (favorites[b.id] ? 1 : 0) - (favorites[a.id] ? 1 : 0);
      }
      return 0;
    });

  return (
    <div className="home-feed">
      {/* 🔍 검색 + 필터 */}
      <div className="search-filter-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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

      {/* 🃏 카드 리스트 */}
      <div className="restaurant-card-grid">
        {filteredData.map((item) => (
          <div key={item.id} className="restaurant-card">
            {/* 카드 상단 : 이미지 + 지도 */}
            <div className="image-map-wrapper">
              <div className="restaurant-image">
                <img src={item.image} alt="thumbnail" />
                <button
                  className="like-button"
                  onClick={() => toggleFavorite(item.id)}
                >
                  {favorites[item.id] ? "♥" : "♡"}
                </button>
              </div>
              <div className="restaurant-map">
                <KakaoMap address={item.address} />
              </div>
            </div>

            {/* 식당명 + 주소 */}
            <div className="restaurant-info">
              <div>
                <strong>■ 식당명</strong>
                <br />
                {item.name}
              </div>
              <div>
                <strong>📍 주소</strong>
                <br />
                {item.address}
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
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
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
                        <button onClick={() => startEditing(c.id, c.text)}>
                          수정
                        </button>
                        <button onClick={() => deleteComment(item.id, c.id)}>
                          삭제
                        </button>
                      </div>
                      <span className="review-like">
                        <button onClick={() => likeComment(c.id)}>👍</button>{" "}
                        {likes[c.id] !== undefined ? likes[c.id] : c.likes}
                        <button
                          onClick={() => reportComment(c.id)}
                          className="report-button"
                          disabled={reportedComments.includes(c.id)}
                        >
                          신고
                        </button>
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* 댓글 입력 */}
            <div className="review-input">
              <input
                type="text"
                value={commentInputs[item.id] || ""}
                onChange={(e) => handleInputChange(item.id, e.target.value)}
                placeholder="댓글달기"
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
