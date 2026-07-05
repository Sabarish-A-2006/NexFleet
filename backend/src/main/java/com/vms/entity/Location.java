package com.vms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "locations")
public class Location {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "vehicle_id")
  private Vehicle vehicle;

  private Double latitude;
  private Double longitude;
  private Double speedKph;

  private LocalDateTime recordedAt;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Vehicle getVehicle() { return vehicle; }
  public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
  public Double getLatitude() { return latitude; }
  public void setLatitude(Double latitude) { this.latitude = latitude; }
  public Double getLongitude() { return longitude; }
  public void setLongitude(Double longitude) { this.longitude = longitude; }
  public Double getSpeedKph() { return speedKph; }
  public void setSpeedKph(Double speedKph) { this.speedKph = speedKph; }
  public LocalDateTime getRecordedAt() { return recordedAt; }
  public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
