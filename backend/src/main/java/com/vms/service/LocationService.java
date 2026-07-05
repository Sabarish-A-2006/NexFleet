package com.vms.service;

import com.vms.dto.LocationDto;
import java.util.List;

public interface LocationService {
  LocationDto create(LocationDto dto);
  LocationDto getById(Long id);
  List<LocationDto> getAll();
}
