"use client";

import { useState, useRef, useEffect } from "react";

type Option = { code: string; flag: string; name: string };

const options: Option[] = [
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+55", flag: "🇧🇷", name: "Brasil" },
  { code: "", flag: "🌐", name: "Outro" },
];

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

export default function PhoneField({
  value,
  onChange,
  placeholder,
  focused,
  onFocus,
  onBlur,
}: PhoneFieldProps) {
  const [selected, setSelected] = useState<Option>(options[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOther = selected.code === "";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleFocusIn = () => onFocus();
    const handleFocusOut = (e: FocusEvent) => {
      if (!container.contains(e.relatedTarget as Node)) {
        setDropdownOpen(false);
        onBlur();
      }
    };

    container.addEventListener("focusin", handleFocusIn);
    container.addEventListener("focusout", handleFocusOut);
    return () => {
      container.removeEventListener("focusin", handleFocusIn);
      container.removeEventListener("focusout", handleFocusOut);
    };
  }, [onFocus, onBlur]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (val: string) => {
    if (isOther) {
      // Free input: allow +, digits, spaces, hyphens, parentheses
      const cleaned = val.replace(/[^+\d\s()\-]/g, "").slice(0, 25);
      setInputValue(cleaned);
      onChange(cleaned);
    } else {
      // Allow digits, spaces, hyphens, parentheses
      const formatted = val.replace(/[^\d\s()\-]/g, "").slice(0, 20);
      setInputValue(formatted);
      onChange(`${selected.code} ${formatted}`);
    }
  };

  const handleSelect = (option: Option) => {
    setSelected(option);
    setDropdownOpen(false);
    if (option.code === "") {
      // Switch to free mode, prepend + if they had digits
      const freeValue = inputValue ? `+${inputValue}` : "";
      setInputValue(freeValue);
      onChange(freeValue);
    } else {
      // Switch to country mode, keep only digits
      const digits = inputValue.replace(/\D/g, "");
      setInputValue(digits);
      onChange(`${option.code} ${digits}`);
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const hasValue = inputValue.length > 0;
  const showPlaceholder = !focused && !hasValue;

  return (
    <div ref={containerRef} className="relative h-full w-full flex items-center justify-center">
      {showPlaceholder && (
        <span className="absolute inset-0 flex items-center justify-center text-sm text-text-muted pointer-events-none z-10">
          {placeholder}
        </span>
      )}

      {showPlaceholder && (
        <div
          className="absolute inset-0 z-20 cursor-text"
          onMouseDown={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
        />
      )}

      <div
        className={`flex items-center gap-0 transition-opacity ${showPlaceholder ? "opacity-0" : "opacity-100"}`}
      >
        {/* Country selector */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex items-center gap-1.5 text-sm text-black hover:opacity-70 transition-opacity px-2 py-1"
            tabIndex={-1}
          >
            <span className="text-lg leading-none">{selected.flag}</span>
            {!isOther && (
              <span className="text-xs text-text-muted">{selected.code}</span>
            )}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="ml-0.5">
              <path d="M1 1L5 5L9 1" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black z-30 min-w-[180px]">
              {options.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(opt);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#FACC15] transition-colors text-left ${
                    selected.name === opt.name ? "bg-[#FACC15]/30" : ""
                  }`}
                >
                  <span className="text-base leading-none">{opt.flag}</span>
                  <span className="text-black">{opt.name}</span>
                  {opt.code && (
                    <span className="text-text-muted ml-auto text-xs">{opt.code}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Single input */}
        <input
          ref={inputRef}
          type="tel"
          inputMode={isOther ? "text" : "numeric"}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          maxLength={isOther ? 20 : 15}
          placeholder={isOther ? "+00 00000-0000" : "00 00000-0000"}
          className="bg-transparent border-none outline-none font-body text-sm text-black placeholder:text-text-muted/50 w-40"
        />
      </div>
    </div>
  );
}
