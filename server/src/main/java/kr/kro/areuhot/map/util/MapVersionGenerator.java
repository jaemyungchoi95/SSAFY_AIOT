package kr.kro.areuhot.map.util;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class MapVersionGenerator {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy_MM_dd_HHmmss");
    public static String generate(Integer warehouseId, LocalDateTime date) {
        return "v_" + warehouseId + "_" + date.format(formatter);
    }
}
