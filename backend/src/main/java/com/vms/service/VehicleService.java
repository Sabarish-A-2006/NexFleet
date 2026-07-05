package com.vms.service;

import com.vms.dto.VehicleDto;
import java.util.List;

public interface VehicleService {
  VehicleDto create(VehicleDto dto);
  VehicleDto getById(Long id);
  List<VehicleDto> getAll();
}
