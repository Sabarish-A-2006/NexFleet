package com.vms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class AlertDto {
  private Long id;

  @NotNull(message = "Vehicle id is required")
  private Long vehicleId;

  @NotBlank(message = "Stage is required")
  @Size(max = 50, message = "Stage must be 50 characters or less")
  private String stage;

  @Size(max = 50, message = "Status must be 50 characters or less")
  private String status;

  @Size(max = 255, message = "Message must be 255 characters or less")
  private String message;
  private LocalDateTime createdAt;
  private LocalDateTime resolvedAt;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getVehicleId() { return vehicleId; }
  public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
  public String getStage() { return stage; }
  public void setStage(String stage) { this.stage = stage; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
  public LocalDateTime getResolvedAt() { return resolvedAt; }
  public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
