import React, { useState, useRef, useEffect } from "react";

export default function CustomDropdown({
  value,
  options,
  onChange,
  className = "",
  ariaLabel = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(val) {
    onChange(val);
    setOpen(false);
  }

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : "";

  return (
    <div ref={ref} className={`custom-dropdown-wrapper ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        className="custom-dropdown-button"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="custom-dropdown-label">{displayLabel}</span>
        <span className="custom-dropdown-arrow">{open ? "▼" : "▶"}</span>
      </button>

      {open && (
        <div className="custom-dropdown-menu">
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`custom-dropdown-item ${
                opt.value === value ? "selected" : ""
              }`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
