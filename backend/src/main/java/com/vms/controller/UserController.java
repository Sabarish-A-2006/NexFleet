package com.vms.controller;

import com.vms.dto.ApiResponse;
import com.vms.dto.UserDto;
import com.vms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping
  public ApiResponse<UserDto> create(@Valid @RequestBody UserDto dto) {
    return new ApiResponse<>(true, "User created", userService.create(dto));
  }

  @GetMapping("/{id}")
  public ApiResponse<UserDto> getById(@PathVariable Long id) {
    return new ApiResponse<>(true, "User fetched", userService.getById(id));
  }

  @GetMapping
  public ApiResponse<List<UserDto>> getAll() {
    return new ApiResponse<>(true, "Users fetched", userService.getAll());
  }
}
