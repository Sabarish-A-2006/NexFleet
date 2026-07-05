package com.vms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "vehicle_id")
  private Vehicle vehicle;

  private String stage; // WARNING, SMALL_CRASH, SEVERE_CRASH
  private String status; // ACTIVE, RESOLVED
  private String message;

  private LocalDateTime createdAt;
  private LocalDateTime resolvedAt;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Vehicle getVehicle() { return vehicle; }
  public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
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
