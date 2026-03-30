package com.toyproject.backend.domain.auth.mapper;

import com.toyproject.backend.domain.auth.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    User findByProviderAndProviderId(@Param("provider") String provider,
                                     @Param("providerId") String providerId);

    User findById(@Param("id") Long id);

    void insert(User user);

    void update(User user);
}
