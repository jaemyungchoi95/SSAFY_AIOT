package kr.kro.areuhot.rack.model;

import lombok.Data;

@Data
public class Rack {
    private int warehouseId;
    private int mapId;
    private double x1, y1, x2, y2, x3, y3, x4, y4;
    private double centerX, centerY;
}
