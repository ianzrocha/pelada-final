import React, { useState, useRef, useEffect } from "react";
import CustomDropdown from "./CustomDropdown";

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function parseISOToLocal(iso) {
  if (!iso) return null;
  const parts = String(iso).split("-");
  if (parts.length < 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  return new Date(y, m, d);
}

function formatDisplay(iso) {
  const d = parseISOToLocal(iso);
  if (!d || isNaN(d)) return "";
  return d.toLocaleDateString("pt-BR");
}

function formatLocalToISO(d) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? parseISOToLocal(value) : new Date());
  const ref = useRef();

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setViewDate(value ? parseISOToLocal(value) : new Date());
  }, [value]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handlePick(day) {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(formatLocalToISO(d));
    setOpen(false);
  }

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = startOfMonth(viewDate);
  const offset = first.getDay(); // 0 (Sun) - 6 (Sat)
  const days = daysInMonth(viewDate);

  const today = new Date();
  const selected = value ? parseISOToLocal(value) : null;

  const monthsList = Array.from({ length: 12 }).map((_, i) =>
    new Date(0, i).toLocaleString("pt-BR", { month: "long" }),
  );
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 121 }).map((_, i) => currentYear - i);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        readOnly
        className="form-control"
        value={formatDisplay(value)}
        placeholder={placeholder}
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "#0a0a0a",
          border: "1px solid #444",
          borderRadius: "8px",
          padding: "0.75rem 1rem",
          color: "#fff",
          fontSize: "0.95rem",
          cursor: "pointer",
              width: '100%'
        }}
      />

      {open && (
        <div
          className="custom-datepick"
          style={{
            position: "absolute",
            zIndex: 60,
                left: 0,
            marginTop: "8px",
                minWidth: 220,
                maxWidth: 360,
          }}
        >
          <div
            className="dp-header"
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <button type="button" className="dp-nav" onClick={prevMonth}>
              {"\u25C0"}
            </button>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <CustomDropdown
                value={month}
                options={monthsList.map((m, i) => ({ value: i, label: m }))}
                onChange={(val) => {
                  setViewDate(
                    (d) => new Date(d.getFullYear(), parseInt(val), 1),
                  );
                }}
                className="dp-select-month"
                ariaLabel="Mês"
              />
              <CustomDropdown
                value={year}
                options={yearsList.map((y) => ({ value: y, label: String(y) }))}
                onChange={(val) => {
                  setViewDate(
                    (d) => new Date(parseInt(val), d.getMonth(), 1),
                  );
                }}
                className="dp-select-year"
                ariaLabel="Ano"
              />
            </div>
            <button type="button" className="dp-nav" onClick={nextMonth}>
              {"\u25B6"}
            </button>
          </div>
          <div className="dp-grid">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((h, i) => (
              <div key={i} className="dp-cell dp-head">
                {h}
              </div>
            ))}

            {Array.from({ length: offset }).map((_, i) => (
              <div key={"e-" + i} className="dp-cell empty" />
            ))}

            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;
              const isSelected =
                selected &&
                selected.getFullYear() === year &&
                selected.getMonth() === month &&
                selected.getDate() === day;
              return (
                <button
                  type="button"
                  key={day}
                  className={`dp-cell day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                  onClick={() => handlePick(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "space-between",
              padding: "8px 12px",
            }}
          >
            <button
              type="button"
              className="btn btn-sm btn-outline-light"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              Limpar
            </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={() => {
                  const d = new Date();
                  onChange(formatLocalToISO(d));
                  setOpen(false);
                }}
              >
                Hoje
              </button>
          </div>
        </div>
      )}
    </div>
  );
}
