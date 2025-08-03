package kr.kro.areuhot.map.model;

import lombok.Data;

import java.util.Date;

@Data
public class WarehouseMap {
    private int id;
    private int warehouseId;
    private String filePath;
    private String version;
    private boolean isActive;
    private String type;
    private Date createdAt;
}