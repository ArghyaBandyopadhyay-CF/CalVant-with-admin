import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import SessionExpiredModal from "../components/SessionExpiredModal";

/* ================= CONFIG ================= */
const IDLE_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
const CHECK_INTERVAL_MS = 5000; // Check every 5 seconds

/* ================= HELPERS ================= */
const isJwtExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch (err) {
    console.error("Invalid JWT:", err);
    return true;
  }
};

/* ================= CONTEXT ================= */
const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

/* ================= PROVIDER ================= */
export const SessionProvider = ({ children }) => {
  const history = useHistory();
  const [sessionExpired, setSessionExpired] = useState(false);
  const isAuthenticated =
    !!sessionStorage.getItem("token") && !!sessionStorage.getItem("user");
  const idleTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const hadSessionRef = useRef(false);

  useEffect(() => {
    const resetTimer = () => (lastActivityRef.current = Date.now());
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    return () =>
      events.forEach((e) => window.removeEventListener(e, resetTimer));
  }, []);

  useEffect(() => {
    idleTimerRef.current = setInterval(() => {
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");

      if (hadSessionRef.current) {
        const idleTime = Date.now() - lastActivityRef.current;
        const expired =
          !token || !user || idleTime >= IDLE_TIMEOUT_MS || isJwtExpired(token);

        if (expired) {
          setSessionExpired(true);
          hadSessionRef.current = false;
        }
      } else if (token && user) {
        hadSessionRef.current = true;
        lastActivityRef.current = Date.now();
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(idleTimerRef.current);
  }, []);

const logout = async () => {
    const userObj = JSON.parse(sessionStorage.getItem('user') || '{}');
    const email = sessionStorage.getItem('email') || userObj.email || 'unknown@example.com';
    const name  = sessionStorage.getItem('uname') || userObj.name || email;
    const token = sessionStorage.getItem('token') || '';
    // Log LOGOUT via direct fetch — same reliable approach as LOGIN
    try {
      await fetch('https://api.calvant.com/logging-service/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, email, url: window.location.pathname, action: 'LOGOUT', item: null }),
        keepalive: true,
      });
    } catch (err) {
      console.warn('Logout log failed:', err);
    }
    sessionStorage.clear();
    setSessionExpired(false);
    hadSessionRef.current = false;
    history.replace("/login");
  };


  return (
    <SessionContext.Provider
      value={{ sessionExpired, logout, isAuthenticated }}
    >
      {children}
      {/* {sessionExpired && <SessionExpiredModal onOk={logout} />} */}
    </SessionContext.Provider>
  );
};
