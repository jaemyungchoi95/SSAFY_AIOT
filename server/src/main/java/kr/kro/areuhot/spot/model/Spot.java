package kr.kro.areuhot.spot.model;

import lombok.Data;

@Data
public class Spot {
    private int rackId;
    private double x, y;
    private float direction;
}
