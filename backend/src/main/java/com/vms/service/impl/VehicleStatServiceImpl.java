package com.vms.service.impl;

import com.vms.dto.VehicleStatDto;
import com.vms.entity.Vehicle;
import com.vms.entity.VehicleStat;
import com.vms.exception.ResourceNotFoundException;
import com.vms.repository.VehicleRepository;
import com.vms.repository.VehicleStatRepository;
import com.vms.service.VehicleStatService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleStatServiceImpl implements VehicleStatService {
  private final VehicleStatRepository statRepository;
  private final VehicleRepository vehicleRepository;

  public VehicleStatServiceImpl(VehicleStatRepository statRepository, VehicleRepository vehicleRepository) {
    this.statRepository = statRepository;
    this.vehicleRepository = vehicleRepository;
  }

  @Override
  public VehicleStatDto create(VehicleStatDto dto) {
    Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
      .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

    VehicleStat stat = new VehicleStat();
    stat.setVehicle(vehicle);
    stat.setTyrePressureFL(dto.getTyrePressureFL());
    stat.setTyrePressureFR(dto.getTyrePressureFR());
    stat.setTyrePressureRL(dto.getTyrePressureRL());
    stat.setTyrePressureRR(dto.getTyrePressureRR());
    stat.setFuelLevel(dto.getFuelLevel());
    stat.setMileageKm(dto.getMileageKm());
    stat.setCabinTemperature(dto.getCabinTemperature());
    stat.setSeatCondition(dto.getSeatCondition());
    stat.setCleanliness(dto.getCleanliness());
    stat.setUpdatedAt(LocalDateTime.now());

    return toDto(statRepository.save(stat));
  }

  @Override
  public VehicleStatDto getById(Long id) {
    return statRepository.findById(id)
      .map(this::toDto)
      .orElseThrow(() -> new ResourceNotFoundException("Vehicle stats not found"));
  }

  @Override
  public List<VehicleStatDto> getAll() {
    return statRepository.findAll().stream()
      .map(this::toDto)
      .collect(Collectors.toList());
  }

  private VehicleStatDto toDto(VehicleStat stat) {
    VehicleStatDto dto = new VehicleStatDto();
    dto.setId(stat.getId());
    dto.setVehicleId(stat.getVehicle().getId());
    dto.setTyrePressureFL(stat.getTyrePressureFL());
    dto.setTyrePressureFR(stat.getTyrePressureFR());
    dto.setTyrePressureRL(stat.getTyrePressureRL());
    dto.setTyrePressureRR(stat.getTyrePressureRR());
    dto.setFuelLevel(stat.getFuelLevel());
    dto.setMileageKm(stat.getMileageKm());
    dto.setCabinTemperature(stat.getCabinTemperature());
    dto.setSeatCondition(stat.getSeatCondition());
    dto.setCleanliness(stat.getCleanliness());
    dto.setUpdatedAt(stat.getUpdatedAt());
    return dto;
  }
}
