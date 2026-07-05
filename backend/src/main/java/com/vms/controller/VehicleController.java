package com.vms.controller;

import com.vms.dto.ApiResponse;
import com.vms.dto.VehicleDto;
import com.vms.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
  private final VehicleService vehicleService;

  public VehicleController(VehicleService vehicleService) {
    this.vehicleService = vehicleService;
  }

  @PostMapping
  public ApiResponse<VehicleDto> create(@Valid @RequestBody VehicleDto dto) {
    return new ApiResponse<>(true, "Vehicle created", vehicleService.create(dto));
  }

  @GetMapping("/{id}")
  public ApiResponse<VehicleDto> getById(@PathVariable Long id) {
    return new ApiResponse<>(true, "Vehicle fetched", vehicleService.getById(id));
  }

  @GetMapping
  public ApiResponse<List<VehicleDto>> getAll() {
    return new ApiResponse<>(true, "Vehicles fetched", vehicleService.getAll());
  }
}
