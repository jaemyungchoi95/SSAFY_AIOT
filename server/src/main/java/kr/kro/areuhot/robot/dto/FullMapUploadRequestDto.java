package kr.kro.areuhot.robot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class FullMapUploadRequestDto {
    private String url;
    private LocalDateTime createdAt;
    private List<RackUploadDto> rackList;
}