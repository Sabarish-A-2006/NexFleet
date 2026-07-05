package com.vms.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class VehicleDto {
  private Long id;

  @NotNull(message = "User id is required")
  private Long userId;

  @Size(max = 100, message = "VIN must be 100 characters or less")
  private String vin;

  @NotBlank(message = "Make is required")
  @Size(max = 50, message = "Make must be 50 characters or less")
  private String make;

  @NotBlank(message = "Model is required")
  @Size(max = 50, message = "Model must be 50 characters or less")
  private String model;

  @Min(value = 1886, message = "Year must be 1886 or later")
  @Max(value = 2100, message = "Year must be 2100 or earlier")
  private Integer year;

  @Size(max = 20, message = "Plate number must be 20 characters or less")
  private String plateNumber;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }
  public String getVin() { return vin; }
  public void setVin(String vin) { this.vin = vin; }
  public String getMake() { return make; }
  public void setMake(String make) { this.make = make; }
  public String getModel() { return model; }
  public void setModel(String model) { this.model = model; }
  public Integer getYear() { return year; }
  public void setYear(Integer year) { this.year = year; }
  public String getPlateNumber() { return plateNumber; }
  public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }
}
