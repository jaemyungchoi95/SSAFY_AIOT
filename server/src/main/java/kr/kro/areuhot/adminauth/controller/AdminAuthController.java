package kr.kro.areuhot.adminauth.controller;

import jakarta.servlet.http.HttpServletRequest;
import kr.kro.areuhot.adminauth.dto.LoginRequestDto;
import kr.kro.areuhot.adminauth.dto.LoginResponseDto;
import kr.kro.areuhot.adminauth.model.AdminUser;
import kr.kro.areuhot.adminauth.service.AdminUserService;
import kr.kro.areuhot.common.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/admin")
public class AdminAuthController {
    private final AdminUserService adminUserService;
    private final AuthenticationManager authenticationManager;

    public AdminAuthController(AuthenticationConfiguration authenticationConfiguration,
                               AdminUserService adminUserService) throws  Exception {
        this.authenticationManager = authenticationConfiguration.getAuthenticationManager();
        this.adminUserService = adminUserService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(
            @RequestBody LoginRequestDto requestDto,
            HttpServletRequest request) {

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(requestDto.getUsername(), requestDto.getPassword());
        Authentication authentication =
                authenticationManager.authenticate(authToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        request.getSession(true);

        AdminUser admin = adminUserService.findByUsername(requestDto.getUsername());

        return ResponseEntity.ok(ApiResponse.success(
                LoginResponseDto.builder()
                        .userId(admin.getId())
                        .name(admin.getName())
                        .build())
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        if(request.getSession(false) != null) {
            request.getSession().invalidate();
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
