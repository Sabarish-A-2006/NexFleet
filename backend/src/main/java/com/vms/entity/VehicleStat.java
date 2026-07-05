package com.vms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_stats")
public class VehicleStat {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "vehicle_id")
  private Vehicle vehicle;

  private Double tyrePressureFL;
  private Double tyrePressureFR;
  private Double tyrePressureRL;
  private Double tyrePressureRR;
  private Double fuelLevel;
  private Double mileageKm;
  private Double cabinTemperature;
  private String seatCondition;
  private String cleanliness;

  private LocalDateTime updatedAt;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Vehicle getVehicle() { return vehicle; }
  public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
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
