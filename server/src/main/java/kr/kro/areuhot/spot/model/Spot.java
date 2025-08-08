package kr.kro.areuhot.spot.model;

import lombok.Data;

import java.util.UUID;

@Data
public class Spot {
    private Integer id;
    private Integer rackId;
    private Double x, y;
    private Float direction;
    private byte[] uuid;
}
