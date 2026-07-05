CREATE DATABASE IF NOT EXISTS vms_db;
USE vms_db;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS vehicles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  vin VARCHAR(100),
  make VARCHAR(50),
  model VARCHAR(50),
  year INT,
  plate_number VARCHAR(20),
  CONSTRAINT fk_vehicle_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS vehicle_stats (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id BIGINT NOT NULL,
  tyre_pressure_fl DOUBLE,
  tyre_pressure_fr DOUBLE,
  tyre_pressure_rl DOUBLE,
  tyre_pressure_rr DOUBLE,
  fuel_level DOUBLE,
  mileage_km DOUBLE,
  cabin_temperature DOUBLE,
  seat_condition VARCHAR(50),
  cleanliness VARCHAR(50),
  updated_at DATETIME,
  CONSTRAINT fk_stats_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE IF NOT EXISTS alerts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id BIGINT NOT NULL,
  stage VARCHAR(50),
  status VARCHAR(50),
  message VARCHAR(255),
  created_at DATETIME,
  resolved_at DATETIME,
  CONSTRAINT fk_alert_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE IF NOT EXISTS locations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id BIGINT NOT NULL,
  latitude DOUBLE,
  longitude DOUBLE,
  speed_kph DOUBLE,
  recorded_at DATETIME,
  CONSTRAINT fk_location_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

INSERT INTO users (name, email, phone) VALUES
('Aarav Rao', 'aarav@example.com', '+91-90000-10000'),
('Maya Sen', 'maya@example.com', '+91-90000-20000');

INSERT INTO vehicles (user_id, vin, make, model, year, plate_number) VALUES
(1, 'VMSVIN001', 'Tesla', 'Model 3', 2023, 'KA-01-AB-1234'),
(2, 'VMSVIN002', 'Hyundai', 'Ioniq 5', 2024, 'KA-02-CD-5678');

INSERT INTO vehicle_stats (vehicle_id, tyre_pressure_fl, tyre_pressure_fr, tyre_pressure_rl, tyre_pressure_rr, fuel_level, mileage_km, cabin_temperature, seat_condition, cleanliness, updated_at) VALUES
(1, 33.0, 33.5, 34.0, 33.2, 72.0, 15200.5, 23.5, 'Good', 'Clean', NOW()),
(2, 32.5, 32.8, 33.1, 32.9, 58.0, 8200.0, 24.0, 'Comfort', 'Moderate', NOW());

INSERT INTO locations (vehicle_id, latitude, longitude, speed_kph, recorded_at) VALUES
(1, 12.9716, 77.5946, 48.0, NOW()),
(2, 12.9352, 77.6245, 35.0, NOW());

INSERT INTO alerts (vehicle_id, stage, status, message, created_at) VALUES
(1, 'WARNING', 'ACTIVE', 'Minor impact detected', NOW());
