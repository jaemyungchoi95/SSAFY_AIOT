package kr.kro.areuhot.robot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class FullMapUploadRequestDto {
    private String url;
    private Date createdAt;
    private List<RackUploadDto> rackList;
}