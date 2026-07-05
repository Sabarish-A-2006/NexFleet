#!/usr/bin/env sh
set -eu

BASE_PORT="${BASE_PORT:-8080}"
SERVER_COUNT="${SERVER_COUNT:-5}"
PIDS=""

cleanup() {
  for pid in $PIDS; do
    kill "$pid" 2>/dev/null || true
  done
}

trap cleanup INT TERM EXIT

if [ -f "target/vehicle-management-1.0.0.jar" ]; then
  RUNNER="jar"
elif [ -x "./mvnw" ]; then
  RUNNER="mvnw"
elif command -v mvn >/dev/null 2>&1; then
  RUNNER="mvn"
else
  echo "Maven is required, or build target/vehicle-management-1.0.0.jar first." >&2
  exit 1
fi

i=0
while [ "$i" -lt "$SERVER_COUNT" ]; do
  port=$((BASE_PORT + i))
  echo "Starting VMS backend instance $((i + 1)) on port $port"
  if [ "$RUNNER" = "jar" ]; then
    SERVER_PORT="$port" java -jar target/vehicle-management-1.0.0.jar &
  elif [ "$RUNNER" = "mvnw" ]; then
    SERVER_PORT="$port" ./mvnw spring-boot:run &
  else
    SERVER_PORT="$port" mvn spring-boot:run &
  fi
  PIDS="$PIDS $!"
  i=$((i + 1))
done

wait
