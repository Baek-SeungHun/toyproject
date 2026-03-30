package com.toyproject.backend.domain.restaurant.mapper;

import com.toyproject.backend.domain.restaurant.entity.Restaurant;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RestaurantMapper {

    List<Restaurant> findInPolygon(@Param("geoJson") String geoJson);

    void insert(Restaurant restaurant);

    int update(Restaurant restaurant);

    int deleteById(@Param("id") Long id, @Param("userId") Long userId);

    Restaurant findById(@Param("id") Long id);
}
