# Vehicle Management Software (In-Vehicle Display Monitor System)

A full-stack Vehicle Management Software system that simulates a modern in-vehicle infotainment dashboard with multimedia, connectivity, GPS tracking, crash alerts, and vehicle health monitoring.

## Tech Stack
- Frontend: React (Vite) + React Router + Axios + React Leaflet
- Backend: Spring Boot (Java 17, REST API)
- Database: MySQL

## Folder Structure
- `frontend/` React UI
- `backend/` Spring Boot service
- `db/` MySQL schema and sample data

## Key Features
- Modern dark Tesla-style dashboard
- Multimedia system (video, music, playlist, volume)
- Simulated Play Store + built-in browser
- Connectivity simulation (WiFi, Bluetooth, GPS)
- Real-time GPS tracking + OpenStreetMap map
- 3-stage crash alert escalation with alarm and “I’m Safe” cancel
- Vehicle management stats (fuel, tyre pressure, service reminders)
- Live Mode toggle with smoother telemetry updates and auto-sync to backend
- Auto-refreshing alerts and simulated network scanning

## Setup Guide

### 1) Frontend (React)
1. `cd frontend`
2. `npm install`
3. Configure environment variables as needed. See `frontend/.env.example`.
4. `npm run dev`
5. Frontend runs on `http://localhost:5173`

### 2) Backend (Spring Boot)
1. `cd backend`
2. Configure environment variables as needed. See `backend/.env.example`.
3. `mvn spring-boot:run`
4. Backend runs on `http://localhost:8080` by default and listens on `0.0.0.0` for live hosting.

### 3) Database (MySQL)
1. Start MySQL.
2. Run `db/schema.sql` to create schema and sample data.
3. Update credentials in `backend/src/main/resources/application.yml` if needed.

### Live / Server Deployment
- Backend server host and port are configurable with `SERVER_ADDRESS` and `SERVER_PORT`.
- Database credentials are configurable with `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.
- Frontend API target is configurable with `VITE_API_BASE_URL`.
- CORS is configurable with `CORS_ALLOWED_ORIGINS`, for example:

```sh
CORS_ALLOWED_ORIGINS=https://your-domain.com SERVER_PORT=8080 mvn spring-boot:run
```

To run five backend instances on one machine for testing or behind a load balancer:

```sh
cd backend
SERVER_COUNT=5 BASE_PORT=8080 sh scripts/run-five-servers.sh
```

This starts instances on ports `8080` through `8084`. In production, run one instance on each server or put these ports behind Nginx/Apache/HAProxy.

For a real backend, set `VITE_USE_MOCK_API=false`. For a frontend-only demo, set `VITE_USE_MOCK_API=true`.

## API Documentation

Base URL: `http://localhost:8080/api`

### Users
- `POST /users`
- `GET /users/{id}`
- `GET /users`

Sample response:
```json
{
  "success": true,
  "message": "User fetched",
  "data": {
    "id": 1,
    "name": "Aarav Rao",
    "email": "aarav@example.com",
    "phone": "+91-90000-10000"
  }
}
```

### Vehicles
- `POST /vehicles`
- `GET /vehicles/{id}`
- `GET /vehicles`

Sample response:
```json
{
  "success": true,
  "message": "Vehicle fetched",
  "data": {
    "id": 1,
    "userId": 1,
    "vin": "VMSVIN001",
    "make": "Tesla",
    "model": "Model 3",
    "year": 2023,
    "plateNumber": "KA-01-AB-1234"
  }
}
```

### Vehicle Stats
- `POST /stats`
- `GET /stats/{id}`
- `GET /stats`

Sample response:
```json
{
  "success": true,
  "message": "Stats fetched",
  "data": {
    "id": 1,
    "vehicleId": 1,
    "tyrePressureFL": 33.0,
    "tyrePressureFR": 33.5,
    "tyrePressureRL": 34.0,
    "tyrePressureRR": 33.2,
    "fuelLevel": 72.0,
    "mileageKm": 15200.5,
    "cabinTemperature": 23.5,
    "seatCondition": "Good",
    "cleanliness": "Clean"
  }
}
```

### Alerts
- `POST /alerts`
- `PUT /alerts/{id}/resolve`
- `GET /alerts`

Sample response:
```json
{
  "success": true,
  "message": "Alert created",
  "data": {
    "id": 1,
    "vehicleId": 1,
    "stage": "SEVERE_CRASH",
    "status": "ACTIVE",
    "message": "Automatic alert at 12.9716, 77.5946",
    "createdAt": "2026-03-28T10:10:00"
  }
}
```

### Locations
- `POST /locations`
- `GET /locations/{id}`
- `GET /locations`

Sample response:
```json
{
  "success": true,
  "message": "Location saved",
  "data": {
    "id": 1,
    "vehicleId": 1,
    "latitude": 12.9716,
    "longitude": 77.5946,
    "speedKph": 48.0,
    "recordedAt": "2026-03-28T10:10:00"
  }
}
```

## Mock UI Screens (Descriptions)
- **Dashboard**: Large cards for fuel, mileage, temperature, cleanliness; quick actions row; live coordinates tile.
- **Media**: Full-width video player, playlist buttons, volume slider, and file browser.
- **Apps**: Grid of app cards with install buttons; embedded browser view.
- **Connectivity**: Toggle switches for WiFi/Bluetooth/GPS, real-time status pills.
- **GPS**: OpenStreetMap map with marker and coordinates panel.
- **Alerts**: Crash stages and countdown, alert history table.

## Notes
- Hardware features (sensors, crash detection, connectivity) are simulated.
- GPS uses browser geolocation when available.
- Map tiles served by OpenStreetMap.

## License
MIT
