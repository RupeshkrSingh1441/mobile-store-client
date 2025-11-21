import { useState, useEffect, useRef } from "react";

const useIdleLogout = (onLogout, onShowModal, idleTime = 2 * 60 * 1000) => {
  const warningShown = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const resetIdleTimer = () => {
      clearTimeout(timerRef.current);

      if (warningShown.current) return;

      timerRef.current = setTimeout(() => {
        warningShown.current = true;
        onShowModal(true); // show popup
      }, idleTime);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));

    resetIdleTimer();

    return () => {
      clearTimeout(timerRef.current);
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
    };
  }, [onLogout, onShowModal, idleTime]);

  // When user clicks "Continue"
  const continueSession = () => {
    warningShown.current = false;
    onShowModal(false);
  };

  // When "Logout" clicked → call parent logout
  const forceLogout = () => {
    onShowModal(false);
    onLogout();
  };

  return { continueSession, forceLogout };
};

export default useIdleLogout;
