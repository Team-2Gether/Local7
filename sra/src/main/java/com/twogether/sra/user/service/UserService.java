// src/main/java/com/twogether/sra/user/service/UserService.java
package com.twogether.sra.user.service;

import com.twogether.sra.user.vo.UserVO;
import reactor.core.publisher.Mono;

public interface UserService {
    // Returns the UserVO if login is successful, null otherwise
    Mono<UserVO> login(String credential, String password);
}