package com.vms.controller;

import com.vms.dto.ApiResponse;
import com.vms.dto.VehicleStatDto;
import com.vms.service.VehicleStatService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class VehicleStatController {
  private final VehicleStatService statService;

  public VehicleStatController(VehicleStatService statService) {
    this.statService = statService;
  }

  @PostMapping
  public ApiResponse<VehicleStatDto> create(@Valid @RequestBody VehicleStatDto dto) {
    return new ApiResponse<>(true, "Stats saved", statService.create(dto));
  }

  @GetMapping("/{id}")
  public ApiResponse<VehicleStatDto> getById(@PathVariable Long id) {
    return new ApiResponse<>(true, "Stats fetched", statService.getById(id));
  }

  @GetMapping
  public ApiResponse<List<VehicleStatDto>> getAll() {
    return new ApiResponse<>(true, "Stats fetched", statService.getAll());
  }
}
