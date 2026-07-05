package com.vms.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class LocationDto {
  private Long id;

  @NotNull(message = "Vehicle id is required")
  private Long vehicleId;

  @NotNull(message = "Latitude is required")
  @DecimalMin(value = "-90.0", message = "Latitude must be at least -90")
  @DecimalMax(value = "90.0", message = "Latitude must be at most 90")
  private Double latitude;

  @NotNull(message = "Longitude is required")
  @DecimalMin(value = "-180.0", message = "Longitude must be at least -180")
  @DecimalMax(value = "180.0", message = "Longitude must be at most 180")
  private Double longitude;

  @DecimalMin(value = "0.0", message = "Speed must not be negative")
  private Double speedKph;
  private LocalDateTime recordedAt;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getVehicleId() { return vehicleId; }
  public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
  public Double getLatitude() { return latitude; }
  public void setLatitude(Double latitude) { this.latitude = latitude; }
  public Double getLongitude() { return longitude; }
  public void setLongitude(Double longitude) { this.longitude = longitude; }
  public Double getSpeedKph() { return speedKph; }
  public void setSpeedKph(Double speedKph) { this.speedKph = speedKph; }
  public LocalDateTime getRecordedAt() { return recordedAt; }
  public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
