import { useEffect, useRef, useState } from "react";

const CLOSE_DELAY_MS = 150;

export default function InfoTooltip({ text, label = "What is this?", className = "", variant = "text", learnMoreUrl }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  function cancelScheduledClose() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function openNow() {
    cancelScheduledClose();
    setOpen(true);
  }

  function scheduleClose() {
    cancelScheduledClose();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  useEffect(() => {
    return cancelScheduledClose;
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div
      className={`info-tooltip ${className}`.trim()}
      ref={rootRef}
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="info-tooltip-trigger"
        aria-label={label}
        aria-expanded={open}
        onClick={openNow}
        onBlur={(event) => {
          if (!rootRef.current?.contains(event.relatedTarget)) {
            setOpen(false);
          }
        }}
      >
        {variant === "icon" ? "?" : label}
      </button>
      {open && (
        <div className="info-tooltip-bubble" role="tooltip">
          <p className="info-tooltip-text">{text}</p>
          {learnMoreUrl && (
            <a
              className="info-tooltip-link"
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
