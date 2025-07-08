// 로그인 성공 시 서버로부터 받는 유저 정보
export interface User {
  userId: number;
  userLoginId: string;
  userUsername: string;
  userNickname: string;
  userBio: string | null;
  userEmail: string;
  ruleId: number;
  userRule: string;
}