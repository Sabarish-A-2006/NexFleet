package com.vms.controller;

import com.vms.dto.ApiResponse;
import com.vms.dto.LocationDto;
import com.vms.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {
  private final LocationService locationService;

  public LocationController(LocationService locationService) {
    this.locationService = locationService;
  }

  @PostMapping
  public ApiResponse<LocationDto> create(@Valid @RequestBody LocationDto dto) {
    return new ApiResponse<>(true, "Location saved", locationService.create(dto));
  }

  @GetMapping("/{id}")
  public ApiResponse<LocationDto> getById(@PathVariable Long id) {
    return new ApiResponse<>(true, "Location fetched", locationService.getById(id));
  }

  @GetMapping
  public ApiResponse<List<LocationDto>> getAll() {
    return new ApiResponse<>(true, "Locations fetched", locationService.getAll());
  }
}
