package kr.kro.areuhot.map.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WarehouseMap {
    private Integer id;
    private Integer warehouseId;
    private String filePath;
    private String version;
    private Boolean active;
    private String type;
    private LocalDateTime createdAt;
}