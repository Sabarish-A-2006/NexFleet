package com.vms.service;

import com.vms.dto.AlertDto;
import java.util.List;

public interface AlertService {
  AlertDto create(AlertDto dto);
  AlertDto resolve(Long id);
  List<AlertDto> getAll();
}
