package com.vms.repository;

import com.vms.entity.VehicleStat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleStatRepository extends JpaRepository<VehicleStat, Long> {
}
