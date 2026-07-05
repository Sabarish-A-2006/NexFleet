import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useNotifications } from "../context/NotificationContext";
import {
  loginWithEmail,
  registerWithEmail,
  signInWithGoogle,
} from "../services/firebase";
import { User, Lock, Mail, ShieldCheck, ArrowRight, Sun, Moon } from "lucide-react";
import "../styles/login.css";

const getFirebaseMessage = (error) => {
  if (error?.code === "auth/email-not-verified")
    return "Please verify your email before logging in.";
  if (error?.code === "auth/email-already-in-use")
    return "An account with this email already exists.";
  if (error?.code === "auth/invalid-credential")
    return "Invalid email or password.";
  if (error?.code === "auth/popup-closed-by-user")
    return "Google sign-in was closed before it finished.";
  if (error?.code === "auth/configuration-not-found")
    return "Firebase Auth is not enabled for this project yet.";
  if (error?.code === "auth/operation-not-allowed")
    return "Google sign-in is not enabled in Firebase Auth yet.";
  if (error?.code === "auth/unauthorized-domain")
    return "This domain is not authorized in Firebase Auth.";
  return "Firebase sign-in failed. Please try again.";
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { login, theme, setTheme } = useApp();
  const { pushNotification } = useNotifications();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      login(user);
      pushNotification("Google login successful!", "success");
      navigate("/dashboard");
    } catch (error) {
      pushNotification(getFirebaseMessage(error), "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const displayName = formData.username.trim();
      const email = formData.email.trim().toLowerCase();
      const password = formData.password.trim();
      const confirmPassword = formData.confirmPassword.trim();

      if (isLogin) {
        const user = await loginWithEmail({ email, password });
        login({
          name: user.displayName ?? user.email ?? "NexFleet User",
          role: "Viewer",
        });
        pushNotification("Welcome back to NexFleet!", "success");
        navigate("/dashboard");
        return;
      }

      if (password.length < 6) {
        pushNotification("Password must be at least 6 characters.", "danger");
        return;
      }
      if (password !== confirmPassword) {
        pushNotification("Passwords do not match.", "danger");
        return;
      }

      await registerWithEmail({ email, password, displayName });
      pushNotification(
        "Account created. Please verify your email before logging in.",
        "success"
      );
      setIsLogin(true);
      setFormData({ username: "", password: "", email, confirmPassword: "" });
    } catch (error) {
      pushNotification(getFirebaseMessage(error), "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
        <div className="login-particle" />
        <div className="login-particle" />
        <div className="login-particle" />
        <div className="login-particle" />
        <div className="login-particle" />
        <div className="login-particle" />
      </div>

      {/* Theme toggle */}
      <button
        className="login-theme-toggle"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Glassmorphism card */}
      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <img src="/logo-icon.png" alt="NexFleet Logo" className="login-brand-logo-img" />
          <h1 className="login-brand-title">NexFleet</h1>
          <p className="login-brand-sub">
            {isLogin
              ? "Sign in to your control panel"
              : "Create a new VMS account"}
          </p>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={"login-tab" + (isLogin ? " active" : "")}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={"login-tab" + (!isLogin ? " active" : "")}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="login-field">
              <label className="login-label">Username</label>
              <div className="login-input-wrap">
                <User size={17} className="login-input-icon" />
                <input
                  className="login-input"
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="login-field">
            <label className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <Mail size={17} className="login-input-icon" />
              <input
                className="login-input"
                type="email"
                name="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <Lock size={17} className="login-input-icon" />
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="login-field">
              <label className="login-label">Confirm Password</label>
              <div className="login-input-wrap">
                <Lock size={17} className="login-input-icon" />
                <input
                  className="login-input"
                  type="password"
                  name="confirmPassword"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <div className="login-spinner" />
            ) : (
              <>
                <span>{isLogin ? "Launch Control Panel" : "Create Account"}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-divider"><span>OR</span></div>

        {/* Google */}
        <button
          type="button"
          id="google-signin-btn"
          className="login-google-btn"
          onClick={handleGoogleSuccess}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          <span>{loading ? "Signing in\u2026" : "Continue with Google"}</span>
        </button>

        {/* Footer */}
        <div className="login-footer">
          <p className="login-footer-text">
            {isLogin ? "Need a new account?" : "Already have an account?"}
            <button className="login-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Register Now" : "Sign In Now"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
