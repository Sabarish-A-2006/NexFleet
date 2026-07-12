USE vms_db;

-- Clear test data from dev session
DELETE FROM alerts WHERE id = 2;

-- Seed rich historical incident data (spans 7 days)
INSERT INTO alerts (vehicle_id, stage, status, message, created_at, resolved_at) VALUES

-- Active / Unresolved
(1, 'SEVERE_CRASH',     'EMERGENCY_DISPATCHED', 'Severe frontal collision detected at 92G. Emergency services dispatched to LAT 12.9716, LNG 77.5946.', NOW() - INTERVAL 25 MINUTE, NULL),
(1, 'WARNING',          'ACTIVE',               'Sudden deceleration spike detected: 28G. Driver non-responsive to system ping. Monitoring continues.', NOW() - INTERVAL 75 MINUTE, NULL),
(1, 'TRAFFIC_HAZARD',   'LOGGED',               'V2X network broadcast: debris field detected on NH-48 near Bangalore. Speed restriction advisory issued.', NOW() - INTERVAL 150 MINUTE, NULL),
(1, 'SMALL_CRASH',      'ACTIVE',               'Side impact detected at 22G (right lateral). Vehicle parked — suspected parking lot collision. Awaiting driver response.', NOW() - INTERVAL 190 MINUTE, NULL),

-- Resolved / Historical (24h - 7 days)
(1, 'FALSE_ALARM',      'DRIVER_OVERRIDE',      'Driver manually cancelled crash alert at WARNING stage. Confirmed road bump, not a collision.', NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 5 HOUR),
(1, 'DIAGNOSTIC_CHECK', 'CLEARED',              'Scheduled pre-drive diagnostic: LIDAR OK, GPS OK, V2X OK, Accelerometer OK. All systems fully operational.', NOW() - INTERVAL 7 HOUR, NOW() - INTERVAL 7 HOUR),
(1, 'SEVERE_CRASH',     'RESOLVED',             'Rear-end collision at 67G on ORR flyover. Emergency services responded. Vehicle towed. Case closed.', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 22 HOUR),
(1, 'WARNING',          'DRIVER_OVERRIDE',      'Sharp braking event (18G). Driver confirmed safe stop at traffic signal. Logged and cleared.', NOW() - INTERVAL 28 HOUR, NOW() - INTERVAL 27 HOUR),
(1, 'TRAFFIC_HAZARD',   'RESOLVED',             'LIDAR detected pedestrian near vehicle at low speed. Automatic emergency brake engaged. Incident avoided.', NOW() - INTERVAL 30 HOUR, NOW() - INTERVAL 29 HOUR),
(1, 'SMALL_CRASH',      'RESOLVED',             'Minor fender bender at 15G while reversing. No injuries reported. Insurance notification sent.', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 47 HOUR),
(1, 'DIAGNOSTIC_CHECK', 'CLEARED',              'Post-incident diagnostic triggered automatically. All sensor calibrations within acceptable parameters.', NOW() - INTERVAL 50 HOUR, NOW() - INTERVAL 50 HOUR),
(1, 'FALSE_ALARM',      'DRIVER_OVERRIDE',      'Pothole at 4.2G triggered WARNING stage. Driver overrode confirmed road surface impact, not collision.', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
(1, 'SEVERE_CRASH',     'RESOLVED',             'T-bone collision at intersection: 58G lateral. Airbags deployed. Driver transported to hospital. Fully resolved.', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY),
(1, 'TRAFFIC_HAZARD',   'RESOLVED',             'V2X alert: school zone speed violation warning. Speed automatically limited to 30 km/h for 2.1 km zone.', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),
(1, 'WARNING',          'RESOLVED',             'High-G cornering detected (1.8G lateral). Driver counselling note added to safety log.', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY),
(1, 'DIAGNOSTIC_CHECK', 'CLEARED',              'Weekly scheduled diagnostic completed. Firmware v3.2.1 applied to crash detection module.', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY);

SELECT id, stage, status, LEFT(message, 50) as message_preview, created_at FROM alerts ORDER BY created_at DESC;
