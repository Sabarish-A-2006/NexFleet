import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../api/axios.js";
import { useNotifications } from "./NotificationContext.jsx";
import { getNextStats, getRandomStats } from "../utils/simulators.js";
import {
  onAuthStateChanged,
  signOut as signOutFromFirebase,
} from "../services/firebase.js";

const AppContext = createContext();

const mapFirebaseUser = (user) => {
  if (!user) return null;
  if (!user.uid && user.name) return user;

  return {
    uid: user.uid,
    name: user.displayName ?? user.email ?? "NexFleet User",
    email: user.email,
    photoURL: user.photoURL,
    role: "Viewer",
  };
};

export function AppProvider({ children }) {
  const { pushNotification } = useNotifications();
  const [vehicleId] = useState(1);
  const [stats, setStats] = useState(getRandomStats());
  const [wifiConnected, setWifiConnected] = useState(true);
  const [bluetoothConnected, setBluetoothConnected] = useState(true);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [location, setLocation] = useState({
    lat: 12.9716,
    lng: 77.5946,
    speed: 45,
  });
  const [liveMode, setLiveMode] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("vms_theme") || "light";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.add("theme-switching");
    const timer = setTimeout(() => {
      root.classList.remove("theme-switching");
    }, 200);
    localStorage.setItem("vms_theme", theme);
    return () => clearTimeout(timer);
  }, [theme]);

  const [crashStage, setCrashStage] = useState(null);
  const [crashCountdown, setCrashCountdown] = useState(null);
  const [crashActive, setCrashActive] = useState(false);

  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      setStats((prev) => getNextStats(prev));
    }, 5000);
    return () => clearInterval(interval);
  }, [liveMode]);

  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      // Soft-fluctuate connectivity to feel more live.
      setWifiConnected((prev) => (Math.random() > 0.92 ? !prev : prev));
      setBluetoothConnected((prev) => (Math.random() > 0.95 ? !prev : prev));
    }, 20000);
    return () => clearInterval(interval);
  }, [liveMode]);

  const headingRef = React.useRef(45); // Start driving North-East

  useEffect(() => {
    if (!gpsEnabled || !liveMode) return;

    const interval = setInterval(() => {
      setLocation((prev) => {
        // Smoothly adjust heading by up to +/- 5 degrees
        headingRef.current += (Math.random() - 0.5) * 10;
        const headingRad = headingRef.current * (Math.PI / 180);

        // Target an average cruising speed around 50-70 km/h, smoothly adjusting
        let newSpeed = prev.speed + (Math.random() - 0.5) * 5;
        // Clamp speed to realistic bounds
        if (newSpeed < 10) newSpeed = 10 + Math.random() * 5;
        if (newSpeed > 90) newSpeed = 90 - Math.random() * 5;

        // Calculate distance traveled in exactly 2 seconds
        const distanceKm = (newSpeed / 3600) * 2;

        // 1 degree latitude = approx 111.32 km
        const latDelta = (distanceKm * Math.cos(headingRad)) / 111.32;
        // Adjust longitude scalar by latitude to account for earth's curvature
        const lngDelta =
          (distanceKm * Math.sin(headingRad)) /
          (111.32 * Math.cos(prev.lat * (Math.PI / 180)));

        return {
          lat: prev.lat + latDelta,
          lng: prev.lng + lngDelta,
          speed: newSpeed,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [gpsEnabled, liveMode]);

  useEffect(() => {
    if (!location || !gpsEnabled || !liveMode) return;
    api
      .post("/locations", {
        vehicleId,
        latitude: location.lat,
        longitude: location.lng,
        speedKph: Number(location.speed || 0),
      })
      .catch(() => {});
  }, [location, gpsEnabled, vehicleId, liveMode]);

  useEffect(() => {
    if (!liveMode) return;
    const interval = setInterval(() => {
      api
        .post("/stats", {
          vehicleId,
          tyrePressureFL: stats.tyrePressureFL,
          tyrePressureFR: stats.tyrePressureFR,
          tyrePressureRL: stats.tyrePressureRL,
          tyrePressureRR: stats.tyrePressureRR,
          fuelLevel: stats.fuelLevel,
          mileageKm: stats.mileageKm,
          cabinTemperature: stats.cabinTemperature,
          seatCondition: stats.seatCondition,
          cleanliness: stats.cleanliness,
        })
        .catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [liveMode, vehicleId, stats]);

  const triggerImpact = () => {
    if (crashActive) return;
    setCrashActive(true);
    setCrashStage("WARNING");
    setCrashCountdown(10);
    pushNotification("Minor impact detected. Awaiting response...", "warning");
  };

  const login = useCallback((user) => {
    setCurrentUser(mapFirebaseUser(user) ?? user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutFromFirebase();
    } catch (error) {
      console.error("Firebase sign-out failed:", error);
      pushNotification("Sign-out failed. Please try again.", "danger");
      return;
    }

    setCurrentUser(null);
    pushNotification("Signed out successfully.", "success");
  }, [pushNotification]);

  useEffect(() => {
    let unsubscribe;
    let mounted = true;

    onAuthStateChanged(
      (user) => {
        if (!mounted) return;
        setCurrentUser(mapFirebaseUser(user));
        setAuthReady(true);
      },
      (error) => {
        console.error("Firebase auth state listener failed:", error);
        if (mounted) {
          setCurrentUser(null);
          setAuthReady(true);
        }
      },
    )
      .then((removeListener) => {
        unsubscribe = removeListener;
      })
      .catch((error) => {
        console.error("Firebase auth state listener failed:", error);
        if (mounted) {
          setCurrentUser(null);
          setAuthReady(true);
        }
      });

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!crashActive || crashCountdown === null) return;
    if (crashCountdown <= 0) {
      if (crashStage === "WARNING") {
        setCrashStage("SMALL_CRASH");
        setCrashCountdown(30);
        pushNotification(
          "No response detected. Escalating to Small Crash.",
          "danger",
        );
      } else if (crashStage === "SMALL_CRASH") {
        setCrashStage("SEVERE_CRASH");
        setCrashCountdown(60);
        pushNotification(
          "Severe crash risk. Sending emergency alerts soon.",
          "danger",
        );
      } else if (crashStage === "SEVERE_CRASH") {
        sendEmergencyAlert();
        setCrashActive(false);
        setCrashCountdown(null);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCrashCountdown((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearTimeout(timer);
  }, [crashActive, crashCountdown, crashStage]);

  const cancelCrashAlert = async () => {
    const stageWhenCanceled = crashStage;
    setCrashActive(false);
    setCrashStage(null);
    setCrashCountdown(null);
    pushNotification("System disarmed. False alarm logged.", "success");

    try {
      await api.post("/alerts", {
        vehicleId,
        stage: "FALSE_ALARM",
        status: "DRIVER_OVERRIDE",
        message: `Driver manually canceled alert at stage: ${stageWhenCanceled}`,
      });
    } catch (e) {
      // Ignored for simulator
    }
  };

  const sendEmergencyAlert = async () => {
    pushNotification("Fetching High-Accuracy GPS Coordinates...", "danger");

    setTimeout(async () => {
      pushNotification(
        `Dispatching SOS to Nearest Police Station & Hospital at LAT ${location.lat.toFixed(4)}, LNG ${location.lng.toFixed(4)}`,
        "danger",
      );
      try {
        await api.post("/alerts", {
          vehicleId,
          stage: "SEVERE_CRASH",
          status: "EMERGENCY_DISPATCHED",
          message: `Dispatched Police & Hospital to ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        });
      } catch (err) {
        pushNotification(
          "Network failure. Local satellite SOS backup engaged to contact Hospital.",
          "danger",
        );
      }
    }, 1500);
  };

  const value = useMemo(
    () => ({
      vehicleId,
      stats,
      wifiConnected,
      bluetoothConnected,
      gpsEnabled,
      location,
      liveMode,
      currentUser,
      authReady,
      theme,
      login,
      logout,
      setWifiConnected,
      setBluetoothConnected,
      setGpsEnabled,
      setLiveMode,
      setTheme,
      triggerImpact,
      crashStage,
      crashCountdown,
      crashActive,
      cancelCrashAlert,
    }),
    [
      vehicleId,
      stats,
      wifiConnected,
      bluetoothConnected,
      gpsEnabled,
      location,
      liveMode,
      currentUser,
      authReady,
      theme,
      login,
      logout,
      crashStage,
      crashCountdown,
      crashActive,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
