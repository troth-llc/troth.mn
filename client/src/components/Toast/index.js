import React, { useEffect, useContext } from "react";
import { MDCSnackbar } from "@material/snackbar";
import { Snackbar } from "context/notification-toast";

const Toast = () => {
  const { toast } = useContext(Snackbar);
  useEffect(() => {
    if (toast) {
      const snackbar = new MDCSnackbar(document.querySelector(".mdc-snackbar"));
      snackbar.timeoutMs = toast.timeout;
      snackbar.open();
    }
  }, [toast]);
  return toast ? (
    <div className="mdc-snackbar">
      <div className="mdc-snackbar__surface">
        <div className="mdc-snackbar__label" role="status" aria-live="polite">
          {toast.msg}
        </div>
        <div className="mdc-snackbar__actions">
          {toast.action ? (
            <button
              type="button"
              className="mdc-button mdc-snackbar__action"
              onClick={toast.action.event}
            >
              <div className="mdc-button__ripple"></div>
              <span className="mdc-button__label">{toast.action.title}</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};
export default Toast;
