package kr.kro.areuhot.event;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TokenMapper {
    void insertToken(TokenVO tokenVO);

    List<TokenVO> findAllToken();

}
