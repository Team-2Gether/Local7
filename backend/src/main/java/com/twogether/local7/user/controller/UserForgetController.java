// src/main/java/com/twogether/local7/user/controller/UserForgetController.java
package com.twogether.local7.user.controller;

import com.twogether.local7.user.service.UserForgetService; // 새로 정의한 서비스 인터페이스 사용
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/forget")
public class UserForgetController {

    @Autowired
    private UserForgetService userForgetService;

    @PostMapping("/sendCode")
    public ResponseEntity<Map<String, Object>> sendCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = userForgetService.sendAuthCodeToEmail(email);
            if (success) {
                response.put("success", true);
                response.put("message", "인증 코드가 이메일로 전송되었습니다.");
            } else {
                response.put("success", false);
                response.put("message", "이메일 전송에 실패했거나 등록되지 않은 이메일입니다.");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "서버 오류: " + e.getMessage());
            e.printStackTrace();
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verifyCode")
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String authCode = request.get("authCode");
        Map<String, Object> response = new HashMap<>();
        try {
            String foundId = userForgetService.verifyAuthCode(email, authCode);
            if (foundId != null) {
                response.put("success", true);
                if (!foundId.isEmpty()) { // 아이디가 존재하는 경우 (아이디 찾기)
                    response.put("message", "인증 코드가 확인되었습니다.");
                    response.put("foundId", foundId); // 아이디 반환
                } else { // 비밀번호 변경을 위한 인증 코드 확인
                    response.put("message", "인증 코드가 확인되었습니다. 이제 비밀번호를 재설정할 수 있습니다.");
                }
            } else {
                response.put("success", false);
                response.put("message", "인증 코드가 일치하지 않거나 만료되었습니다.");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "서버 오류: " + e.getMessage());
            e.printStackTrace();
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String authCode = request.get("authCode");
        String newPassword = request.get("newPassword");
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = userForgetService.resetPassword(email, authCode, newPassword);
            if (success) {
                response.put("success", true);
                response.put("message", "비밀번호가 성공적으로 변경되었습니다.");
            } else {
                response.put("success", false);
                response.put("message", "비밀번호 변경에 실패했습니다. 인증 코드를 다시 확인해주세요.");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "서버 오류: " + e.getMessage());
            e.printStackTrace();
        }
        return ResponseEntity.ok(response);
    }
}