package com.toyproject.backend.domain.polygon.mapper;

import com.toyproject.backend.domain.polygon.entity.Polygon;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PolygonMapper {

    void insert(Polygon polygon);

    List<Polygon> findByUserId(@Param("userId") Long userId);

    Polygon findById(@Param("id") Long id);

    int deleteById(@Param("id") Long id, @Param("userId") Long userId);
}
