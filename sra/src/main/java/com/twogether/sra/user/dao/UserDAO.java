// src/main/java/com/twogether/sra/user/dao/UserDAO.java
package com.twogether.sra.user.dao;

import com.twogether.sra.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface UserDAO {
    UserVO findByUserLoginId(String userLoginId);
    UserVO findByUserEmail(String userEmail);
}