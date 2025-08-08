package kr.kro.areuhot.warehouse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class WarehouseResponseDto {
    private Integer warehouseId;
    private String name;
    private String location;
}
