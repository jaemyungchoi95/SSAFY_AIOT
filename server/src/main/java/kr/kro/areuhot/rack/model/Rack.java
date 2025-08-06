package kr.kro.areuhot.rack.model;

import lombok.Data;

@Data
public class Rack {
    private Integer id;
    private Integer warehouseId;
    private Integer mapId;
    private Double x1, y1, x2, y2, x3, y3, x4, y4;
    private Double centerX, centerY;
}
