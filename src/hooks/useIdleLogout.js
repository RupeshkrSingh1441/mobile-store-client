import { useEffect, useRef, useState } from "react";

export default function useIdleLogout({ timeout = 120000, onTimeout }) {
  const [showPopup, setShowPopup] = useState(false);
  const idleTimer = useRef(null);
  const logoutTimer = useRef(null);

  const resetTimer = () => {
    clearTimeout(idleTimer.current);
    clearTimeout(logoutTimer.current);

    idleTimer.current = setTimeout(() => {
      setShowPopup(true);

      // Auto logout in 2 minutes if no response
      logoutTimer.current = setTimeout(() => {
        onTimeout();  // force logout
      }, timeout);

    }, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(idleTimer.current);
      clearTimeout(logoutTimer.current);
    };
  }, []);

  const stayLoggedIn = () => {
    setShowPopup(false);
    resetTimer();
  };

  return { showPopup, stayLoggedIn };
}
