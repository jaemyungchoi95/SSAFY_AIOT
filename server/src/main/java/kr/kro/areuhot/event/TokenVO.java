package kr.kro.areuhot.event;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TokenVO {
    private Integer id;
    private String token;
    private LocalDateTime createdAt;
}
