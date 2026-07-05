package com.vms.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class VehicleStatDto {
  private Long id;

  @NotNull(message = "Vehicle id is required")
  private Long vehicleId;

  @DecimalMin(value = "0.0", message = "Tyre pressure must not be negative")
  private Double tyrePressureFL;

  @DecimalMin(value = "0.0", message = "Tyre pressure must not be negative")
  private Double tyrePressureFR;

  @DecimalMin(value = "0.0", message = "Tyre pressure must not be negative")
  private Double tyrePressureRL;

  @DecimalMin(value = "0.0", message = "Tyre pressure must not be negative")
  private Double tyrePressureRR;

  @DecimalMin(value = "0.0", message = "Fuel level must not be negative")
  @DecimalMax(value = "100.0", message = "Fuel level must not exceed 100")
  private Double fuelLevel;

  @DecimalMin(value = "0.0", message = "Mileage must not be negative")
  private Double mileageKm;

  private Double cabinTemperature;

  @Size(max = 50, message = "Seat condition must be 50 characters or less")
  private String seatCondition;

  @Size(max = 50, message = "Cleanliness must be 50 characters or less")
  private String cleanliness;
  private LocalDateTime updatedAt;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getVehicleId() { return vehicleId; }
  public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
  public Double getTyrePressureFL() { return tyrePressureFL; }
  public void setTyrePressureFL(Double tyrePressureFL) { this.tyrePressureFL = tyrePressureFL; }
  public Double getTyrePressureFR() { return tyrePressureFR; }
  public void setTyrePressureFR(Double tyrePressureFR) { this.tyrePressureFR = tyrePressureFR; }
  public Double getTyrePressureRL() { return tyrePressureRL; }
  public void setTyrePressureRL(Double tyrePressureRL) { this.tyrePressureRL = tyrePressureRL; }
  public Double getTyrePressureRR() { return tyrePressureRR; }
  public void setTyrePressureRR(Double tyrePressureRR) { this.tyrePressureRR = tyrePressureRR; }
  public Double getFuelLevel() { return fuelLevel; }
  public void setFuelLevel(Double fuelLevel) { this.fuelLevel = fuelLevel; }
  public Double getMileageKm() { return mileageKm; }
  public void setMileageKm(Double mileageKm) { this.mileageKm = mileageKm; }
  public Double getCabinTemperature() { return cabinTemperature; }
  public void setCabinTemperature(Double cabinTemperature) { this.cabinTemperature = cabinTemperature; }
  public String getSeatCondition() { return seatCondition; }
  public void setSeatCondition(String seatCondition) { this.seatCondition = seatCondition; }
  public String getCleanliness() { return cleanliness; }
  public void setCleanliness(String cleanliness) { this.cleanliness = cleanliness; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
