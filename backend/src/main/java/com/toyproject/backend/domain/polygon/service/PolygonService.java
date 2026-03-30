package com.toyproject.backend.domain.polygon.service;

import tools.jackson.databind.ObjectMapper;
import com.toyproject.backend.domain.polygon.dto.PolygonRequest;
import com.toyproject.backend.domain.polygon.dto.PolygonResponse;
import com.toyproject.backend.domain.polygon.entity.Polygon;
import com.toyproject.backend.domain.polygon.mapper.PolygonMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PolygonService {

    private final PolygonMapper polygonMapper;
    private final ObjectMapper objectMapper;

    public PolygonResponse create(Long userId, PolygonRequest request) {
        try {
            Polygon polygon = new Polygon();
            polygon.setUserId(userId);
            polygon.setName(request.getName());
            polygon.setDescription(request.getDescription());
            polygon.setGeomJson(objectMapper.writeValueAsString(request.getGeoJson()));

            polygonMapper.insert(polygon);

            Polygon saved = polygonMapper.findById(polygon.getId());
            return toResponse(saved);
        } catch (Exception e) {
            throw new RuntimeException("폴리곤 저장 실패", e);
        }
    }

    public List<PolygonResponse> findByUserId(Long userId) {
        return polygonMapper.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PolygonResponse findById(Long id) {
        Polygon polygon = polygonMapper.findById(id);
        if (polygon == null) {
            throw new IllegalArgumentException("폴리곤을 찾을 수 없습니다");
        }
        return toResponse(polygon);
    }

    public void delete(Long id, Long userId) {
        int deleted = polygonMapper.deleteById(id, userId);
        if (deleted == 0) {
            throw new IllegalArgumentException("삭제할 폴리곤이 없거나 권한이 없습니다");
        }
    }

    private PolygonResponse toResponse(Polygon polygon) {
        try {
            PolygonResponse response = new PolygonResponse();
            response.setId(String.valueOf(polygon.getId()));
            response.setName(polygon.getName());
            response.setDescription(polygon.getDescription());
            response.setGeoJson(objectMapper.readValue(polygon.getGeomJson(), Object.class));
            response.setCreatedAt(polygon.getCreatedAt());
            return response;
        } catch (Exception e) {
            throw new RuntimeException("GeoJSON 변환 실패", e);
        }
    }
}
