package kr.kro.areuhot.spot.model;

import lombok.Data;

import java.util.UUID;

@Data
public class Spot {
    private int id;
    private int rackId;
    private double x, y;
    private float direction;
    private byte[] uuid;
}
