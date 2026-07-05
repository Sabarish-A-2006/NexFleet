package com.vms.service;

import com.vms.dto.UserDto;
import java.util.List;

public interface UserService {
  UserDto create(UserDto dto);
  UserDto getById(Long id);
  List<UserDto> getAll();
}
