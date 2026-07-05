package com.vms.service.impl;

import com.vms.dto.UserDto;
import com.vms.entity.User;
import com.vms.exception.ResourceNotFoundException;
import com.vms.repository.UserRepository;
import com.vms.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;

  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDto create(UserDto dto) {
    User user = new User();
    user.setName(dto.getName());
    user.setEmail(dto.getEmail());
    user.setPhone(dto.getPhone());
    User saved = userRepository.save(user);
    return toDto(saved);
  }

  @Override
  public UserDto getById(Long id) {
    return userRepository.findById(id)
      .map(this::toDto)
      .orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }

  @Override
  public List<UserDto> getAll() {
    return userRepository.findAll().stream()
      .map(this::toDto)
      .collect(Collectors.toList());
  }

  private UserDto toDto(User user) {
    UserDto dto = new UserDto();
    dto.setId(user.getId());
    dto.setName(user.getName());
    dto.setEmail(user.getEmail());
    dto.setPhone(user.getPhone());
    return dto;
  }
}
