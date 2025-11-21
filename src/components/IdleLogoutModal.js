import React from "react";
import "./IdleLogoutModal.css";

const IdleLogoutModal = ({ show, onContinue, onLogout }) => {
  if (!show) return null;

  return (
    <div className="idle-overlay">
      <div className="idle-modal">
        <h4 className="idle-title">⚠️ Session Timeout</h4>
        <p className="idle-text">
          You’ve been inactive for a while.  
          Would you like to stay signed in?
        </p>

        <div className="idle-actions">
          <button className="btn btn-primary idle-continue" onClick={onContinue}>
            Continue Session
          </button>

          <button className="btn btn-danger idle-logout" onClick={onLogout}>
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdleLogoutModal;
