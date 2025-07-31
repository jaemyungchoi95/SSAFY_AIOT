package kr.kro.areuhot.map.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class MapVersionGenerator {
    public static String generate(int warehouseId, Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy_MM_dd_HHmmss");
        return "v_" + warehouseId + "_" + sdf.format(date);
    }
}
