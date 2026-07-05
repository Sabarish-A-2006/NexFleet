package com.vms.service;

import com.vms.dto.VehicleStatDto;
import java.util.List;

public interface VehicleStatService {
  VehicleStatDto create(VehicleStatDto dto);
  VehicleStatDto getById(Long id);
  List<VehicleStatDto> getAll();
}
