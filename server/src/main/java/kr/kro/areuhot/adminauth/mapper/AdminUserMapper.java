package kr.kro.areuhot.adminauth.mapper;

import kr.kro.areuhot.adminauth.model.AdminUser;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminUserMapper {
    AdminUser findByUsername(String username);
}
