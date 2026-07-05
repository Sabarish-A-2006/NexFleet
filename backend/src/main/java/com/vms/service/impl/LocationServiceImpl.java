package com.vms.service.impl;

import com.vms.dto.LocationDto;
import com.vms.entity.Location;
import com.vms.entity.Vehicle;
import com.vms.exception.ResourceNotFoundException;
import com.vms.repository.LocationRepository;
import com.vms.repository.VehicleRepository;
import com.vms.service.LocationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationServiceImpl implements LocationService {
  private final LocationRepository locationRepository;
  private final VehicleRepository vehicleRepository;

  public LocationServiceImpl(LocationRepository locationRepository, VehicleRepository vehicleRepository) {
    this.locationRepository = locationRepository;
    this.vehicleRepository = vehicleRepository;
  }

  @Override
  public LocationDto create(LocationDto dto) {
    Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
      .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

    Location location = new Location();
    location.setVehicle(vehicle);
    location.setLatitude(dto.getLatitude());
    location.setLongitude(dto.getLongitude());
    location.setSpeedKph(dto.getSpeedKph());
    location.setRecordedAt(LocalDateTime.now());

    return toDto(locationRepository.save(location));
  }

  @Override
  public LocationDto getById(Long id) {
    return locationRepository.findById(id)
      .map(this::toDto)
      .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
  }

  @Override
  public List<LocationDto> getAll() {
    return locationRepository.findAll().stream()
      .map(this::toDto)
      .collect(Collectors.toList());
  }

  private LocationDto toDto(Location location) {
    LocationDto dto = new LocationDto();
    dto.setId(location.getId());
    dto.setVehicleId(location.getVehicle().getId());
    dto.setLatitude(location.getLatitude());
    dto.setLongitude(location.getLongitude());
    dto.setSpeedKph(location.getSpeedKph());
    dto.setRecordedAt(location.getRecordedAt());
    return dto;
  }
}
