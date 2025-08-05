package kr.kro.areuhot.alert.model;

import lombok.Data;

import java.util.Date;

@Data
public class Alert {
    private int id;
    private int robotId;
    private int rackId;
    private int warehouseId;
    private int spotId;
    private double temperature;
    private String imageThermalUrl;
    private String imageNormalUrl;
    private AlertStatus status;
    private boolean danger;
    private Date createdAt;
    private Date updatedAt;
}