package kr.kro.areuhot.adminauth.service;

import kr.kro.areuhot.adminauth.mapper.AdminUserMapper;
import kr.kro.areuhot.adminauth.model.AdminUser;
import kr.kro.areuhot.adminauth.model.CustomAdminUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserService implements UserDetailsService {
    private final AdminUserMapper adminUserMapper;

    public AdminUser findByUsername(String username) {
        return adminUserMapper.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUser user = adminUserMapper.findByUsername(username);
        if(user == null) {
            throw new UsernameNotFoundException("존재하지 않는 사용자입니다.");
        }
        return new CustomAdminUserDetails(user);
    }
}
