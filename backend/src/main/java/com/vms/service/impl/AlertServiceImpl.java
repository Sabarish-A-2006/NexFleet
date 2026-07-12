package com.vms.service.impl;

import com.vms.dto.AlertDto;
import com.vms.entity.Alert;
import com.vms.entity.Vehicle;
import com.vms.exception.ResourceNotFoundException;
import com.vms.repository.AlertRepository;
import com.vms.repository.VehicleRepository;
import com.vms.service.AlertService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertServiceImpl implements AlertService {
  private final AlertRepository alertRepository;
  private final VehicleRepository vehicleRepository;

  public AlertServiceImpl(AlertRepository alertRepository, VehicleRepository vehicleRepository) {
    this.alertRepository = alertRepository;
    this.vehicleRepository = vehicleRepository;
  }

  @Override
  public AlertDto create(AlertDto dto) {
    Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
      .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

    Alert alert = new Alert();
    alert.setVehicle(vehicle);
    alert.setStage(dto.getStage());
    alert.setStatus(dto.getStatus() == null ? "ACTIVE" : dto.getStatus());
    alert.setMessage(dto.getMessage());
    alert.setCreatedAt(LocalDateTime.now());

    Alert saved = alertRepository.save(alert);

    // Simulated dispatch to external emergency services
    System.out.println("Dispatching alert to police/hospital for vehicle " + vehicle.getId());

    return toDto(saved);
  }

  @Override
  public AlertDto resolve(Long id) {
    Alert alert = alertRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));

    alert.setStatus("RESOLVED");
    alert.setResolvedAt(LocalDateTime.now());
    return toDto(alertRepository.save(alert));
  }

  @Override
  public List<AlertDto> getAll() {
    return alertRepository.findAllByOrderByCreatedAtDesc().stream()
      .map(this::toDto)
      .collect(Collectors.toList());
  }

  private AlertDto toDto(Alert alert) {
    AlertDto dto = new AlertDto();
    dto.setId(alert.getId());
    dto.setVehicleId(alert.getVehicle().getId());
    dto.setStage(alert.getStage());
    dto.setStatus(alert.getStatus());
    dto.setMessage(alert.getMessage());
    dto.setCreatedAt(alert.getCreatedAt());
    dto.setResolvedAt(alert.getResolvedAt());
    return dto;
  }
}
