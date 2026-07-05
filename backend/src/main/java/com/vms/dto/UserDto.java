package com.vms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDto {
  private Long id;

  @NotBlank(message = "Name is required")
  @Size(max = 100, message = "Name must be 100 characters or less")
  private String name;

  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  @Size(max = 150, message = "Email must be 150 characters or less")
  private String email;

  @Size(max = 50, message = "Phone must be 50 characters or less")
  private String phone;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }
}
