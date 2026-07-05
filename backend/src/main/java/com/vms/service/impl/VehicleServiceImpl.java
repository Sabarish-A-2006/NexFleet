package com.vms.service.impl;

import com.vms.dto.VehicleDto;
import com.vms.entity.User;
import com.vms.entity.Vehicle;
import com.vms.exception.ResourceNotFoundException;
import com.vms.repository.UserRepository;
import com.vms.repository.VehicleRepository;
import com.vms.service.VehicleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleServiceImpl implements VehicleService {
  private final VehicleRepository vehicleRepository;
  private final UserRepository userRepository;

  public VehicleServiceImpl(VehicleRepository vehicleRepository, UserRepository userRepository) {
    this.vehicleRepository = vehicleRepository;
    this.userRepository = userRepository;
  }

  @Override
  public VehicleDto create(VehicleDto dto) {
    User user = userRepository.findById(dto.getUserId())
      .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    Vehicle vehicle = new Vehicle();
    vehicle.setUser(user);
    vehicle.setVin(dto.getVin());
    vehicle.setMake(dto.getMake());
    vehicle.setModel(dto.getModel());
    vehicle.setYear(dto.getYear());
    vehicle.setPlateNumber(dto.getPlateNumber());

    return toDto(vehicleRepository.save(vehicle));
  }

  @Override
  public VehicleDto getById(Long id) {
    return vehicleRepository.findById(id)
      .map(this::toDto)
      .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
  }

  @Override
  public List<VehicleDto> getAll() {
    return vehicleRepository.findAll().stream()
      .map(this::toDto)
      .collect(Collectors.toList());
  }

  private VehicleDto toDto(Vehicle vehicle) {
    VehicleDto dto = new VehicleDto();
    dto.setId(vehicle.getId());
    dto.setUserId(vehicle.getUser().getId());
    dto.setVin(vehicle.getVin());
    dto.setMake(vehicle.getMake());
    dto.setModel(vehicle.getModel());
    dto.setYear(vehicle.getYear());
    dto.setPlateNumber(vehicle.getPlateNumber());
    return dto;
  }
}
