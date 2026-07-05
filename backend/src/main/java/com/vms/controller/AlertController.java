package com.vms.controller;

import com.vms.dto.ApiResponse;
import com.vms.dto.AlertDto;
import com.vms.service.AlertService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {
  private final AlertService alertService;

  public AlertController(AlertService alertService) {
    this.alertService = alertService;
  }

  @PostMapping
  public ApiResponse<AlertDto> create(@Valid @RequestBody AlertDto dto) {
    return new ApiResponse<>(true, "Alert created", alertService.create(dto));
  }

  @PutMapping("/{id}/resolve")
  public ApiResponse<AlertDto> resolve(@PathVariable Long id) {
    return new ApiResponse<>(true, "Alert resolved", alertService.resolve(id));
  }

  @GetMapping
  public ApiResponse<List<AlertDto>> getAll() {
    return new ApiResponse<>(true, "Alerts fetched", alertService.getAll());
  }
}
