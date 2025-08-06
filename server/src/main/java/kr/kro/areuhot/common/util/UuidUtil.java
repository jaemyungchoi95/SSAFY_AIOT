package kr.kro.areuhot.common.util;

import java.nio.ByteBuffer;
import java.util.UUID;

public class UuidUtil {
    public static byte[] toBytes(UUID uuid) {
        ByteBuffer buffer = ByteBuffer.wrap(new byte[16]);
        buffer.putLong(uuid.getMostSignificantBits());
        buffer.putLong(uuid.getLeastSignificantBits());
        return buffer.array();
    }

    /* String → byte[16] */
    public static byte[] toBytes(String uuidStr) {
        return toBytes(UUID.fromString(uuidStr));
    }

    /* byte[16] → UUID */
    public static UUID fromBytes(byte[] bytes) {
        if (bytes == null || bytes.length != 16) {
            throw new IllegalArgumentException("Invalid byte array for UUID conversion");
        }
        ByteBuffer buffer = ByteBuffer.wrap(bytes);
        long high = buffer.getLong();
        long low = buffer.getLong();
        return new UUID(high, low);
    }

    /* byte[16] → String */
    public static String fromBytesToString(byte[] bytes) {
        return fromBytes(bytes).toString();
    }
}
