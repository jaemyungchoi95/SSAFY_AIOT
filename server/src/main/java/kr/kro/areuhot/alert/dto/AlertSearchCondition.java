package kr.kro.areuhot.alert.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertSearchCondition {
    private int warehouseId;
    private String sort;
    private String range;
    private String status;
    private Boolean dangerOnly;
    private String query;
}
