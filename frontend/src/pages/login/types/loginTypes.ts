// 로그인 성공 시 서버로부터 받는 유저 정보
export interface User {
  userId: number;
  userLoginId: string;
  userName: string; // userUsername -> userName으로 변경
  userNickname: string;
  userBio: string | null;
  userEmail: string;
  ruleId: number;
  userRule: string;
  userProfileImageUrl: string | null; // 추가
  createDate: string | null; // 추가 (Timestamp를 문자열로 받을 수 있음)
  createdId: string | null; // 추가
  updatedDate: string | null; // 추가
  updatedId: string | null; // 추가
}