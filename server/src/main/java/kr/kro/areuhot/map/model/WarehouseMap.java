package kr.kro.areuhot.map.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WarehouseMap {
    private int id;
    private int warehouseId;
    private String filePath;
    private String version;
    private boolean isActive;
    private String type;
    private LocalDateTime createdAt;
}