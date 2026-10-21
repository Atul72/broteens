"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  options: (string | DropdownOption)[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format option objects
  const parsedOptions: DropdownOption[] = options.map((opt) => {
    if (typeof opt === "string") {
      // Check if string contains parentheses like "All Contacts (12,548)"
      const match = opt.match(/^(.*?)(\s*\([^)]+\))?$/);
      if (match && match[2]) {
        return {
          label: match[1].trim(),
          badge: match[2].trim(),
        };
      }
      return { label: opt };
    }
    return opt;
  });

  const selectedOption =
    parsedOptions.find(
      (opt) =>
        opt.label === value ||
        `${opt.label} ${opt.badge || ""}`.trim() === value,
    ) || (value ? { label: value } : null);

  return (
    <div className="relative w-full select-none" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between text-xs font-medium bg-white rounded-xl px-3 py-2 border transition-all duration-200 outline-none ${
          isOpen
            ? "border-lavender-500 ring-2 ring-lavender-200 text-slate-900 shadow-sm"
            : "border-slate-200/90 hover:border-lavender-300 text-slate-700 hover:bg-slate-50/50"
        }`}
      >
        <div className="flex items-center gap-1.5 truncate pr-2">
          {selectedOption?.icon && (
            <span className="shrink-0 text-lavender-600">
              {selectedOption.icon}
            </span>
          )}
          <span
            className={`truncate ${
              selectedOption
                ? "font-semibold text-slate-800"
                : "font-normal text-slate-400"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[11px] text-slate-400 font-normal">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-lavender-600" : "text-slate-400"
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-40 left-0 top-full mt-1.5 w-full min-w-[210px] bg-white rounded-xl border border-slate-200 shadow-xl shadow-lavender-500/10 p-1.5 animate-in fade-in-50 zoom-in-95 duration-150"
        >
          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {parsedOptions.map((opt, idx) => {
              const fullVal = `${opt.label} ${opt.badge || ""}`.trim();
              const isSelected = value === fullVal || value === opt.label;

              return (
                <button
                  key={idx}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(fullVal);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left group ${
                    isSelected
                      ? "bg-lavender-100 text-lavender-900 font-semibold"
                      : "text-slate-700 hover:bg-lavender-50 hover:text-lavender-700"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && (
                      <span className="text-slate-400 group-hover:text-lavender-600">
                        {opt.icon}
                      </span>
                    )}
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                          isSelected
                            ? "bg-lavender-200 text-lavender-800"
                            : "bg-slate-100 text-slate-500 group-hover:bg-lavender-100 group-hover:text-lavender-700"
                        }`}
                      >
                        {opt.badge.replace(/[()]/g, "")}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-lavender-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
