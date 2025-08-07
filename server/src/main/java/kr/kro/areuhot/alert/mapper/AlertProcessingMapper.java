package kr.kro.areuhot.alert.mapper;

import kr.kro.areuhot.alert.model.AlertProcessing;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AlertProcessingMapper {
    int insertAlertProcessing(AlertProcessing processing);
    AlertProcessing findByAlertId(@Param("alertId") Integer alertId);
    int updateAlertProcessing(AlertProcessing processing);
}
