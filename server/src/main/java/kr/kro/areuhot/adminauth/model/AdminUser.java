package kr.kro.areuhot.adminauth.model;

import lombok.Data;

@Data
public class AdminUser {
    private Integer id;
    private String username;
    private String password;
    private String name;
    private boolean active;
}
