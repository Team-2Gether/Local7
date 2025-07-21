package com.twogether.local7.login.vo;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Collections; // Collections import 추가
import org.springframework.security.core.authority.SimpleGrantedAuthority; // SimpleGrantedAuthority import 추가

@Data
public class LoginVO implements UserDetails { // UserDetails 인터페이스 구현
    private Long userId;
    private String userLoginId;
    private String userEmail;
    private String userPassword; // IMPORTANT: Should be hashed in a real application
    private String userName;
    private String userNickname;
    private String userProfileImageUrl;
    private String userBio;
    private Long ruleId; // TB_USER 테이블의 RULE_ID 컬럼과 매핑
    private String ruleName; // TB_RULE 테이블의 RULE_NAME 컬럼과 매핑
    private Timestamp createDate;
    private String createdId;
    private Timestamp updatedDate;
    private String updatedId;

    // UserDetails 구현 메소드
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 여기서는 ruleName을 기반으로 권한을 부여합니다.
        // 예를 들어, ruleName이 "ADMIN"이면 "ROLE_ADMIN" 권한을 부여할 수 있습니다.
        // 권한 이름은 "ROLE_" 접두사를 붙이는 것이 Spring Security 관례입니다.
        if (this.ruleName != null) {
            return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.ruleName.toUpperCase()));
        }
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return this.userPassword;
    }

    @Override
    public String getUsername() {
        // 사용자 식별자로 사용될 필드를 반환 (여기서는 userLoginId 또는 userEmail)
        // 로그인 시 credential이 userLoginId 또는 userEmail로 사용되므로 둘 중 하나를 반환
        return this.userLoginId != null ? this.userLoginId : this.userEmail;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}